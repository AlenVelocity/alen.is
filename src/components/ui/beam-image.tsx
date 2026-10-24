'use client'

import Image, { type ImageProps } from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { isMinimalMotion } from '@/lib/motion-pref'
import { randomGlyph } from '@/lib/glyphs'

const DURATION_MS = 450
const FONT_PX = 10
const CELL_W = 6
const CELL_H = 11

type BeamImageProps = Omit<ImageProps, 'fill' | 'onLoad'>

/**
 * A `fill` image that beams in: the first time it is on screen and loaded,
 * the picture resolves top to bottom out of alien glyphs, the way headings
 * decode. Must sit in a positioned container, like any `fill` image.
 *
 * Server HTML ships the image hidden and a <noscript> rule in the root layout
 * shows it again, so the effect never costs a visitor without JavaScript the
 * picture. Reduced motion and the site's minimal-motion setting skip it.
 */
export function BeamImage({ className, onError, ...props }: BeamImageProps) {
    const boxRef = useRef<HTMLDivElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const imgRef = useRef<HTMLImageElement>(null)
    const [phase, setPhase] = useState<'hidden' | 'beaming' | 'done'>('hidden')
    const loadedRef = useRef(false)
    const visibleRef = useRef(false)
    const startedRef = useRef(false)

    const maybeStart = useCallback(() => {
        if (startedRef.current || !loadedRef.current || !visibleRef.current) return
        startedRef.current = true
        setPhase('beaming')
    }, [])

    useEffect(() => {
        if (isMinimalMotion() || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setPhase('done')
            return
        }
        const box = boxRef.current
        if (!box) return
        const io = new IntersectionObserver(
            (entries) => {
                if (!entries.some((e) => e.isIntersecting)) return
                visibleRef.current = true
                maybeStart()
                io.disconnect()
            },
            { rootMargin: '48px' }
        )
        io.observe(box)
        // A cached image can be complete before React attaches onLoad
        const img = imgRef.current
        if (img && img.complete && img.naturalWidth > 0) {
            loadedRef.current = true
            maybeStart()
        }
        return () => io.disconnect()
    }, [maybeStart])

    useEffect(() => {
        if (phase !== 'beaming') return
        const box = boxRef.current
        const canvas = canvasRef.current
        const img = imgRef.current
        const ctx = canvas?.getContext('2d')
        if (!box || !canvas || !img || !ctx) {
            setPhase('done')
            return
        }
        const rect = box.getBoundingClientRect()
        const dpr = window.devicePixelRatio || 1
        canvas.width = Math.round(rect.width * dpr)
        canvas.height = Math.round(rect.height * dpr)
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        const fontFamily = getComputedStyle(document.body).getPropertyValue('--font-jetbrains-mono').trim()
        ctx.font = `${FONT_PX}px ${fontFamily || 'monospace'}`
        ctx.textBaseline = 'top'
        const rgb = document.documentElement.classList.contains('dark') ? '80, 255, 160' : '20, 140, 70'
        const cols = Math.ceil(rect.width / CELL_W)
        const rows = Math.ceil(rect.height / CELL_H)
        const grid = Array.from({ length: rows }, () => Array.from({ length: cols }, randomGlyph))

        let raf = 0
        const t0 = performance.now()
        const frame = (now: number) => {
            const t = Math.min(1, (now - t0) / DURATION_MS)
            const eased = 1 - Math.pow(1 - t, 3)
            const edge = eased * rect.height
            img.style.clipPath = `inset(0 0 ${Math.max(0, 100 - eased * 100)}% 0)`
            ctx.clearRect(0, 0, rect.width, rect.height)
            for (let y = 0; y < rows; y++) {
                const py = y * CELL_H
                // Rows well above the edge are already the picture
                if (py + CELL_H < edge - CELL_H * 2) continue
                const below = py >= edge
                const alpha = below ? Math.max(0, 0.55 - ((py - edge) / rect.height) * 1.6) : 0.9
                if (alpha <= 0.02) continue
                for (let x = 0; x < cols; x++) {
                    if (Math.random() < 0.12) grid[y][x] = randomGlyph()
                    if (below && Math.random() < 0.6) continue
                    ctx.fillStyle = `rgba(${rgb}, ${alpha})`
                    ctx.fillText(grid[y][x], x * CELL_W, py)
                }
            }
            if (t < 1) {
                raf = requestAnimationFrame(frame)
            } else {
                img.style.clipPath = ''
                setPhase('done')
            }
        }
        raf = requestAnimationFrame(frame)
        return () => cancelAnimationFrame(raf)
    }, [phase])

    return (
        <div ref={boxRef} className="beam-image absolute inset-0">
            <Image
                ref={imgRef}
                {...props}
                fill
                className={cn(className, phase === 'hidden' && 'opacity-0')}
                onLoad={() => {
                    loadedRef.current = true
                    maybeStart()
                }}
                onError={(event) => {
                    setPhase('done')
                    onError?.(event)
                }}
            />
            {phase === 'beaming' && (
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    aria-hidden="true"
                />
            )}
        </div>
    )
}
