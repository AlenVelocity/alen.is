'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { CenteredPage } from '@/components/ui/centered-page'
import { posthog } from '@/components/posthog-provider'
import { isMinimalMotion } from '@/lib/motion-pref'
import { collectPieces } from '@/lib/shred'
import { BEATS, type Approach, type Reaction } from './creatures'
import { CreatureArt } from './creature-art'
import { Figure } from './figure'

/**
 * /drowning — the UFO abduction's underwater sibling.
 *
 * Same trick as the saucer (see ufo-abduction.tsx): shred <main> into pieces
 * and send them somewhere. The beam pulls up; this lets go. The page sinks,
 * and then sixteen creatures take turns with whoever is left, one per beat,
 * getting faster the deeper it goes — the shape of the bridge in
 * "Drown You to Death".
 */

/** Let the incoming page-transition warp settle before the floor gives out */
const SINK_DELAY_MS = 1500
/** How long the page takes to disappear downwards */
const SINK_MS = 900
/** Beat pacing: the gauntlet accelerates as the depth increases */
const FIRST_BEAT_MS = 1050
const LAST_BEAT_MS = 580
/** Beat on the whale a little longer — it is the punchline */
const WHALE_HOLD_MS = 1750
/** Fraction of a strike at which it reaches the figure — where every keyframe puts contact */
const CONTACT_AT = 0.5
/** Blackout after the whale, before washing back up */
const SWALLOWED_MS = 1600

type Stage = 'intro' | 'sinking' | 'descent' | 'swallowed' | 'surfaced'

/** Milliseconds this beat holds before the next one lands */
function beatDuration(i: number) {
    const t = i / (BEATS.length - 1)
    return Math.round(FIRST_BEAT_MS + (LAST_BEAT_MS - FIRST_BEAT_MS) * t)
}

/** Depth bands, each with its own water. Crossing one cross-fades the gradient. */
const ZONES = [
    { limit: 200, label: 'sunlit', from: '196 70% 20%', to: '203 68% 9%' },
    { limit: 600, label: 'twilight', from: '206 70% 11%', to: '211 65% 5%' },
    { limit: 1200, label: 'midnight', from: '213 60% 6%', to: '217 55% 3%' },
    { limit: Infinity, label: 'the trench', from: '221 50% 3%', to: '225 45% 1%' }
]

function zoneIndex(depth: number) {
    const i = ZONES.findIndex((z) => depth < z.limit)
    return i === -1 ? ZONES.length - 1 : i
}

/**
 * Down here it is dark whichever theme the site is set to, so the scene pins
 * the dark palette locally. Without this, light mode would paint dark text
 * and a dark figure onto deep water and none of it would be readable. Muted
 * text and borders are lifted a little over the site's dark values — they sit
 * on water, not on the site background.
 */
const UNDERWATER_TOKENS = {
    '--foreground': '160 25% 85%',
    '--muted-foreground': '180 14% 58%',
    '--accent': '152 100% 48%',
    '--border': '200 20% 22%'
} as React.CSSProperties

/** Each reaction's keyframe (globals.css) — how the figure takes that particular hit */
const REACTION_KEYFRAME: Record<Reaction, string> = {
    knock: 'figureHit',
    eaten: 'figureEaten',
    squeeze: 'figureSqueeze',
    shake: 'figureShake',
    crumple: 'figureCrumple'
}

/** Where each creature starts, in vmin, relative to the figure it is aiming at */
const APPROACH_VECTOR: Record<Approach, [number, number]> = {
    left: [-54, 4],
    right: [54, -4],
    above: [6, -48],
    below: [-6, 48]
}

/** Aim every piece of the page at the seabed and let it go */
function sinkPieces(main: HTMLElement): HTMLElement[] {
    const floor = window.innerHeight
    // data-no-sink opts an element out — anything that belongs to the page rather
    // than to the scene playing out on it
    const pieces = collectPieces(main).filter((el) => !el.hasAttribute('data-no-sink'))
    pieces.forEach((el, i) => {
        const rect = el.getBoundingClientRect()
        el.style.setProperty('--sink-dy', `${floor - rect.top + 80}px`)
        el.style.setProperty('--sink-dx', `${(Math.random() * 2 - 1) * 40}px`)
        el.style.setProperty('--sink-sway', `${(Math.random() * 2 - 1) * 26}px`)
        el.style.setProperty('--sink-spin', `${((Math.random() * 2 - 1) * 14).toFixed(0)}deg`)
        el.style.setProperty('--sink-tilt', `${((Math.random() * 2 - 1) * 4).toFixed(1)}deg`)
        // Heavier things go first — top of the page sinks ahead of the bottom
        const delay = i * 0.05 + Math.random() * 0.08
        // Fill "both" for the same reason the abduction uses it: the 0% keyframe holds
        // the piece visible through its stagger delay instead of letting an unfinished
        // entry animation snap it back to opacity 0.
        el.style.animation = `sinkPiece 1.5s cubic-bezier(0.4, 0, 0.7, 0.5) ${delay.toFixed(2)}s both`
    })
    return pieces
}

