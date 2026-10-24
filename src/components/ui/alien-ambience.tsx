'use client'

import { useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'
import { randomGlyph } from '@/lib/glyphs'

const COLS = 28
const SPEED_MIN = 0.3
const SPEED_MAX = 1.2
const FONT_SIZE = 11
const LINE_HEIGHT = FONT_SIZE + 4
/** Speeds are tuned in px per 60Hz frame; scaled by elapsed time so 120Hz screens don't run double speed */
const FRAME_MS = 1000 / 60

type Column = {
    x: number
    y: number
    speed: number
    opacity: number
    glyphs: string[]
    length: number
}

export function AlienDataStream() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const { resolvedTheme } = useTheme()
    // Read by the draw loop, so a theme toggle recolours the rain instead of re-seeding it
    const themeRef = useRef(resolvedTheme)
    themeRef.current = resolvedTheme
    // Repaints the still frame when the loop isn't running (reduced motion)
    const repaintStillRef = useRef<() => void>(() => {})

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
        // next/font's generated family name, not the literal 'JetBrains Mono' (which doesn't exist)
        const fontFamily = getComputedStyle(document.body).getPropertyValue('--font-jetbrains-mono').trim()
        const font = `${FONT_SIZE}px ${fontFamily || 'monospace'}`

        let cols: Column[] = []
        let width = 0
        let height = 0
        let raf: number | null = null
        let last = 0

        const seed = () => {
            const colWidth = width / COLS
            cols = Array.from({ length: COLS }, (_, i) => ({
                x: i * colWidth + colWidth / 2,
                y: Math.random() * -height,
                speed: SPEED_MIN + Math.random() * (SPEED_MAX - SPEED_MIN),
                opacity: 0.04 + Math.random() * 0.08,
                glyphs: Array.from({ length: 20 }, () => randomGlyph()),
                length: 8 + Math.floor(Math.random() * 14)
            }))
        }

        const size = () => {
            const widthChanged = window.innerWidth !== width
            width = window.innerWidth
            height = window.innerHeight
            const dpr = window.devicePixelRatio || 1
            canvas.width = Math.round(width * dpr)
            canvas.height = Math.round(height * dpr)
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
            // Height-only changes (the mobile URL bar showing/hiding on scroll) keep the
            // columns where they are instead of restarting the whole rain
            if (widthChanged) seed()
        }

        const paint = () => {
            const accentColor = themeRef.current === 'dark' ? '80, 255, 160' : '20, 140, 70'
            ctx.clearRect(0, 0, width, height)
            ctx.font = font
            ctx.textAlign = 'center'

            for (const col of cols) {
                for (let j = 0; j < col.length; j++) {
                    const gy = col.y - j * LINE_HEIGHT
                    if (gy < -20 || gy > height + 20) continue
                    // Fade: head is brightest, tail fades out
                    const progress = j / col.length
                    const alpha = col.opacity * (1 - progress) * (j === 0 ? 2 : 1)
                    ctx.fillStyle = `rgba(${accentColor}, ${Math.min(alpha, 0.18)})`
                    ctx.fillText(col.glyphs[j % col.glyphs.length], col.x, gy)
                }
            }
        }

        const step = (dt: number) => {
            const frames = dt / FRAME_MS
            for (const col of cols) {
                // Randomly mutate one glyph
                if (Math.random() < 0.08) {
                    col.glyphs[Math.floor(Math.random() * col.glyphs.length)] = randomGlyph()
                }
                col.y += col.speed * frames
                if (col.y > height + col.length * LINE_HEIGHT) {
                    col.y = -col.length * LINE_HEIGHT
                    col.speed = SPEED_MIN + Math.random() * (SPEED_MAX - SPEED_MIN)
                    col.opacity = 0.04 + Math.random() * 0.08
                    col.length = 8 + Math.floor(Math.random() * 14)
                }
            }
        }

        const loop = (now: number) => {
            // Clamp so returning to a backgrounded tab doesn't jump every column at once
            const dt = last ? Math.min(now - last, 100) : FRAME_MS
            last = now
            step(dt)
            paint()
            raf = requestAnimationFrame(loop)
        }

        // Reduced motion gets a single still frame of the rain rather than none at all
        const start = () => {
            if (raf !== null) cancelAnimationFrame(raf)
            raf = null
            last = 0
            if (reducedMotion.matches) {
                // Spread the columns across the screen so the still frame isn't empty
                for (const col of cols) col.y = Math.random() * (height + col.length * LINE_HEIGHT)
                paint()
            } else {
                raf = requestAnimationFrame(loop)
            }
        }

        let resizeTimer: ReturnType<typeof setTimeout> | undefined
        const onResize = () => {
            clearTimeout(resizeTimer)
            resizeTimer = setTimeout(() => {
                size()
                if (reducedMotion.matches) paint()
            }, 150)
        }

        repaintStillRef.current = () => {
            if (reducedMotion.matches) paint()
        }
        size()
        start()
        window.addEventListener('resize', onResize)
        reducedMotion.addEventListener('change', start)

        return () => {
            window.removeEventListener('resize', onResize)
            reducedMotion.removeEventListener('change', start)
            clearTimeout(resizeTimer)
            if (raf !== null) cancelAnimationFrame(raf)
            repaintStillRef.current = () => {}
        }
    }, [])

    useEffect(() => {
        repaintStillRef.current()
    }, [resolvedTheme])

    return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-0" aria-hidden="true" />
}
