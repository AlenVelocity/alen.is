'use client'

import { useEffect, useRef, useState, useCallback, useImperativeHandle, forwardRef } from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { FiSun, FiMoon, FiArrowRight, FiPlay, FiPause, FiTrash2 } from 'react-icons/fi'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

const CELL_SIZE = 16
const SPEED = 120 // ms between generations

// Create empty grid
function createEmptyGrid(rows: number, cols: number): boolean[][] {
    return Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => false)
    )
}

// Count live neighbors
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
    const rows = grid.length
    const cols = grid[0].length
    
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
}

const GameOfLife = forwardRef<GameOfLifeRef, { 
    isPlaying: boolean
    gridRef: React.MutableRefObject<boolean[][] | null>
    onCellToggle: (row: number, col: number) => void
}>(function GameOfLife({ 
    isPlaying, 
    gridRef,
    onCellToggle 
}, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const animationRef = useRef<number | null>(null)
    const lastUpdateRef = useRef<number>(0)
    const { theme } = useTheme()
    const isDrawingRef = useRef(false)
    const isPanningRef = useRef(false)
    const panStartRef = useRef({ x: 0, y: 0 })
    const [offset, setOffset] = useState({ x: 0, y: 0 })
    const offsetRef = useRef({ x: 0, y: 0 })
    
    // Keep offsetRef in sync with offset state
    useEffect(() => {
        offsetRef.current = offset
    }, [offset])
    
    const draw = useCallback(() => {
        const canvas = canvasRef.current
        const ctx = canvas?.getContext('2d')
        const grid = gridRef.current
        
        if (!canvas || !ctx || !grid) return
        
        const isDark = theme === 'dark'
        ctx.fillStyle = isDark ? '#0a0a0a' : '#fafafa'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        
        const cellColor = isDark ? 'rgba(34, 197, 94, 0.8)' : 'rgba(34, 197, 94, 0.9)'
        const gridColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
        
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
        grid.forEach((row, i) => {
            row.forEach((cell, j) => {
                if (cell) {
                    const x = j * CELL_SIZE + currentOffset.x
                    const y = i * CELL_SIZE + currentOffset.y
                    // Only draw if visible
                    if (x + CELL_SIZE > 0 && x < canvas.width && y + CELL_SIZE > 0 && y < canvas.height) {
                        ctx.fillStyle = cellColor
                        ctx.fillRect(x + 1, y + 1, CELL_SIZE - 2, CELL_SIZE - 2)
                    }
                }
            })
        })
    }, [theme, gridRef])
    
    // Expose redraw method via ref
    useImperativeHandle(ref, () => ({
        redraw: () => draw()
    }), [draw])
    
    const animate = useCallback((timestamp: number) => {
        if (!isPlaying) return
        
        if (timestamp - lastUpdateRef.current >= SPEED) {
            if (gridRef.current) {
                gridRef.current = nextGeneration(gridRef.current)
                draw()
            }
            lastUpdateRef.current = timestamp
        }
        
        animationRef.current = requestAnimationFrame(animate)
    }, [isPlaying, draw, gridRef])
    
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        
        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
            
            const cols = Math.ceil(canvas.width / CELL_SIZE) + 20
            const rows = Math.ceil(canvas.height / CELL_SIZE) + 20
            
            if (!gridRef.current || gridRef.current.length !== rows || gridRef.current[0]?.length !== cols) {
                gridRef.current = createEmptyGrid(rows, cols)
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
    }, [theme, draw, offset])
    
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
            className={cn(
                "fixed inset-0 z-0",
                !isPlaying && "cursor-crosshair"
            )}
        />
    )
})

function CollapsedNav({ onExpand }: { onExpand: () => void }) {
    return (
        <motion.button
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            onClick={onExpand}
            className="fixed left-4 top-4 z-50 w-10 h-10 rounded-full bg-background/80 backdrop-blur-xl border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Expand navigation"
        >
            <FiArrowRight className="w-4 h-4" />
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
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
        >
            <nav className="flex items-center gap-1 px-2 py-1.5 rounded-full border bg-background/80 backdrop-blur-xl border-border/50">
                <Link
                    href="/"
                    className="px-3 py-1.5 text-sm font-medium hover:text-foreground transition-colors flex items-center gap-2"
                >
                    <span className="text-muted-foreground font-bold">Alen.is</span>
                    <span className="text-muted-foreground/50">/</span>
                    <span className="text-foreground">Lost</span>
                </Link>
                
                <div className="w-px h-4 bg-border mx-1" />
                
                {mounted && (
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200"
                        aria-label="Toggle theme"
                    >
                        {theme === 'dark' ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
                    </button>
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
    const gridRef = useRef<boolean[][] | null>(null)
    const gameRef = useRef<GameOfLifeRef>(null)
    
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
    }
    
    const handlePause = () => {
        setIsPlaying(false)
        setIsNavCollapsed(false)
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
            // Trigger immediate redraw
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
                            <p className="text-xl md:text-2xl text-muted-foreground mb-4 italic">
                                "Not all those who wander are lost."
                            </p>
                            <p className="text-sm text-muted-foreground/70 mb-8">— J.R.R. Tolkien</p>
                            <p className="text-sm text-muted-foreground">
                                Draw some cells to begin
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            {/* Controls */}
            {hasDrawn && (
                <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2">
                    <button
                        onClick={isPlaying ? handlePause : handlePlay}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent/90 hover:bg-accent text-background text-sm font-medium transition-colors"
                    >
                        {isPlaying ? (
                            <>
                                <FiPause className="w-4 h-4" />
                                <span className="hidden sm:inline">Pause</span>
                            </>
                        ) : (
                            <>
                                <FiPlay className="w-4 h-4" />
                                <span className="hidden sm:inline">Play</span>
                            </>
                        )}
                    </button>
                    
                    <button
                        onClick={handleClear}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-background/80 backdrop-blur-xl border border-border/50 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <FiTrash2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Clear</span>
                    </button>
                </div>
            )}
        </div>
    )
}

