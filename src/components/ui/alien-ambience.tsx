'use client'

import { useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'

/** One mote per this many square pixels of screen, within the limits below */
const AREA_PER_MOTE = 26000
const MIN_MOTES = 22
const MAX_MOTES = 64
/** How far from the pointer the water is disturbed, in px */
const REACH = 150
/** How long a lit mote takes to go dark again, in ms (its light falls to about a third in this time) */
const GLOW_FADE_MS = 900
/** Speeds are tuned in px per 60Hz frame; scaled by elapsed time so 120Hz screens don't run double speed */
const FRAME_MS = 1000 / 60
/** Without a pointer, scroll or key for this long the water goes still; the next move wakes it */
const IDLE_MS = 30000
const FADE_MS = 1500
const SPRITE = 48

type Mote = {
    x: number
    y: number
    /** Depth, 0.25 (far) to 1 (near). Near motes are bigger, brighter and drift faster. */
    z: number
    vx: number
    vy: number
    /** Where it is in its slow side-to-side sway */
    phase: number
    /** How lit up it is right now, 0 to 1 */
    glow: number
}

/**
 * The water Alen's pages sit in. A few dozen motes of plankton drift slowly
 * upward, nearly invisible. Disturb the water (move the pointer near them,
 * scroll, touch) and the ones nearby light up and fade, the way the sea does
 * at night when you put a hand in it.
 *
 * Nothing follows the pointer and nothing is drawn at it: the water answers,
 * that is all. One canvas, one pre-drawn sprite, a few dozen drawImage calls a
 * frame. The loop parks after 30 idle seconds and on a hidden tab, and under
 * reduced motion there is one still frame.
 */
export function Plankton() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const { resolvedTheme } = useTheme()
    // Read by the draw loop, so a theme toggle recolours the motes instead of re-seeding them
    const themeRef = useRef(resolvedTheme)
    themeRef.current = resolvedTheme
    // Redraws the sprite in the new accent, and the still frame when the loop isn't running
    const recolourRef = useRef<() => void>(() => {})

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
        const sprite = document.createElement('canvas')
        sprite.width = sprite.height = SPRITE

        let motes: Mote[] = []
        let width = 0
        let height = 0
        let raf: number | null = null
        let last = 0
        let fade = 1
        let lastActivity = 0
        // Where the water was last disturbed, and how hard. Spent by the next frame.
        let stirX = 0
        let stirY = 0
        let stir = 0
        let pointerX = -1
        let pointerY = -1
        let scrollY = window.scrollY

        /** A soft dot in the accent: bright core, wide faint halo */
        const drawSprite = () => {
            const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()
            const s = sprite.getContext('2d')
            if (!s) return
            const c = SPRITE / 2
            s.clearRect(0, 0, SPRITE, SPRITE)
            const gradient = s.createRadialGradient(c, c, 0, c, c, c)
            gradient.addColorStop(0, `hsl(${accent} / 1)`)
            gradient.addColorStop(0.14, `hsl(${accent} / 0.85)`)
            gradient.addColorStop(0.4, `hsl(${accent} / 0.16)`)
            gradient.addColorStop(1, `hsl(${accent} / 0)`)
            s.fillStyle = gradient
            s.fillRect(0, 0, SPRITE, SPRITE)
        }

        const seed = () => {
            const count = Math.max(MIN_MOTES, Math.min(MAX_MOTES, Math.round((width * height) / AREA_PER_MOTE)))
            motes = Array.from({ length: count }, () => {
                const z = 0.25 + Math.random() * 0.75
                return {
                    x: Math.random() * width,
                    y: Math.random() * height,
                    z,
                    vx: (Math.random() - 0.5) * 0.08,
                    vy: -(0.03 + Math.random() * 0.09) * z,
                    phase: Math.random() * Math.PI * 2,
                    glow: 0
                }
            })
        }

        const size = () => {
            const widthChanged = window.innerWidth !== width
            width = window.innerWidth
            height = window.innerHeight
            const dpr = Math.min(window.devicePixelRatio || 1, 2)
            canvas.width = Math.round(width * dpr)
            canvas.height = Math.round(height * dpr)
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
            // Height-only changes (the mobile URL bar showing/hiding on scroll) keep the
            // motes where they are instead of reseeding the whole water
            if (widthChanged) seed()
        }

        const paint = () => {
            const dark = themeRef.current !== 'light'
            // In daylight the motes are specks, not lights: fainter at rest, and they darken instead of flaring
            const rest = dark ? 0.22 : 0.14
            const lit = dark ? 0.9 : 0.5
            ctx.clearRect(0, 0, width, height)
            for (const mote of motes) {
                const alpha = (rest * mote.z + mote.glow * lit) * fade
                if (alpha < 0.01) continue
                const d = (5 + mote.z * 9) * (1 + mote.glow * 1.5)
                ctx.globalAlpha = Math.min(alpha, 1)
                ctx.drawImage(sprite, mote.x - d / 2, mote.y - d / 2, d, d)
            }
            ctx.globalAlpha = 1
        }

        const step = (dt: number) => {
            const frames = dt / FRAME_MS
            const decay = Math.exp(-dt / GLOW_FADE_MS)
            for (const mote of motes) {
                mote.phase += 0.008 * frames
                mote.x += (mote.vx + Math.sin(mote.phase) * 0.05 * mote.z) * frames
                mote.y += mote.vy * frames
                // Off one edge, back in at the other
                if (mote.y < -12) mote.y = height + 12
                else if (mote.y > height + 12) mote.y = -12
                if (mote.x < -12) mote.x = width + 12
                else if (mote.x > width + 12) mote.x = -12

                if (stir > 0) {
                    const dx = mote.x - stirX
                    const dy = mote.y - stirY
                    const distance = Math.hypot(dx, dy)
                    if (distance < REACH) {
                        const near = 1 - distance / REACH
                        mote.glow = Math.min(1, mote.glow + near * near * stir)
                        // A little push away from the disturbance, more for the near ones
                        const push = (near * stir * 1.4 * mote.z) / (distance || 1)
                        mote.x += dx * push
                        mote.y += dy * push
                    }
                }
                mote.glow *= decay
            }
            stir = 0
        }

        const loop = (now: number) => {
            // Clamp so returning to a backgrounded tab doesn't jump every mote at once
            const dt = last ? Math.min(now - last, 100) : FRAME_MS
            last = now
            const idle = now - lastActivity > IDLE_MS
            fade = Math.max(0, Math.min(1, fade + (idle ? -dt : dt) / FADE_MS))
            step(dt)
            paint()
            if (fade === 0) {
                // Parked: nothing drawn and no frames scheduled until the next activity
                ctx.clearRect(0, 0, width, height)
                raf = null
                last = 0
                return
            }
            raf = requestAnimationFrame(loop)
        }

        const wake = () => {
            lastActivity = performance.now()
            if (raf === null && !reducedMotion.matches && !document.hidden) raf = requestAnimationFrame(loop)
        }

        const disturb = (x: number, y: number, strength: number) => {
            stirX = x
            stirY = y
            stir = Math.min(1, stir + strength)
            wake()
        }

        const onPointerMove = (event: PointerEvent) => {
            // The first move has nothing to measure against
            const moved = pointerX < 0 ? 0 : Math.hypot(event.clientX - pointerX, event.clientY - pointerY)
            pointerX = event.clientX
            pointerY = event.clientY
            // A slow drift barely wakes them; a quick pass lights them up
            disturb(pointerX, pointerY, Math.min(0.5, moved / 90))
        }
        const onPointerDown = (event: PointerEvent) => disturb(event.clientX, event.clientY, 1)
        const onScroll = () => {
            const delta = window.scrollY - scrollY
            scrollY = window.scrollY
            // The page moves through the water: near motes slide past faster than far ones
            for (const mote of motes) mote.y -= delta * 0.12 * mote.z
            wake()
        }

        const onVisibility = () => {
            if (document.hidden) {
                if (raf !== null) cancelAnimationFrame(raf)
                raf = null
                last = 0
            } else {
                wake()
            }
        }

        // Reduced motion gets a single still frame rather than none at all
        const start = () => {
            if (raf !== null) cancelAnimationFrame(raf)
            raf = null
            last = 0
            fade = 1
            if (reducedMotion.matches) {
                paint()
            } else {
                lastActivity = performance.now()
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

        recolourRef.current = () => {
            drawSprite()
            if (reducedMotion.matches) paint()
        }
        drawSprite()
        size()
        start()
        window.addEventListener('resize', onResize)
        reducedMotion.addEventListener('change', start)
        window.addEventListener('pointermove', onPointerMove, { passive: true })
        window.addEventListener('pointerdown', onPointerDown, { passive: true })
        window.addEventListener('scroll', onScroll, { passive: true })
        window.addEventListener('keydown', wake)
        document.addEventListener('visibilitychange', onVisibility)

        return () => {
            window.removeEventListener('resize', onResize)
            reducedMotion.removeEventListener('change', start)
            window.removeEventListener('pointermove', onPointerMove)
            window.removeEventListener('pointerdown', onPointerDown)
            window.removeEventListener('scroll', onScroll)
            window.removeEventListener('keydown', wake)
            document.removeEventListener('visibilitychange', onVisibility)
            clearTimeout(resizeTimer)
            if (raf !== null) cancelAnimationFrame(raf)
            recolourRef.current = () => {}
        }
    }, [])

    useEffect(() => {
        // The class lands on <html> in the same commit; read the token a frame later to be safe
        const id = requestAnimationFrame(() => recolourRef.current())
        return () => cancelAnimationFrame(id)
    }, [resolvedTheme])

    return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-0" aria-hidden="true" />
}
