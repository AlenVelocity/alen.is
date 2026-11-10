'use client'

import { useEffect, useRef, useState, useCallback, useImperativeHandle, forwardRef } from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { FiArrowRight } from 'react-icons/fi'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { posthog } from '@/components/posthog-provider'
import { Persona, OnlyBan } from '@/components/persona'
import { PERSONA_EVENT, switchPersona } from '@/lib/persona'

/**
 * /lost, where a missing page ends up (not-found.tsx redirects here). It is
 * an interactive Conway's Game of Life drawn in whichever palette is in use:
 * draw cells (or seed a random soup), hit run, and watch the colony evolve.
 * The HUD tracks generation and population like a probe telemetry readout.
 */

const CELL_SIZE = 16
const SPEED = 120 // ms between generations
const SEED_DENSITY = 0.12 // fraction of cells alive after pressing seed

interface Palette {
    background: string
    cell: string
    grid: string
}

/**
 * The canvas cannot use CSS variables, so the colours are read off <html> and
 * handed to it. The tokens hold bare "h s% l%" triples, which is what lets an
 * alpha be added here. Four palettes come out of this: Alen and Ban, each in
 * light and dark.
 */
function readPalette(): Palette {
    const root = document.documentElement
    const style = getComputedStyle(root)
    const accent = style.getPropertyValue('--accent').trim()
    const background = style.getPropertyValue('--background').trim()
    // A light page needs a little more ink for the same weight
    const isDark = root.classList.contains('dark')
    return {
        background: `hsl(${background})`,
        cell: `hsl(${accent} / ${isDark ? 0.85 : 0.9})`,
        grid: `hsl(${accent} / ${isDark ? 0.05 : 0.07})`
    }
}

// Create empty grid
function createEmptyGrid(rows: number, cols: number): boolean[][] {
    return Array.from({ length: rows }, () => Array.from({ length: cols }, () => false))
}

function countPopulation(grid: boolean[][]): number {
    let n = 0
    for (const row of grid) for (const cell of row) if (cell) n++
    return n
}

// Count live neighbors (toroidal wrap)
function countNeighbors(grid: boolean[][], row: number, col: number): number {
    const rows = grid.length
    const cols = grid[0].length
    let count = 0

    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue
            const newRow = (row + i + rows) % rows
            const newCol = (col + j + cols) % cols
            if (grid[newRow][newCol]) count++
        }
    }
    return count
}

// Compute next generation
function nextGeneration(grid: boolean[][]): boolean[][] {
    return grid.map((row, i) =>
        row.map((cell, j) => {
            const neighbors = countNeighbors(grid, i, j)
            if (cell) {
                return neighbors === 2 || neighbors === 3
            }
            return neighbors === 3
        })
    )
}

export interface GameOfLifeRef {
    redraw: () => void
    resetGeneration: () => void
}

const GameOfLife = forwardRef<
    GameOfLifeRef,
    {
        isPlaying: boolean
        gridRef: React.MutableRefObject<boolean[][] | null>
        onCellToggle: (row: number, col: number) => void
        onStats: (gen: number, pop: number) => void
    }
