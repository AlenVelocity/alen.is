'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { api } from '@/trpc/react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { posthog } from '@/components/posthog-provider'
import { cn } from '@/lib/utils'

/**
 * The blog's answer to Medium's clap: tap to beam a post up to the mothership.
 * Tap repeatedly, up to a cap — each tap launches a saucer and pushes a ring
 * out from the hull.
 *
 * Only the reader's own tally is shown. The global total is neither rendered
 * nor fetchable (the API has no read endpoint yet — see routers/signals.ts,
 * which keeps the older storage name).
 *
 * Taps land instantly against local state and batch into a single mutation
 * once the tapping stops, so a burst of 30 costs one request.
 */

const MAX_BEAMS = 50
/** Quiet period after the last tap before the accumulated taps are sent */
const FLUSH_DELAY_MS = 900

/** The site's saucer, small enough to sit in a button. Inherits currentColor. */
function Saucer({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 40 26" className={className} fill="none" aria-hidden="true">
            {/* Cockpit dome */}
            <ellipse cx="20" cy="9.5" rx="7" ry="5.5" fill="currentColor" opacity="0.4" />
            {/* Hull */}
            <ellipse cx="20" cy="15" rx="17" ry="4.8" fill="currentColor" />
            {/* Running lights */}
            <circle cx="9" cy="15.5" r="1.5" fill="currentColor" opacity="0.55" />
            <circle cx="20" cy="16.2" r="1.5" fill="currentColor" opacity="0.55" />
            <circle cx="31" cy="15.5" r="1.5" fill="currentColor" opacity="0.55" />
        </svg>
    )
}

interface Burst {
    id: number
    /** Sideways drift so repeat taps don't launch along the same line */
    dx: number
    tilt: number
}

export function BeamUp({ slug }: { slug: string }) {
    const [mine, setMine] = useLocalStorage<number>(`blog-beams:${slug}`, 0)
    const [bursts, setBursts] = useState<Burst[]>([])

    const pendingRef = useRef(0)
    const flushTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    /**
     * Authoritative running tally. Reading `mine` in the click handler would
     * see the value from the last render, so a fast burst of taps would all
     * compute the same "+1" — the ref advances synchronously instead.
     */
    const mineRef = useRef(mine)

    // Pick up the value restored from localStorage after mount
    useEffect(() => {
        mineRef.current = mine
    }, [mine])

    const { mutate } = api.signals.boost.useMutation({
        // Fire-and-forget: a dropped tap isn't worth interrupting anyone over
        onError: () => {}
    })

    const flush = useCallback(() => {
        const amount = pendingRef.current
        pendingRef.current = 0
        if (amount > 0) mutate({ slug, amount })
    }, [mutate, slug])

    // Don't lose buffered taps when the reader leaves mid-burst
    useEffect(() => {
        const onHide = () => {
            if (flushTimerRef.current) clearTimeout(flushTimerRef.current)
            flush()
        }
        window.addEventListener('pagehide', onHide)
        return () => {
            window.removeEventListener('pagehide', onHide)
            onHide()
        }
    }, [flush])

    const maxed = mine >= MAX_BEAMS

    const handleBeam = () => {
        if (mineRef.current >= MAX_BEAMS) return

        const next = mineRef.current + 1
        mineRef.current = next
        setMine(next)
        pendingRef.current += 1

        const burst: Burst = {
            id: Date.now() + Math.random(),
            dx: (Math.random() - 0.5) * 26,
            tilt: (Math.random() - 0.5) * 40
        }
        setBursts((b) => [...b, burst])
        setTimeout(() => setBursts((b) => b.filter((x) => x.id !== burst.id)), 900)

        if (flushTimerRef.current) clearTimeout(flushTimerRef.current)
        flushTimerRef.current = setTimeout(flush, FLUSH_DELAY_MS)

        if (next === 1) posthog.capture('blog_beam_up', { slug })
    }

    return (
        <div className="flex flex-col items-center gap-3">
            <div className="relative flex items-center gap-3">
                {/* Saucers launching, and a ring pushed out from the hull */}
                <AnimatePresence>
                    {bursts.map((burst) => (
                        <motion.span key={burst.id} className="pointer-events-none absolute left-3 top-0">
                            <motion.span
                                initial={{ opacity: 0, y: 4, x: 0, scale: 0.4, rotate: 0 }}
                                animate={{ opacity: 1, y: -52, x: burst.dx, scale: 1, rotate: burst.tilt }}
                                exit={{ opacity: 0, y: -70 }}
                                transition={{ duration: 0.9, ease: 'easeOut' }}
                                className="block text-accent"
                            >
                                <Saucer className="h-4 w-4 drop-shadow-[0_0_6px_hsl(var(--accent)/0.6)]" />
                            </motion.span>
                            <motion.span
                                initial={{ opacity: 0.55, scale: 0.6 }}
                                animate={{ opacity: 0, scale: 2.1 }}
                                transition={{ duration: 0.7, ease: 'easeOut' }}
                                className="absolute left-1/2 top-3 h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent"
                            />
                        </motion.span>
                    ))}
                </AnimatePresence>

                <motion.button
                    onClick={handleBeam}
                    disabled={maxed}
                    whileTap={maxed ? undefined : { scale: 0.85 }}
                    aria-label={maxed ? 'Fully beamed up' : 'Beam this post up'}
                    className={cn(
                        'group relative flex h-12 w-12 items-center justify-center rounded-full border transition-all duration-200',
                        maxed
                            ? 'cursor-default border-accent/40 text-accent'
                            : 'border-border/60 text-muted-foreground hover:border-accent/50 hover:text-accent hover:bg-accent/5 hover:shadow-[0_0_16px_hsl(var(--accent)/0.18)]'
                    )}
                >
                    <Saucer className="h-6 w-6" />
                </motion.button>

                {/* The reader's own tally — the global total stays private */}
                <span
                    className={cn(
                        'mono-label tabular-nums transition-colors duration-200',
                        mine > 0 ? 'text-accent' : 'text-muted-foreground/30'
                    )}
                >
                    ×{mine}
                </span>
            </div>

            <p className="mono-label text-muted-foreground/35">
                {maxed ? "// ok that's plenty, thanks" : '// tap to beam this up'}
            </p>
        </div>
    )
}
