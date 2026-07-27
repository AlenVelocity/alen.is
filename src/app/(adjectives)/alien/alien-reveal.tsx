'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { CenteredPage } from '@/components/ui/centered-page'
import { ufoAbduct, ABDUCTION_TIMINGS, UFO_PHASE_EVENT, type Phase } from '@/components/ui/ufo-abduction'
import { SpaceShader } from './space-shader'

/**
 * The payoff at the end of /human → /definitely-human → /alien.
 *
 * The abduction itself is the plain site-wide UFO show (see ufo-abduction.tsx)
 * running its drawn-out `alien_page` pacing — deliberately unshaded, so the
 * saucer and the shredding page stay the focus. The GLSL only arrives *after*,
 * when the visitor is left in orbit for a while before being dropped home.
 */

/** Wait out the incoming page-transition warp before calling the saucer (it ignores overlapping requests) */
const SUMMON_DELAY_MS = 1400
/**
 * Switch to orbit exactly when the saucer beams the page back down, so what
 * materialises is already the view from up there — waiting for the abduction to
 * fully settle would flash the old copy first.
 */
const ORBIT_AT_MS = ABDUCTION_TIMINGS.alien_page.departAt
/** How long the visitor drifts in orbit before being returned */
const ORBIT_SECONDS = 30

/** Status readout during the abduction, so the long build-up reads as a sequence */
const PHASE_STATUS: Record<Phase, string> = {
    idle: '// i mean you found me',
    arrive: '// something showed up',
    beam: '// beam locked on',
    swallow: '// yep, that happened',
    depart: '// heading up',
    'warp-out': '// gone',
    'warp-in': '// landed'
}

/** Orbit telemetry — deliberately absurd, but it counts down for real */
function OrbitReadout({ remaining }: { remaining: number }) {
    const elapsed = ORBIT_SECONDS - remaining
    const altitude = (410 + elapsed * 2.3).toFixed(1)

    return (
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 mono-label text-muted-foreground/60">
            <span>
                altitude <span className="text-accent">{altitude} km</span>
            </span>
            <span className="text-border">·</span>
            <span>
                air <span className="text-accent">fine, apparently</span>
            </span>
            <span className="text-border">·</span>
            <span>
                back in <span className="text-accent">{remaining}s</span>
            </span>
        </div>
    )
}

export function AlienReveal() {
    const [phase, setPhase] = useState<Phase>('idle')
    const [inOrbit, setInOrbit] = useState(false)
    const [remaining, setRemaining] = useState(ORBIT_SECONDS)
    const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])

    const track = (t: ReturnType<typeof setTimeout>) => {
        timersRef.current.push(t)
        return t
    }

    // Mirror the abduction's phase for the status readout
    useEffect(() => {
        const onPhase = (e: Event) => setPhase((e as CustomEvent<Phase>).detail)
        window.addEventListener(UFO_PHASE_EVENT, onPhase)
        return () => window.removeEventListener(UFO_PHASE_EVENT, onPhase)
    }, [])

    /** Abduct, then leave the visitor up there */
    const runSequence = useCallback((delay: number) => {
        track(
            setTimeout(() => {
                ufoAbduct()
                track(
                    setTimeout(() => {
                        setRemaining(ORBIT_SECONDS)
                        setInOrbit(true)
                    }, ORBIT_AT_MS)
                )
            }, delay)
        )
    }, [])

    useEffect(() => {
        runSequence(SUMMON_DELAY_MS)
        const timers = timersRef.current
        return () => timers.forEach(clearTimeout)
    }, [runSequence])

    // Countdown while in orbit; hitting zero drops the visitor home
    useEffect(() => {
        if (!inOrbit) return
        const tick = setInterval(() => {
            setRemaining((r) => {
                if (r <= 1) {
                    clearInterval(tick)
                    setInOrbit(false)
                    return 0
                }
                return r - 1
            })
        }, 1000)
        return () => clearInterval(tick)
    }, [inOrbit])

    const returned = !inOrbit && remaining < ORBIT_SECONDS
    const abducting = phase !== 'idle'

    const goAgain = () => {
        setRemaining(ORBIT_SECONDS)
        runSequence(0)
    }

    return (
        <>
            <SpaceShader visible={inOrbit} />
            <CenteredPage className="relative z-10">
                <div className="flex flex-col items-center gap-7 text-center">
                    {/* Status readout */}
                    <p className="mono-label text-accent/60 tracking-[0.25em]">
                        {inOrbit ? '// somewhere up here' : PHASE_STATUS[phase]}
                        {(abducting || inOrbit) && <span className="animate-blink ml-1">▌</span>}
                    </p>

                    {/* Headline */}
                    <h1 className="text-display text-4xl md:text-6xl glow-text">
                        {inOrbit ? "yeah that's earth down there" : 'ok, you got me'}
                    </h1>

                    <p className="text-[0.9rem] text-muted-foreground max-w-sm">
                        {inOrbit
                            ? "that's earth. smaller than you'd think. take a sec, i'll drop you back down soon."
                            : returned
                              ? "you're back. mostly intact. let's not talk about this again."
                              : "you weren't supposed to find this page. someone's coming to sort it out"}
                    </p>

                    {inOrbit && <OrbitReadout remaining={remaining} />}

                    {/* Controls */}
                    {inOrbit ? (
                        <button
                            onClick={() => setInOrbit(false)}
                            className="mono-label inline-flex items-center gap-2 px-4 py-2.5 border border-accent/40 rounded-sm text-accent hover:bg-accent/10 hover:shadow-[0_0_12px_hsl(var(--accent)/0.2)] transition-all duration-200"
                        >
                            put me back
                            <span className="opacity-60">↓</span>
                        </button>
                    ) : (
                        returned && (
                            <div className="flex flex-wrap items-center justify-center gap-2 animate-fade-in-up">
                                <button
                                    onClick={goAgain}
                                    className="group mono-label inline-flex items-center gap-2 px-4 py-2.5 border border-accent/40 rounded-sm text-accent hover:bg-accent/10 hover:shadow-[0_0_12px_hsl(var(--accent)/0.2)] transition-all duration-200"
                                >
                                    again?
                                    <span className="opacity-50 group-hover:opacity-100 transition-opacity">↑</span>
                                </button>
                                <Link
                                    href="/human"
                                    className="mono-label inline-flex items-center gap-2 px-4 py-2.5 border border-border/60 rounded-sm text-muted-foreground hover:text-foreground hover:border-border transition-all duration-200"
                                >
                                    i saw nothing
                                </Link>
                            </div>
                        )
                    )}
                </div>
            </CenteredPage>
        </>
    )
}