>(function GameOfLife({ isPlaying, gridRef, onCellToggle, onStats }, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const animationRef = useRef<number | null>(null)
    const lastUpdateRef = useRef<number>(0)
    const paletteRef = useRef<Palette | null>(null)
    const isDrawingRef = useRef(false)
    const isPanningRef = useRef(false)
    const panStartRef = useRef({ x: 0, y: 0 })
    const [offset, setOffset] = useState({ x: 0, y: 0 })
    const offsetRef = useRef({ x: 0, y: 0 })
    const generationRef = useRef(0)
    const onStatsRef = useRef(onStats)

    useEffect(() => {
        onStatsRef.current = onStats
    }, [onStats])

    // Keep offsetRef in sync with offset state
    useEffect(() => {
        offsetRef.current = offset
    }, [offset])

    const draw = useCallback(() => {
        const canvas = canvasRef.current
        const ctx = canvas?.getContext('2d')
        const grid = gridRef.current

        if (!canvas || !ctx || !grid) return

        // CSS pixels: the backing store is devicePixelRatio times larger (see resize)
        const w = canvas.clientWidth
        const h = canvas.clientHeight

        // Page background, the colony in the accent, and a faint accent grid.
        // Read once and kept until the theme or the person changes (see below).
        const palette = (paletteRef.current ??= readPalette())
        ctx.fillStyle = palette.background
        ctx.fillRect(0, 0, w, h)

        const currentOffset = offsetRef.current

        // Draw grid lines with offset
        ctx.strokeStyle = palette.grid
        ctx.lineWidth = 1

        const startRow = Math.floor(-currentOffset.y / CELL_SIZE)
        const endRow = Math.ceil((h - currentOffset.y) / CELL_SIZE)
        const startCol = Math.floor(-currentOffset.x / CELL_SIZE)
        const endCol = Math.ceil((w - currentOffset.x) / CELL_SIZE)

        for (let i = startRow; i <= endRow; i++) {
            const y = i * CELL_SIZE + currentOffset.y
            ctx.beginPath()
            ctx.moveTo(0, y)
            ctx.lineTo(w, y)
            ctx.stroke()
        }
        for (let j = startCol; j <= endCol; j++) {
            const x = j * CELL_SIZE + currentOffset.x
            ctx.beginPath()
            ctx.moveTo(x, 0)
            ctx.lineTo(x, h)
            ctx.stroke()
        }

        // Draw cells with offset
        ctx.fillStyle = palette.cell
        grid.forEach((row, i) => {
            row.forEach((cell, j) => {
                if (cell) {
                    const x = j * CELL_SIZE + currentOffset.x
                    const y = i * CELL_SIZE + currentOffset.y
                    // Only draw if visible
                    if (x + CELL_SIZE > 0 && x < w && y + CELL_SIZE > 0 && y < h) {
                        ctx.fillRect(x + 1, y + 1, CELL_SIZE - 2, CELL_SIZE - 2)
                    }
                }
            })
        })

        // Telemetry readout for the HUD
        onStatsRef.current(generationRef.current, countPopulation(grid))
    }, [gridRef])

    // The colours change when the theme does (the `dark` class on <html>) and when
    // the other person takes over (PERSONA_EVENT). Either way: read them again and
    // repaint. The theme is watched on the element, not through next-themes' state,
    // so the class is certain to be on <html> by the time this runs.
    useEffect(() => {
        const repaint = () => {
            paletteRef.current = readPalette()
            draw()
        }
        repaint()
        const observer = new MutationObserver(repaint)
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
        window.addEventListener(PERSONA_EVENT, repaint)
        return () => {
            observer.disconnect()
            window.removeEventListener(PERSONA_EVENT, repaint)
        }
    }, [draw])

    // Expose imperative controls to the parent
    useImperativeHandle(
        ref,
        () => ({
            redraw: () => draw(),
            resetGeneration: () => {
                generationRef.current = 0
            }
        }),
        [draw]
    )

    const animate = useCallback(
        (timestamp: number) => {
            if (!isPlaying) return

            if (timestamp - lastUpdateRef.current >= SPEED) {
                if (gridRef.current) {
                    gridRef.current = nextGeneration(gridRef.current)
                    generationRef.current += 1
                    draw()
                }
                lastUpdateRef.current = timestamp
            }

            animationRef.current = requestAnimationFrame(animate)
        },
        [isPlaying, draw, gridRef]
    )

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const resize = () => {
            // Backing store at device resolution so cells stay crisp on HiDPI screens;
            // everything else keeps working in CSS pixels through the context transform
            const dpr = window.devicePixelRatio || 1
            canvas.width = Math.round(window.innerWidth * dpr)
            canvas.height = Math.round(window.innerHeight * dpr)
            canvas.style.width = `${window.innerWidth}px`
            canvas.style.height = `${window.innerHeight}px`
            canvas.getContext('2d')?.setTransform(dpr, 0, 0, dpr, 0, 0)

            const cols = Math.ceil(window.innerWidth / CELL_SIZE) + 20
            const rows = Math.ceil(window.innerHeight / CELL_SIZE) + 20

            const oldGrid = gridRef.current
            if (!oldGrid || oldGrid.length !== rows || oldGrid[0]?.length !== cols) {
                const newGrid = createEmptyGrid(rows, cols)
                // Copy existing cells to new grid
                if (oldGrid) {
                    for (let i = 0; i < Math.min(oldGrid.length, rows); i++) {
                        for (let j = 0; j < Math.min(oldGrid[0].length, cols); j++) {
                            newGrid[i][j] = oldGrid[i][j]
                        }
                    }
                }
                gridRef.current = newGrid
            }
            draw()
        }

        resize()
        window.addEventListener('resize', resize)

        return () => {
            window.removeEventListener('resize', resize)
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
        }
    }, [draw, gridRef])

    useEffect(() => {
        if (isPlaying) {
            animationRef.current = requestAnimationFrame(animate)
        } else if (animationRef.current) {
            cancelAnimationFrame(animationRef.current)
        }

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
        }
    }, [isPlaying, animate])

    useEffect(() => {
        draw()
    }, [draw, offset])

    const screenToGrid = (clientX: number, clientY: number) => {
        const rect = canvasRef.current?.getBoundingClientRect()
        if (!rect) return { row: -1, col: -1 }
        const col = Math.floor((clientX - rect.left - offsetRef.current.x) / CELL_SIZE)
        const row = Math.floor((clientY - rect.top - offsetRef.current.y) / CELL_SIZE)
        return { row, col }
    }

    const handleMouseDown = (e: React.MouseEvent) => {
        // Right-click or middle-click for panning
        if (e.button === 2 || e.button === 1) {
            e.preventDefault()
            isPanningRef.current = true
            panStartRef.current = { x: e.clientX - offsetRef.current.x, y: e.clientY - offsetRef.current.y }
            return
        }

        // Left-click for drawing (only when not playing)
        if (isPlaying) return
        isDrawingRef.current = true
        const { row, col } = screenToGrid(e.clientX, e.clientY)
        onCellToggle(row, col)
        draw()
    }

    const handleMouseMove = (e: React.MouseEvent) => {
        // Panning
        if (isPanningRef.current) {
            const newOffset = {
                x: e.clientX - panStartRef.current.x,
                y: e.clientY - panStartRef.current.y
            }
            offsetRef.current = newOffset
            setOffset(newOffset)
            draw()
            return
        }

        // Drawing
        if (!isDrawingRef.current || isPlaying) return
        const { row, col } = screenToGrid(e.clientX, e.clientY)
        if (!gridRef.current) return
        if (row >= 0 && row < gridRef.current.length && col >= 0 && col < gridRef.current[0].length) {
            if (!gridRef.current[row][col]) {
                gridRef.current[row][col] = true
                draw()
            }
        }
    }

    const handleMouseUp = () => {
        isDrawingRef.current = false
        isPanningRef.current = false
    }

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault()
    }

    return (
        <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onContextMenu={handleContextMenu}
            className={cn('fixed inset-0 z-0', !isPlaying && 'cursor-crosshair')}
        />
    )
})

