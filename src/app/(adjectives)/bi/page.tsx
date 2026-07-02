'use client'

import { useEffect, useRef, useState } from 'react'

// Bisexual flag colors
const BI_COLORS = {
    pink: '#D60270',
    purple: '#9B4F96',
    blue: '#0038A8'
}

// Particles that float up in flag colors
function BiParticles() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        canvas.width = canvas.offsetWidth
        canvas.height = canvas.offsetHeight

        type Particle = {
            x: number
            y: number
            size: number
            color: string
            speed: number
            opacity: number
            drift: number
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

        let raf: number
        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            for (const p of particles) {
                ctx.globalAlpha = p.opacity
                ctx.fillStyle = p.color
                ctx.beginPath()
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
                ctx.fill()
                p.y -= p.speed
                p.x += p.drift
                if (p.y < -10) {
                    p.y = canvas.height + 10
                    p.x = Math.random() * canvas.width
                }
            }
            ctx.globalAlpha = 1
            raf = requestAnimationFrame(draw)
        }
        draw()
        return () => cancelAnimationFrame(raf)
    }, [])

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true" />
}

// Animated stripe with glow
function Stripe({ color, delay, thick }: { color: string; delay: string; thick?: boolean }) {
    return (
        <div
            className="w-full animate-fade-in-up opacity-0 relative overflow-hidden"
            style={{
                height: thick ? '2.5rem' : '1.25rem',
                backgroundColor: color,
                animationDelay: delay,
                animationFillMode: 'forwards',
                boxShadow: `0 0 18px ${color}60, 0 0 40px ${color}20`
            }}
        >
            {/* Scanline shimmer */}
            <div
                className="absolute inset-0"
                style={{
                    background: `repeating-linear-gradient(90deg, transparent, transparent 3px, ${color}30 3px, ${color}30 4px)`,
                    opacity: 0.4
                }}
            />
        </div>
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

    return (
        <span>
            {displayed}
            {displayed.length < text.length && <span className="animate-blink text-accent">▌</span>}
        </span>
    )
}

export default function Bi() {
    return (
        <div className="flex flex-col items-center justify-center gap-8 px-4 h-full relative overflow-hidden">
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
                className="relative z-10 flex flex-col gap-0.5 w-52 animate-fade-in-up opacity-0"
                style={{ rotate: '-1.5deg', animationDelay: '0.15s', animationFillMode: 'forwards' }}
            >
                {/* Corner brackets */}
                <div className="absolute -top-2 -left-2 w-4 h-4 border-t border-l border-white/20" />
                <div className="absolute -top-2 -right-2 w-4 h-4 border-t border-r border-white/20" />
                <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b border-l border-white/20" />
                <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b border-r border-white/20" />

                <Stripe color={BI_COLORS.pink} delay="0.2s" thick />
                <Stripe color={BI_COLORS.purple} delay="0.3s" />
                <Stripe color={BI_COLORS.blue} delay="0.4s" thick />
            </div>

            {/* Main text */}
            <div
                className="text-center space-y-2 relative z-10 animate-fade-in-up opacity-0"
                style={{ animationDelay: '0.55s', animationFillMode: 'forwards' }}
            >
                <h1 className="text-display text-3xl md:text-4xl animate-glitch-shift">
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