/** Rising bubbles — fixed count, randomised once per descent */
function Bubbles() {
    const bubbles = useMemo(
        () =>
            Array.from({ length: 18 }, () => ({
                left: Math.random() * 100,
                size: 3 + Math.random() * 9,
                delay: Math.random() * 5,
                duration: 4 + Math.random() * 4
            })),
        []
    )

    return (
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
            {bubbles.map((b, i) => (
                <span
                    key={i}
                    className="absolute bottom-0 rounded-full border border-accent/25 bg-accent/5"
                    style={{
                        left: `${b.left}%`,
                        width: b.size,
                        height: b.size,
                        // "backwards" holds the 0% frame — opacity 0 — through the
                        // stagger delay. Without it each bubble sits fully visible on
                        // the seabed for up to five seconds waiting for its turn.
                        animation: `bubbleRise ${b.duration}s linear ${b.delay}s infinite backwards`
                    }}
                />
            ))}
        </div>
    )
}

/** Depth telemetry — the numbers climb for real, the commentary does not */
function DepthReadout({ depth, zone }: { depth: number; zone: number }) {
    return (
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 mono-label text-muted-foreground/60">
            <span>
                depth <span className="text-accent tabular-nums">{Math.round(depth)} m</span>
            </span>
            <span className="text-border">·</span>
        </div>
    )
}

/**
 * Reduced-motion fallback: the same sixteen encounters as a dive log. No
 * sinking, no strikes — you just get told what happened, in order.
 */
function DescentLog() {
    return (
        <ol className="w-full max-w-md divide-y divide-dashed divide-border/40 text-left">
            {BEATS.map((beat) => (
                <li key={beat.name} className="flex items-baseline gap-3 py-2">
                    <span className="mono-label text-accent tabular-nums w-16 shrink-0">{beat.depth} m</span>
                    <span className="text-[0.9rem] text-foreground">{beat.name}</span>
                    <span className="mono-label text-muted-foreground/60 ml-auto text-right">{beat.caption}</span>
                </li>
            ))}
        </ol>
    )
}