function CollapsedNav({ onExpand }: { onExpand: () => void }) {
    return (
        <motion.button
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            onClick={onExpand}
            className="fixed left-4 top-4 z-50 px-2 py-1.5 rounded-sm bg-background/90 backdrop-blur-md border border-border/60 font-mono-ui text-xs text-muted-foreground hover:text-accent transition-colors"
            aria-label="Expand navigation"
        >
            <FiArrowRight className="w-3.5 h-3.5" />
        </motion.button>
    )
}

function ExpandedNav({ isPlaying }: { isPlaying: boolean }) {
    const { resolvedTheme: theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark')
    }

    return (
        <motion.header
            initial={isPlaying ? { opacity: 1 } : false}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
        >
            <nav className="flex items-center gap-0 px-1 py-1 rounded-sm border border-border/60 bg-background/90 backdrop-blur-md shadow-lg shadow-background/20">
                <Link
                    href="/"
                    className="px-3 py-1.5 text-xs font-mono-ui tracking-wide text-muted-foreground hover:text-foreground transition-colors duration-150"
                >
                    <span className="font-semibold">
                        <Persona alen="alen.is" ban="ban.is" />
                    </span>
                    <span className="text-accent font-bold mx-1.5">/</span>
                    <span className="text-foreground">lost</span>
                </Link>

                <div className="w-px h-3 bg-border mx-1" />

                {mounted ? (
                    <button
                        onClick={toggleTheme}
                        className="px-2 py-1.5 text-xs font-mono-ui text-muted-foreground hover:text-accent transition-colors duration-150 whitespace-nowrap"
                        aria-label="Toggle theme"
                    >
                        [{theme === 'dark' ? 'light' : 'dark'}]
                    </button>
                ) : (
                    <div className="px-2 py-1.5 text-xs opacity-0 select-none">[dark]</div>
                )}

                {/* The site nav is hidden on this page, so the way back from Ban is offered here too */}
                <OnlyBan>
                    <button
                        onClick={() => {
                            switchPersona('alen')
                            posthog.capture('persona_switch', { to: 'alen', from: 'lost' })
                        }}
                        className="px-2 py-1.5 text-xs font-mono-ui text-muted-foreground hover:text-accent transition-colors duration-150 whitespace-nowrap"
                        aria-label="Switch back to Alen"
                        title="let alen back in"
                    >
                        [alen]
                    </button>
                </OnlyBan>
            </nav>
        </motion.header>
    )
}

