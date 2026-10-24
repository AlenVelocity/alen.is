'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

// Bisexual flag colors
const BI_COLORS = {
    pink: '#D60270',
    purple: '#9B4F96',
    blue: '#0038A8'
}

type StripeKey = keyof typeof BI_COLORS

/**
 * Floating flag-colored particles that react to the visitor: the pointer
 * gently pushes them aside, and every click bursts a handful outward from
 * the click point.
 */
function BiParticles() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const resize = () => {
            canvas.width = canvas.offsetWidth
            canvas.height = canvas.offsetHeight
        }
        resize()

        type Particle = {
            x: number
            y: number
            size: number
            color: string
            speed: number
            opacity: number
            drift: number
            /** Burst particles fly outward and fade out instead of drifting up */
            vx?: number
            vy?: number
            life?: number
        }

        const colors = [BI_COLORS.pink, BI_COLORS.purple, BI_COLORS.blue]
        const particles: Particle[] = Array.from({ length: 40 }, () => ({
            x: Math.random() * canvas.width,
            y: canvas.height + Math.random() * canvas.height,
            size: 1 + Math.random() * 2.5,
            color: colors[Math.floor(Math.random() * 3)],
            speed: 0.3 + Math.random() * 0.7,
            opacity: 0.15 + Math.random() * 0.35,
            drift: (Math.random() - 0.5) * 0.4
        }))

        const pointer = { x: -1000, y: -1000 }

        const onMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect()
            pointer.x = e.clientX - rect.left
            pointer.y = e.clientY - rect.top
        }

        const onClick = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect()
            const cx = e.clientX - rect.left
            const cy = e.clientY - rect.top
            for (let i = 0; i < 14; i++) {
                const angle = (Math.PI * 2 * i) / 14 + Math.random() * 0.4
                const force = 1.2 + Math.random() * 2
                particles.push({
                    x: cx,
                    y: cy,
                    size: 1 + Math.random() * 2,
                    color: colors[i % 3],
                    speed: 0,
                    opacity: 0.7,
                    drift: 0,
                    vx: Math.cos(angle) * force,
                    vy: Math.sin(angle) * force,
                    life: 1
                })
            }
        }

        window.addEventListener('resize', resize)
        window.addEventListener('mousemove', onMove, { passive: true })
        window.addEventListener('click', onClick)

        let raf: number
        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i]

                if (p.life !== undefined) {
                    // Burst particle: fly outward, decelerate, fade, then despawn
                    p.x += p.vx!
                    p.y += p.vy!
                    p.vx! *= 0.96
                    p.vy! *= 0.96
                    p.life -= 0.02
                    if (p.life <= 0) {
                        particles.splice(i, 1)
                        continue
                    }
                    ctx.globalAlpha = p.opacity * p.life
                } else {
                    // Ambient particle: drift upward, nudged away from the pointer
                    const dx = p.x - pointer.x
                    const dy = p.y - pointer.y
                    const dist = Math.hypot(dx, dy)
                    if (dist < 80 && dist > 0) {
                        const push = ((80 - dist) / 80) * 1.2
                        p.x += (dx / dist) * push
                        p.y += (dy / dist) * push
                    }
                    p.y -= p.speed
                    p.x += p.drift
                    if (p.y < -10) {
                        p.y = canvas.height + 10
                        p.x = Math.random() * canvas.width
                    }
                    ctx.globalAlpha = p.opacity
                }

                ctx.fillStyle = p.color
                ctx.beginPath()
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
                ctx.fill()
            }
            ctx.globalAlpha = 1
            raf = requestAnimationFrame(draw)
        }
        draw()

        return () => {
            cancelAnimationFrame(raf)
            window.removeEventListener('resize', resize)
            window.removeEventListener('mousemove', onMove)
            window.removeEventListener('click', onClick)
        }
    }, [])

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true" />
}

// Animated stripe with glow — tappable to reveal what it stands for
function Stripe({
    color,
    label,
    delay,
    thick,
    selected,
    onSelect
}: {
    color: string
    label: StripeKey
    delay: string
    thick?: boolean
    selected: boolean
    onSelect: () => void
}) {
    return (
        <button
            onClick={onSelect}
            aria-pressed={selected}
            aria-label={`${label} stripe`}
            className={cn(
                'w-full animate-fade-in-up opacity-0 relative overflow-hidden cursor-pointer',
                // `scale`, not a scale-x transform: the fade-in holds `transform` with fill-mode
                // forwards, which would silently override a transform-based hover
                'transition-[scale,box-shadow] duration-200 hover:[scale:1.04_1] focus-visible:[scale:1.04_1]',
                selected && '[scale:1.04_1]'
            )}
            style={{
                height: thick ? '2.5rem' : '1.25rem',
                backgroundColor: color,
                animationDelay: delay,
                animationFillMode: 'forwards',
                boxShadow: selected
                    ? `0 0 28px ${color}b0, 0 0 60px ${color}40`
                    : `0 0 18px ${color}60, 0 0 40px ${color}20`
            }}
        >
            {/* Scanline shimmer */}
            <span
                className="absolute inset-0"
                style={{
                    background: `repeating-linear-gradient(90deg, transparent, transparent 3px, ${color}30 3px, ${color}30 4px)`,
                    opacity: 0.4
                }}
            />
        </button>
    )
}

