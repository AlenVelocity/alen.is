'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { api } from '@/trpc/react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { posthog } from '@/components/posthog-provider'
import { cn } from '@/lib/utils'
import { getPersona, type Persona as Who } from '@/lib/persona'
import { Persona, OnlyAlen, OnlyBan } from '@/components/persona'
import { Saucer } from './saucer'

/**
 * The blog's answer to Medium's clap. Tap repeatedly, up to a cap.
 *
 * For Alen a tap beams the post up to the mothership: it launches a saucer and
 * pushes a ring out from the hull. Ban has no saucer and his posts are
 * statements, so for him the same tap witnesses one: the stamp comes down and
 * leaves its mark. Same counter and same mutation either way.
 *
 * Only the reader's own tally is shown. The global total is neither rendered
 * nor fetchable (the API has no read endpoint yet, see routers/signals.ts,
 * which keeps the older storage name).
 *
 * Taps land instantly against local state and batch into a single mutation
 * once the tapping stops, so a burst of 30 costs one request.
 */

const MAX_BEAMS = 50
/** Quiet period after the last tap before the accumulated taps are sent */
const FLUSH_DELAY_MS = 900

interface Burst {
    id: number
    /** Who was in when the tap landed, which decides what the tap looks like */
    by: Who
    /** Sideways drift so repeat taps don't land on the same spot */
    dx: number
    tilt: number
}

/** Ban's side of the button: a rubber stamp, handle up. Inherits currentColor. */
function Stamp({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
            <circle cx="12" cy="5.5" r="3.5" />
            <path d="M10.5 8h3l1 6h-5z" />
            <rect x="4" y="14" width="16" height="4" />
            <rect x="3" y="20" width="18" height="1.5" />
        </svg>
    )
}

export function BeamUp({ slug }: { slug: string }) {
    const [mine, setMine] = useLocalStorage<number>(`blog-beams:${slug}`, 0)
    const [bursts, setBursts] = useState<Burst[]>([])

    const pendingRef = useRef(0)
    const flushTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    /**
     * Authoritative running tally. Reading `mine` in the click handler would
     * see the value from the last render, so a fast burst of taps would all
     * compute the same "+1". The ref advances synchronously instead.
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
            // Read at tap time: a burst only exists after a tap, so nothing can flash
            by: getPersona(),
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
                <AnimatePresence>
                    {bursts.map((burst) =>
                        burst.by === 'ban' ? (
                            // The stamp comes down hard and the mark stays a moment. No glow, no flight.
                            <motion.span
                                key={burst.id}
                                initial={{ opacity: 0, scale: 1.5, x: burst.dx, rotate: burst.tilt * 0.3 }}
                                animate={{ opacity: 1, scale: 1, x: burst.dx, rotate: burst.tilt * 0.3 }}
                                exit={{ opacity: 0, transition: { duration: 0.3 } }}
                                transition={{ duration: 0.12, ease: 'easeIn' }}
                                className="pointer-events-none absolute -top-9 left-0 whitespace-nowrap border-2 border-accent px-1.5 py-0.5 font-mono-ui text-[0.6rem] font-bold uppercase tracking-[0.2em] text-accent"
                            >
                                read
                            </motion.span>
                        ) : (
                            // A saucer launching, and a ring pushed out from the hull
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
                                    // Centring goes through framer too: its inline transform would
                                    // overwrite Tailwind's -translate-* classes and leave the ring off-centre
                                    initial={{ opacity: 0.55, scale: 0.6, x: '-50%', y: '-50%' }}
                                    animate={{ opacity: 0, scale: 2.1, x: '-50%', y: '-50%' }}
                                    transition={{ duration: 0.7, ease: 'easeOut' }}
                                    className="absolute left-1/2 top-3 h-9 w-9 rounded-full border border-accent"
                                />
                            </motion.span>
                        )
                    )}
                </AnimatePresence>

                <motion.button
                    type="button"
                    onClick={handleBeam}
                    disabled={maxed}
                    whileTap={maxed ? undefined : { scale: 0.85 }}
                    className={cn(
                        // Colour only, and never transition-all: a CSS transition on `transform`
                        // fights framer's whileTap. Round for the saucer, square for the stamp.
                        'relative flex h-12 w-12 items-center justify-center rounded-full border transition-colors duration-200 ban:rounded-none',
                        maxed
                            ? 'cursor-default border-accent/40 text-accent'
                            : 'border-border/60 text-muted-foreground hover:border-accent/50 hover:text-accent'
                    )}
                >
                    {/* The button's name, in words, so each of them can have his own */}
                    <span className="sr-only">
                        <Persona
                            alen={maxed ? 'Fully beamed up' : 'Beam this post up'}
                            ban={maxed ? 'The stamp is out of ink' : 'Stamp this statement'}
                        />
                    </span>
                    <OnlyAlen>
                        <Saucer className="h-6 w-6" />
                    </OnlyAlen>
                    <OnlyBan>
                        <Stamp className="h-6 w-6" />
                    </OnlyBan>
                </motion.button>

                {/* The reader's own tally. The global total stays private */}
                <span
                    className={cn(
                        'mono-label tabular-nums transition-colors duration-200',
                        mine > 0 ? 'text-accent' : 'text-muted-foreground/30'
                    )}
                >
                    ×{mine}
                </span>
            </div>

            <p className="mono-label text-muted-foreground/50">
                <Persona
                    alen={maxed ? "ok that's plenty, thanks" : 'tap the saucer to beam this post up'}
                    ban={maxed ? `${MAX_BEAMS}. The stamp is out of ink.` : "Stamp it if you read it. I'm counting."}
                />
            </p>
        </div>
    )
}