export default function Lost() {
    const [isPlaying, setIsPlaying] = useState(false)
    const [isNavCollapsed, setIsNavCollapsed] = useState(false)
    const [showQuote, setShowQuote] = useState(true)
    const [hasDrawn, setHasDrawn] = useState(false)
    const [stats, setStats] = useState({ gen: 0, pop: 0 })
    const gridRef = useRef<boolean[][] | null>(null)
    const gameRef = useRef<GameOfLifeRef>(null)
    const collapseTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined)

    useEffect(() => () => clearTimeout(collapseTimerRef.current), [])

    const handleStats = useCallback((gen: number, pop: number) => {
        setStats((prev) => (prev.gen === gen && prev.pop === pop ? prev : { gen, pop }))
    }, [])

    const handleCellToggle = (row: number, col: number) => {
        if (!gridRef.current) return
        if (row >= 0 && row < gridRef.current.length && col >= 0 && col < gridRef.current[0].length) {
            gridRef.current[row][col] = !gridRef.current[row][col]
            if (!hasDrawn) {
                setHasDrawn(true)
                setShowQuote(false)
            }
        }
    }

    const handlePlay = () => {
        setIsPlaying(true)
        setShowQuote(false)
        clearTimeout(collapseTimerRef.current)
        collapseTimerRef.current = setTimeout(() => setIsNavCollapsed(true), 300)
        posthog.capture('game_started', { game: 'game_of_life' })
    }

    const handlePause = () => {
        // A pause inside the 300ms window would otherwise still collapse the nav afterwards
        clearTimeout(collapseTimerRef.current)
        setIsPlaying(false)
        setIsNavCollapsed(false)
    }

    /** Spray a random soup across the whole grid — instant chaos, no drawing required */
    const handleSeed = () => {
        const grid = gridRef.current
        if (!grid) return
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[0].length; j++) {
                grid[i][j] = Math.random() < SEED_DENSITY
            }
        }
        setHasDrawn(true)
        setShowQuote(false)
        gameRef.current?.resetGeneration()
        gameRef.current?.redraw()
        posthog.capture('game_seeded', { game: 'game_of_life' })
    }

    const handleClear = () => {
        if (gridRef.current) {
            const rows = gridRef.current.length
            const cols = gridRef.current[0].length
            gridRef.current = createEmptyGrid(rows, cols)
            setIsPlaying(false)
            setIsNavCollapsed(false)
            setHasDrawn(false)
            setShowQuote(true)
            posthog.capture('game_cleared', { game: 'game_of_life' })
            gameRef.current?.resetGeneration()
            gameRef.current?.redraw()
        }
    }

    return (
        <div className="fixed inset-0 overflow-hidden">
            <GameOfLife
                ref={gameRef}
                isPlaying={isPlaying}
                gridRef={gridRef}
                onCellToggle={handleCellToggle}
                onStats={handleStats}
            />

            <AnimatePresence mode="wait">
                {isNavCollapsed ? (
                    <CollapsedNav key="collapsed" onExpand={() => setIsNavCollapsed(false)} />
                ) : (
                    <ExpandedNav key="expanded" isPlaying={isPlaying} />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showQuote && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="fixed inset-0 z-10 flex flex-col items-center justify-center pointer-events-none"
                    >
                        <div className="text-center px-4 max-w-lg">
                            <p className="mono-label text-muted-foreground/50 mb-6">
                                <Persona
                                    alen="// 404. there's nothing at that address"
                                    ban="No page at that address. I checked."
                                />
                            </p>
                            <p className="text-display text-2xl md:text-3xl mb-3">
                                <Persona
                                    alen={<>&ldquo;Not all those who wander are lost.&rdquo;</>}
                                    ban="He is lost. I know exactly where I am."
                                />
                            </p>
                            {/* Ban quotes nobody, so his line stands without a name under it */}
                            <p className="mono-label text-muted-foreground/50 mb-10">
                                <Persona alen="j.r.r. tolkien" ban={null} />
                            </p>
                            <p className="mono-label text-muted-foreground">
                                <Persona
                                    alen="this is conway's game of life. draw some cells, or press seed"
                                    ban="This is Conway's Game of Life. Draw cells or press seed. I am not cleaning up after them."
                                />
                                <span className="animate-blink text-accent ml-1">█</span>
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Telemetry HUD */}
            <div
                className="fixed bottom-4 left-4 z-50 hidden sm:flex items-center gap-2 mono-label text-muted-foreground/50 select-none"
                aria-live="off"
            >
                {/* A running simulation is live, so the readout takes the signal colour */}
                <span className={cn('tabular-nums', isPlaying && 'text-signal')}>
                    [{isPlaying ? <Persona alen="evolving" ban="at large" /> : <Persona alen="stasis" ban="detained" />}
                    ]
                </span>
                <span className="tabular-nums">gen {String(stats.gen).padStart(4, '0')}</span>
                <span className="text-accent/40">·</span>
                <span className="tabular-nums">pop {String(stats.pop).padStart(4, '0')}</span>
            </div>

            {/* Controls */}
            <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 px-1 py-1 rounded-sm border border-border/60 bg-background/90 backdrop-blur-md shadow-lg shadow-background/20">
                <button
                    onClick={isPlaying ? handlePause : handlePlay}
                    className="px-3 py-1.5 text-xs font-mono-ui whitespace-nowrap bg-accent/10 text-accent hover:bg-accent/20 rounded-sm transition-colors duration-150"
                >
                    {isPlaying ? (
                        <>
                            ⏸ <Persona alen="halt" ban="detain" />
                        </>
                    ) : (
                        <>
                            ▶ <Persona alen="run" ban="release" />
                        </>
                    )}
                </button>
                <button
                    onClick={handleSeed}
                    className="px-3 py-1.5 text-xs font-mono-ui whitespace-nowrap text-muted-foreground hover:text-accent rounded-sm transition-colors duration-150"
                >
                    ⚄ seed
                </button>
                <button
                    onClick={handleClear}
                    className="px-3 py-1.5 text-xs font-mono-ui whitespace-nowrap text-muted-foreground hover:text-destructive rounded-sm transition-colors duration-150"
                >
                    ✕ <Persona alen="clear" ban="evict" />
                </button>
            </div>
        </div>
    )
}