// The typed-out caption
function TypedCaption({ text, delay }: { text: string; delay: number }) {
    const [displayed, setDisplayed] = useState('')
    const [started, setStarted] = useState(false)

    useEffect(() => {
        const t = setTimeout(() => setStarted(true), delay)
        return () => clearTimeout(t)
    }, [delay])

    useEffect(() => {
        if (!started) return
        let i = 0
        const interval = setInterval(() => {
            setDisplayed(text.slice(0, i + 1))
            i++
            if (i >= text.length) clearInterval(interval)
        }, 45)
        return () => clearInterval(interval)
    }, [started, text])

    // The full caption sits invisibly in the same grid cell to reserve its width,
    // so the centred line doesn't re-centre on every typed character
    return (
        <span className="inline-grid">
            <span className="invisible col-start-1 row-start-1" aria-hidden="true">
                {text}▌
            </span>
            <span className="col-start-1 row-start-1 text-left">
                {displayed}
                {displayed.length < text.length && <span className="animate-blink text-accent">▌</span>}
            </span>
        </span>
    )
}

export default function Bi() {
    const [selected, setSelected] = useState<StripeKey | null>(null)

    return (
        <div className="flex flex-col items-center justify-center gap-8 px-4 py-8 min-h-full w-full relative overflow-hidden">
            <BiParticles />

            {/* Eyebrow */}
            <p
                className="mono-label text-muted-foreground/35 animate-fade-in-up opacity-0 tracking-[0.25em] relative z-10"
                style={{ animationDelay: '0.05s', animationFillMode: 'forwards' }}
            >
                // identity.flag
            </p>

            {/* Flag */}
            <div
                className="group relative z-10 flex flex-col gap-0.5 w-52 animate-fade-in-up opacity-0"
                style={{ rotate: '-1.5deg', animationDelay: '0.15s', animationFillMode: 'forwards' }}
            >
                {/* Corner brackets */}
                <div className="absolute -top-2 -left-2 w-4 h-4 border-t border-l border-white/20 pointer-events-none" />
                <div className="absolute -top-2 -right-2 w-4 h-4 border-t border-r border-white/20 pointer-events-none" />
                <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b border-l border-white/20 pointer-events-none" />
                <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b border-r border-white/20 pointer-events-none" />

                <Stripe
                    color={BI_COLORS.pink}
                    label="pink"
                    delay="0.2s"
                    thick
                    selected={selected === 'pink'}
                    onSelect={() => setSelected(selected === 'pink' ? null : 'pink')}
                />
                <Stripe
                    color={BI_COLORS.purple}
                    label="purple"
                    delay="0.3s"
                    selected={selected === 'purple'}
                    onSelect={() => setSelected(selected === 'purple' ? null : 'purple')}
                />
                <Stripe
                    color={BI_COLORS.blue}
                    label="blue"
                    delay="0.4s"
                    thick
                    selected={selected === 'blue'}
                    onSelect={() => setSelected(selected === 'blue' ? null : 'blue')}
                />

                {/* Hovering the flag reveals the cat, framed like the polaroid on /cool.
                    No pointer events, so it never steals the hover */}
                <div
                    className="absolute -left-2 -right-2 top-1/2 -translate-y-1/2 scale-95 opacity-0 pointer-events-none transition-[opacity,transform] duration-300 group-hover:scale-100 group-hover:opacity-100 bg-card border border-foreground/25 p-1.5"
                    style={{ boxShadow: `4px 4px 0 ${BI_COLORS.purple}99` }}
                >
                    <Image
                        src="/bicat.jpg"
                        alt="Orange cat tinted in bi flag colours"
                        width={208}
                        height={165}
                        className="w-full h-auto"
                    />
                </div>
            </div>

            {/* Main text */}
            <div
                className="text-center space-y-2 relative z-10 animate-fade-in-up opacity-0"
                style={{ animationDelay: '0.55s', animationFillMode: 'forwards' }}
            >
                <h1 className="text-display text-3xl md:text-4xl">
                    <span
                        style={{
                            background: `linear-gradient(90deg, ${BI_COLORS.pink}, ${BI_COLORS.purple}, ${BI_COLORS.blue})`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            filter: 'drop-shadow(0 0 8px rgba(214, 2, 112, 0.3))'
                        }}
                    >
                        everyone&apos;s cute
                    </span>
                </h1>
                <p className="mono-label text-muted-foreground/50">
                    <TypedCaption text="(not my fault)" delay={1200} />
                </p>
            </div>
        </div>
    )
}
