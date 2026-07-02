'use client'

import { useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'

const ALIEN_GLYPHS = '▓░▒█▄▀■□▪▫◆◇○●◉⌖⌗⊗⊕⊞⊟⊠⊡⋯⋮∞∅∆∇⌀⌁⌂⌃⌄⌅⌆⌇⌈⌉⌊⌋⌌⌍⌎⌏⌐⌑⌒⌓⌔⌕⌖⌗⌘⌙⌚⌛⌜⌝⌞⌟01'

const COLS = 28
const SPEED_MIN = 0.3
const SPEED_MAX = 1.2
const FONT_SIZE = 11

type Column = {
    x: number
    y: number
    speed: number
    opacity: number
    glyphs: string[]
    length: number
}

function randomGlyph() {
    return ALIEN_GLYPHS[Math.floor(Math.random() * ALIEN_GLYPHS.length)]
}

export function AlienDataStream() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const { resolvedTheme } = useTheme()
    const colsRef = useRef<Column[]>([])
    const animRef = useRef<number | null>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const init = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight

            const numCols = Math.floor(canvas.width / (canvas.width / COLS))
            const colWidth = canvas.width / COLS

            colsRef.current = Array.from({ length: COLS }, (_, i) => ({
                x: i * colWidth + colWidth / 2,
                y: Math.random() * -canvas.height,
                speed: SPEED_MIN + Math.random() * (SPEED_MAX - SPEED_MIN),
                opacity: 0.04 + Math.random() * 0.08,
                glyphs: Array.from({ length: 20 }, () => randomGlyph()),
                length: 8 + Math.floor(Math.random() * 14)
            }))
        }

        const draw = () => {
            const isDark = resolvedTheme === 'dark'
            const accentColor = isDark ? '80, 255, 160' : '20, 140, 70'

            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.font = `${FONT_SIZE}px 'JetBrains Mono', monospace`
            ctx.textAlign = 'center'

            for (const col of colsRef.current) {
                // Randomly mutate one glyph
                if (Math.random() < 0.08) {
                    const idx = Math.floor(Math.random() * col.glyphs.length)
                    col.glyphs[idx] = randomGlyph()
                }

                for (let j = 0; j < col.length; j++) {
                    const glyph = col.glyphs[j % col.glyphs.length]
                    const gy = col.y - j * (FONT_SIZE + 4)
                    if (gy < -20 || gy > canvas.height + 20) continue

                    // Fade: head is brightest, tail fades out
                    const progress = j / col.length
                    const alpha = col.opacity * (1 - progress) * (j === 0 ? 2 : 1)

                    ctx.fillStyle = `rgba(${accentColor}, ${Math.min(alpha, 0.18)})`
                    ctx.fillText(glyph, col.x, gy)
                }

                col.y += col.speed
                if (col.y > canvas.height + col.length * (FONT_SIZE + 4)) {
                    col.y = -col.length * (FONT_SIZE + 4)
                    col.speed = SPEED_MIN + Math.random() * (SPEED_MAX - SPEED_MIN)
                    col.opacity = 0.04 + Math.random() * 0.08
                    col.length = 8 + Math.floor(Math.random() * 14)
                }
            }

            animRef.current = requestAnimationFrame(draw)
        }

        init()
        animRef.current = requestAnimationFrame(draw)

        const onResize = () => init()
        window.addEventListener('resize', onResize)

        return () => {
            window.removeEventListener('resize', onResize)
            if (animRef.current) cancelAnimationFrame(animRef.current)
        }
    }, [resolvedTheme])

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0"
            aria-hidden="true"
            style={{ opacity: 1 }}
        />
    )
}

export function ScanLine() {
    return <div className="scan-line-el" aria-hidden="true" style={{ top: 0 }} />
}
