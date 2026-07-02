'use client'

import { useEffect, useRef, useState, useCallback, useImperativeHandle, forwardRef } from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { FiArrowRight } from 'react-icons/fi'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { posthog } from '@/components/posthog-provider'

/**
 * /lost — an interactive Conway's Game of Life rendered in the site's alien
 * palette. Draw cells (or seed a random soup), hit run, and watch the colony
 * evolve. The HUD tracks generation and population like a probe telemetry
 * readout.
 */

const CELL_SIZE = 16
const SPEED = 120 // ms between generations
const SEED_DENSITY = 0.12 // fraction of cells alive after pressing seed

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
    const { resolvedTheme } = useTheme()
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

        // Site palette: deep cosmic background, emerald colony, faint accent grid
        const isDark = resolvedTheme === 'dark'
        ctx.fillStyle = isDark ? 'hsl(200, 35%, 3%)' : 'hsl(210, 20%, 97%)'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        const cellColor = isDark ? 'rgba(80, 255, 160, 0.85)' : 'rgba(20, 140, 70, 0.9)'
        const gridColor = isDark ? 'rgba(80, 255, 160, 0.05)' : 'rgba(20, 140, 70, 0.07)'

        const currentOffset = offsetRef.current

        // Draw grid lines with offset
        ctx.strokeStyle = gridColor
        ctx.lineWidth = 1

        const startRow = Math.floor(-currentOffset.y / CELL_SIZE)
        const endRow = Math.ceil((canvas.height - currentOffset.y) / CELL_SIZE)
        const startCol = Math.floor(-currentOffset.x / CELL_SIZE)
        const endCol = Math.ceil((canvas.width - currentOffset.x) / CELL_SIZE)

        for (let i = startRow; i <= endRow; i++) {
            const y = i * CELL_SIZE + currentOffset.y
            ctx.beginPath()
            ctx.moveTo(0, y)
            ctx.lineTo(canvas.width, y)
            ctx.stroke()
        }
        for (let j = startCol; j <= endCol; j++) {
            const x = j * CELL_SIZE + currentOffset.x
            ctx.beginPath()
            ctx.moveTo(x, 0)
            ctx.lineTo(x, canvas.height)
            ctx.stroke()
        }

        // Draw cells with offset
        ctx.fillStyle = cellColor
        grid.forEach((row, i) => {
            row.forEach((cell, j) => {
                if (cell) {
                    const x = j * CELL_SIZE + currentOffset.x
                    const y = i * CELL_SIZE + currentOffset.y
                    // Only draw if visible
                    if (x + CELL_SIZE > 0 && x < canvas.width && y + CELL_SIZE > 0 && y < canvas.height) {
                        ctx.fillRect(x + 1, y + 1, CELL_SIZE - 2, CELL_SIZE - 2)
                    }
                }
            })
        })

        // Telemetry readout for the HUD
        onStatsRef.current(generationRef.current, countPopulation(grid))
    }, [resolvedTheme, gridRef])

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
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight

            const cols = Math.ceil(canvas.width / CELL_SIZE) + 20
            const rows = Math.ceil(canvas.height / CELL_SIZE) + 20

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
    }, [resolvedTheme, draw, offset])

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
    const { theme, setTheme } = useTheme()
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
                    <span className="font-semibold">alen.is</span>
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
        setTimeout(() => setIsNavCollapsed(true), 300)
        posthog.capture('game_started', { game: 'game_of_life' })
    }

    const handlePause = () => {
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
                            <p className="mono-label text-muted-foreground/40 mb-6 tracking-[0.25em] justify-center">
                                // coordinates unknown
                            </p>
                            <p className="text-display text-2xl md:text-3xl mb-3">
                                &ldquo;Not all those who wander are lost.&rdquo;
                            </p>
                            <p className="mono-label text-muted-foreground/50 mb-10">— j.r.r. tolkien</p>
                            <p className="mono-label text-muted-foreground justify-center">
                                draw some cells, or press seed
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
                <span className={cn(isPlaying && 'text-accent [text-shadow:var(--glow-accent)]')}>
                    [{isPlaying ? 'evolving' : 'stasis'}]
                </span>
                <span>gen {String(stats.gen).padStart(4, '0')}</span>
                <span className="text-accent/40">·</span>
                <span>pop {String(stats.pop).padStart(4, '0')}</span>
            </div>

            {/* Controls */}
            <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 px-1 py-1 rounded-sm border border-border/60 bg-background/90 backdrop-blur-md shadow-lg shadow-background/20">
                <button
                    onClick={isPlaying ? handlePause : handlePlay}
                    className="px-3 py-1.5 text-xs font-mono-ui bg-accent/10 text-accent hover:bg-accent/20 hover:shadow-[0_0_12px_hsl(var(--accent)/0.2)] rounded-sm transition-all duration-150"
                >
                    {isPlaying ? '⏸ halt' : '▶ run'}
                </button>
                <button
                    onClick={handleSeed}
                    className="px-3 py-1.5 text-xs font-mono-ui text-muted-foreground hover:text-accent rounded-sm transition-colors duration-150"
                >
                    ⚄ seed
                </button>
                <button
                    onClick={handleClear}
                    className="px-3 py-1.5 text-xs font-mono-ui text-muted-foreground hover:text-destructive rounded-sm transition-colors duration-150"
                >
                    ✕ clear
                </button>
            </div>
        </div>
    )
}