export function Descent() {
    const [stage, setStage] = useState<Stage>('intro')
    const [beat, setBeat] = useState(0)
    /** Hits landed so far. Trails the beat index until the strike actually connects. */
    const [damage, setDamage] = useState(0)
    const [depth, setDepth] = useState(0)
    const [staticLog, setStaticLog] = useState(false)
    const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])
    const piecesRef = useRef<HTMLElement[]>([])

    const track = useCallback((t: ReturnType<typeof setTimeout>) => {
        timersRef.current.push(t)
        return t
    }, [])

    const clearTimers = useCallback(() => {
        timersRef.current.forEach(clearTimeout)
        timersRef.current = []
    }, [])

    /** Strip the inline sink styles so the page can be rendered normally again */
    const restorePieces = useCallback(() => {
        piecesRef.current.forEach((el) => {
            el.style.animation = ''
            for (const p of ['--sink-dx', '--sink-dy', '--sink-sway', '--sink-spin', '--sink-tilt']) {
                el.style.removeProperty(p)
            }
        })
        piecesRef.current = []
    }, [])

    /** Run the gauntlet from a given beat, each one shorter than the last */
    const runBeat = useCallback(
        (i: number) => {
            setBeat(i)
            // The injury lands with the strike, not at the end of the beat, so the
            // new damage reads as the reason for the flinch. CONTACT_AT matches the
            // moment every strike keyframe reaches the figure.
            setDamage(i)
            const strike = beatDuration(i) * (BEATS[i].speed ?? 1)
            track(setTimeout(() => setDamage(i + 1), strike * CONTACT_AT))
            if (i >= BEATS.length - 1) {
                track(setTimeout(() => setStage('swallowed'), WHALE_HOLD_MS))
                track(
                    setTimeout(() => {
                        // React reuses the sunk page's DOM nodes for the surfaced copy —
                        // same tags in the same positions — and the sink animation was set
                        // imperatively, so React never clears it. Without this the page
                        // comes back at opacity 0: present, readable to the DOM, invisible.
                        restorePieces()
                        setStage('surfaced')
                    }, WHALE_HOLD_MS + SWALLOWED_MS)
                )
                return
            }
            track(setTimeout(() => runBeat(i + 1), beatDuration(i)))
        },
        [track, restorePieces]
    )

    const dive = useCallback(() => {
        clearTimers()
        restorePieces()
        setBeat(0)
        setDamage(0)
        setDepth(0)
        setStage('intro')
        track(
            setTimeout(() => {
                setStage('sinking')
                const main = document.querySelector('main')
                if (main) piecesRef.current = sinkPieces(main)
                track(
                    setTimeout(() => {
                        setStage('descent')
                        runBeat(0)
                    }, SINK_MS)
                )
            }, SINK_DELAY_MS)
        )
    }, [clearTimers, restorePieces, runBeat, track])

    // Kick off on arrival — unless the visitor has asked for less motion, in
    // which case they get the dive log instead of the dive.
    useEffect(() => {
        const minimal = window.matchMedia('(prefers-reduced-motion: reduce)').matches || isMinimalMotion()
        posthog.capture('drowning_visited', { minimal })
        if (minimal) {
            setStaticLog(true)
            return
        }
        dive()
        const timers = timersRef.current
        return () => timers.forEach(clearTimeout)
    }, [dive])

    // Ease the readout toward the current beat's depth so the number slides
    // rather than snapping between sixteen fixed values.
    useEffect(() => {
        if (stage !== 'descent') return
        const target = BEATS[beat].depth
        const tick = setInterval(() => {
            setDepth((d) => (Math.abs(target - d) < 1 ? target : d + (target - d) * 0.2))
        }, 60)
        return () => clearInterval(tick)
    }, [stage, beat])

    const surface = useCallback(() => {
        clearTimers()
        restorePieces()
        setStage('surfaced')
    }, [clearTimers, restorePieces])

    // Escape hatch — thirteen seconds is a long time to be underwater
    useEffect(() => {
        if (stage !== 'descent' && stage !== 'swallowed') return
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') surface()
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [stage, surface])

    useEffect(() => () => clearTimers(), [clearTimers])

    const current = BEATS[beat]
    const zone = zoneIndex(depth)
    const underwater = stage === 'descent' || stage === 'swallowed'
    const [vx, vy] = APPROACH_VECTOR[current.approach]
    const beatMs = beatDuration(beat)
    // Fast movers (shark, marlin, sturgeon) finish early and leave a beat of
    // quiet before the next one shows up. The reaction tracks the strike.
    const strikeMs = Math.round(beatMs * (current.speed ?? 1))
    // Being eaten has to stay frame-accurate against the whale's jaw, so it runs the
    // full strike; every other reaction settles just before its creature leaves.
    const reactMs = current.react === 'eaten' ? strikeMs : Math.round(strikeMs * 0.9)

    return (
        <>
            {/* The water. Four stacked gradients, cross-faded as the depth bands pass. */}
            {underwater && (
                <div className="fixed inset-0 z-[80]" aria-hidden="true">
                    {ZONES.map((z, i) => (
                        <div
                            key={z.label}
                            className="absolute inset-0 transition-opacity duration-1000 ease-out"
                            style={{
                                opacity: zone === i ? 1 : 0,
                                background: `linear-gradient(to bottom, hsl(${z.from}), hsl(${z.to}))`
                            }}
                        />
                    ))}
                    {/* Surface light, dimming as it gets further away */}
                    <div
                        className="absolute inset-x-0 top-0 h-1/3 transition-opacity duration-1000"
                        style={{
                            opacity: Math.max(0, 1 - zone * 0.34),
                            background: 'linear-gradient(to bottom, hsl(var(--accent) / 0.14), transparent)'
                        }}
                    />
                    <Bubbles />
                </div>
            )}

            {/* The gauntlet itself */}
            {underwater && (
                <div
                    className="fixed inset-0 z-[85] flex flex-col items-center justify-center gap-5 px-4"
                    style={UNDERWATER_TOKENS}
                >
                    {/* Clamped rather than pure vmin: the box only has to hold the figure,
                        since strikes move by transform and overflow it freely. Sizing it off
                        the viewport left ~180px of dead water between the figure and its
                        caption on a desktop, and a third of that on a narrow phone. */}
                    <div className="relative flex h-[clamp(130px,22vmin,190px)] w-full max-w-3xl items-center justify-center">
                        {/* Whoever this is, taking hit number {beat + 1} */}
                        <div
                            key={`figure-${beat}`}
                            className="relative z-10"
                            style={
                                {
                                    '--hit-x': `${-Math.sign(vx) * 13}px`,
                                    '--hit-y': `${-Math.sign(vy) * 9}px`,
                                    '--hit-r': `${-Math.sign(vx) * 7}deg`,
                                    animation: `${REACTION_KEYFRAME[current.react]} ${reactMs}ms cubic-bezier(0.22, 1, 0.36, 1) both`
                                } as React.CSSProperties
                            }
                        >
                            <Figure damage={damage} className="text-foreground/85" />
                        </div>

                        {/* …and what is doing the hitting, in its own way. Its own centred
                            layer, because the strike keyframes own `transform` — there is
                            no room left to centre it with one. */}
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                            <div
                                key={`creature-${beat}`}
                                className="text-accent drop-shadow-[0_0_14px_hsl(var(--accent)/0.35)]"
                                style={
                                    {
                                        '--strike-x': `${vx}vmin`,
                                        '--strike-y': `${vy}vmin`,
                                        '--strike-ms': `${strikeMs}ms`,
                                        animation: `${current.anim} ${strikeMs}ms cubic-bezier(0.3, 0, 0.4, 1) both`
                                    } as React.CSSProperties
                                }
                            >
                                <CreatureArt beat={current} />
                            </div>
                        </div>
                    </div>

                    {/* Name, aside, telemetry */}
                    <div className="flex flex-col items-center gap-3 text-center">
                        <p
                            key={`caption-${beat}`}
                            className="text-[0.95rem] text-foreground/80 animate-caption max-w-xs"
                            style={{ animationDuration: `${beatMs}ms` }}
                        >
                            {current.caption}{' '}
                            <span className="text-accent animate-caption" style={{ animationDuration: `${beatMs}ms` }}>
                                {current.name}
                            </span>
                        </p>
                        <DepthReadout depth={depth} zone={zone} />
                    </div>

                    <button
                        onClick={surface}
                        className="mono-label text-muted-foreground/50 hover:text-accent transition-colors duration-200"
                    >
                        surface (esc)
                    </button>
                </div>
            )}

            {/* Swallowed. Nothing to look at, which is the point. */}
            {stage === 'swallowed' && (
                <div className="fixed inset-0 z-[90] bg-black animate-blackout" aria-hidden="true" />
            )}

            {/* The page proper — sinks away on arrival, comes back once you wash up */}
            <CenteredPage className="relative z-10">
                {stage === 'surfaced' ? (
                    <div className="flex flex-col items-center gap-7 text-center animate-fade-in-up">
                        <p className="mono-label text-accent/60 tracking-[0.25em]">// washed up</p>
                        <h1 className="text-display text-4xl md:text-6xl glow-text">you&apos;re back</h1>
                        <div className="flex flex-wrap items-center justify-center gap-2">
                            <button
                                onClick={dive}
                                className="group mono-label inline-flex items-center gap-2 rounded-sm border border-accent/40 px-4 py-2.5 text-accent transition-all duration-200 hover:bg-accent/10 hover:shadow-[0_0_12px_hsl(var(--accent)/0.2)]"
                            >
                                again?
                                <span className="opacity-50 transition-opacity group-hover:opacity-100">↓</span>
                            </button>
                            <Link
                                href="/"
                                className="group mono-label inline-flex items-center gap-2 rounded-sm border border-border/60 px-4 py-2.5 text-muted-foreground transition-all duration-200 hover:border-border hover:text-foreground"
                            >
                                dry land
                                <span className="opacity-50 transition-opacity group-hover:opacity-100">↑</span>
                            </Link>
                        </div>
                    </div>
                ) : staticLog ? (
                    <div className="flex flex-col items-center gap-7 py-16">
                        <p className="mono-label tracking-[0.25em] text-accent/60">// dive log</p>
                        <h1 className="text-display text-4xl md:text-5xl glow-text">it went badly</h1>
                        <p className="max-w-sm text-center text-[0.9rem] text-muted-foreground">
                            you asked for less motion, so here is the descent as a list. sixteen entries. it does not
                            improve.
                        </p>
                        <DescentLog />
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-7 text-center">
                        <p className="mono-label tracking-[0.25em] text-accent/60">
                            // something down there is singing
                            <span className="animate-blink ml-1">▌</span>
                        </p>
                        <h1 className="text-display text-4xl md:text-6xl glow-text">the water looks fine</h1>
                        <p className="max-w-sm text-[0.9rem] text-muted-foreground">or does it?</p>
                    </div>
                )}
            </CenteredPage>

            {/* Credit where the bridge came from. data-no-sink keeps it out of the
                shred — it belongs to the page, not to the thing happening on it, so it
                fades rather than being dragged under. Clamped to two lines: the title
                is long enough to wrap to three on a narrow screen. */}
            <p
                data-no-sink
                className="pointer-events-none fixed bottom-4 left-1/2 z-[95] line-clamp-2 max-w-[min(92vw,44rem)] -translate-x-1/2 text-balance px-4 text-center mono-label text-muted-foreground/35 transition-opacity duration-700"
                style={{ opacity: stage === 'intro' || stage === 'surfaced' ? 1 : 0 }}
            >
                after &ldquo;I am gonna claw (out your eyes then drown You to Death)&rdquo; · Darren Korb · Hades II
            </p>
        </>
    )
}
