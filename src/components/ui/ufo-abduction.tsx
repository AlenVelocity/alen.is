'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { posthog } from '@/components/posthog-provider'
import { isMinimalMotion } from '@/lib/motion-pref'

/**
 * The site's UFO abduction, in two flavors:
 *
 * 1. Page transition — every internal navigation is a quick abduction: the
 *    saucer zips in, shreds the outgoing page into its tractor beam, warps,
 *    then beams the new page down while flying off. Link clicks are
 *    intercepted document-wide in the capture phase (Next's <Link> respects
 *    preventDefault), and the command bar warps via the ufoWarp() helper.
 *
 * 2. Konami code (↑↑↓↓←→←→BA) — the full theatrical version: slow arrival,
 *    long beam, gulp, departure, and the same content beamed back down.
 *
 * The shredding splits <main> into content blocks and gives each one CSS vars
 * (--abduct-dx/--abduct-dy) pointing at the beam axis / saucer mouth; the
 * shared abductPiece keyframe rides them up the cone (see globals.css).
 */

const KONAMI = [
    'arrowup',
    'arrowup',
    'arrowdown',
    'arrowdown',
    'arrowleft',
    'arrowright',
    'arrowleft',
    'arrowright',
    'b',
    'a'
]

/** Where the saucer hovers: horizontally centered, 4% down the viewport (matches top-[4%] below) */
const SAUCER_TOP_VH = 0.04
/** Vertical offset from the group's top to the hull's mouth, in px (svg hull sits at y≈38) */
const SAUCER_MOUTH_OFFSET = 38

/** How long the outgoing page has before the route actually changes, in ms */
const WARP_OUT_MS = 750
/** Enter phase duration — must outlast the 0.9s abductReturn animation */
const WARP_IN_MS = 950

type Phase = 'idle' | 'arrive' | 'beam' | 'swallow' | 'depart' | 'warp-out' | 'warp-in'

/** Custom event other components (e.g. the command bar) dispatch to navigate via abduction */
export const UFO_WARP_EVENT = 'alen:ufo-warp'

export function ufoWarp(href: string) {
    if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent<string>(UFO_WARP_EVENT, { detail: href }))
}

/**
 * Split the page into abductable pieces: descend through single-child
 * wrappers (PageTransition, containers), take the content blocks, and explode
 * small blocks into their children for a confetti-like shredding.
 */
function collectPieces(root: HTMLElement): HTMLElement[] {
    let node: HTMLElement = root
    while (node.children.length === 1 && node.firstElementChild instanceof HTMLElement) {
        node = node.firstElementChild
    }
    const blocks = [...node.children].filter((el): el is HTMLElement => el instanceof HTMLElement)
    const explode = (els: HTMLElement[]) =>
        els.flatMap((el) => {
            const kids = [...el.children].filter((k): k is HTMLElement => k instanceof HTMLElement)
            return kids.length >= 2 && kids.length <= 8 ? kids : [el]
        })
    // Two explosion passes: container → sections → headings/paragraphs/rows
    const exploded = explode(explode(blocks))
    // Cap the piece count so huge pages don't animate 100 elements at once
    const pieces = exploded.length <= 30 ? exploded : explode(blocks).length <= 30 ? explode(blocks) : blocks
    return pieces.filter((el) => {
        const rect = el.getBoundingClientRect()
        return rect.width > 0 && rect.height > 0
    })
}

interface ShredOptions {
    /** Per-piece animation duration in seconds */
    duration: number
    /** Stagger step per shuffled slot, and its cap, in seconds */
    step: number
    maxStagger: number
    /** Random extra delay per piece, in seconds */
    jitter: number
}

/** Aim every piece at the beam axis + saucer mouth and start its flight */
function shredPieces(main: HTMLElement, opts: ShredOptions): HTMLElement[] {
    const beamX = window.innerWidth / 2
    const mouthY = window.innerHeight * SAUCER_TOP_VH + SAUCER_MOUTH_OFFSET
    const pieces = collectPieces(main)
    // Shuffle departure order so pieces don't leave strictly top-to-bottom
    const slots = [...pieces.keys()].sort(() => Math.random() - 0.5)
    pieces.forEach((el, i) => {
        const rect = el.getBoundingClientRect()
        el.style.setProperty('--abduct-dx', `${beamX - (rect.left + rect.width / 2)}px`)
        el.style.setProperty('--abduct-dy', `${mouthY - (rect.top + rect.height / 2)}px`)
        el.style.setProperty('--abduct-spin', `${((Math.random() * 2 - 1) * 35).toFixed(0)}deg`)
        el.style.setProperty('--abduct-wobble', `${((Math.random() * 2 - 1) * 3).toFixed(1)}deg`)
        const delay = Math.min(slots[i] * opts.step, opts.maxStagger) + Math.random() * opts.jitter
        // Fill mode "both": the 0% keyframe (fully visible, untransformed) covers the
        // stagger delay. Plain "forwards" would let pieces whose resting look depends on
        // a completed entry animation (e.g. animate-fade-in-up's forwards fill) snap back
        // to their opacity-0 base state while waiting — a visible flash before liftoff.
        el.style.animation = `abductPiece ${opts.duration}s cubic-bezier(0.5, -0.2, 0.7, 0.3) ${delay.toFixed(2)}s both`
    })
    return pieces
}

function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function UfoAbduction() {
    const router = useRouter()
    const pathname = usePathname()
    const [phase, setPhase] = useState<Phase>('idle')
    const phaseRef = useRef<Phase>('idle')
    const progressRef = useRef(0)
    const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])
    const piecesRef = useRef<HTMLElement[]>([])
    const warpPendingRef = useRef(false)

    /** setState + ref in one step so event handlers can read the current phase synchronously */
    const changePhase = useCallback((p: Phase) => {
        phaseRef.current = p
        setPhase(p)
    }, [])

    const clearTimers = useCallback(() => {
        timersRef.current.forEach(clearTimeout)
        timersRef.current = []
    }, [])

    const at = useCallback((ms: number, fn: () => void) => {
        timersRef.current.push(setTimeout(fn, ms))
    }, [])

    /** Remove all per-piece inline animation styles applied during a beam phase */
    const restorePieces = useCallback(() => {
        piecesRef.current.forEach((el) => {
            el.style.animation = ''
            el.style.removeProperty('--abduct-dx')
            el.style.removeProperty('--abduct-dy')
            el.style.removeProperty('--abduct-spin')
            el.style.removeProperty('--abduct-wobble')
        })
        piecesRef.current = []
    }, [])

    /* ── Flavor 1: navigation warp ──────────────────────────────────────── */

    const warpTo = useCallback(
        (href: string) => {
            // Mid-sequence, reduced motion, or the user's minimal-motion toggle:
            // plain navigation, no light show
            if (phaseRef.current !== 'idle' || prefersReducedMotion() || isMinimalMotion()) {
                router.push(href)
                return
            }
            posthog.capture('ufo_warp', { href })
            clearTimers()
            changePhase('warp-out')
            document.body.classList.add('ufo-abduct')
            const main = document.querySelector('main')
            if (main) {
                piecesRef.current = shredPieces(main, { duration: 0.55, step: 0.03, maxStagger: 0.12, jitter: 0.05 })
            }
            warpPendingRef.current = true
            at(WARP_OUT_MS, () => router.push(href))
            // Safety net: if the route never changes (push failed), put the page back
            at(4000, () => {
                if (phaseRef.current === 'warp-out') {
                    warpPendingRef.current = false
                    restorePieces()
                    document.body.classList.remove('ufo-abduct')
                    changePhase('idle')
                }
            })
        },
        [router, changePhase, clearTimers, at, restorePieces]
    )

    // The new route rendered: beam the fresh page down while the saucer departs
    useEffect(() => {
        if (phaseRef.current !== 'warp-out' || !warpPendingRef.current) return
        warpPendingRef.current = false
        clearTimers()
        restorePieces() // old pieces were unmounted with the previous page; clears stale refs
        document.body.classList.remove('ufo-abduct')
        document.body.classList.add('ufo-return')
        changePhase('warp-in')
        at(WARP_IN_MS, () => {
            document.body.classList.remove('ufo-return')
            changePhase('idle')
        })
    }, [pathname, changePhase, clearTimers, at, restorePieces])

    // Intercept internal link clicks site-wide. Capture phase runs before
    // Next's <Link> handler, which bails out once defaultPrevented is set.
    useEffect(() => {
        const onClick = (e: MouseEvent) => {
            if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
            const anchor = (e.target as HTMLElement).closest?.('a')
            if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) return
            const href = anchor.getAttribute('href')
            if (!href) return
            let url: URL
            try {
                url = new URL(href, location.href)
            } catch {
                return
            }
            if (url.origin !== location.origin) return
            const norm = (p: string) => p.replace(/\/+$/, '') || '/'
            if (norm(url.pathname) === norm(location.pathname)) return // same page / hash link
            e.preventDefault()
            warpTo(url.pathname + url.search + url.hash)
        }
        document.addEventListener('click', onClick, true)
        return () => document.removeEventListener('click', onClick, true)
    }, [warpTo])

    // Programmatic warps (command bar)
    useEffect(() => {
        const onWarp = (e: Event) => warpTo((e as CustomEvent<string>).detail)
        window.addEventListener(UFO_WARP_EVENT, onWarp)
        return () => window.removeEventListener(UFO_WARP_EVENT, onWarp)
    }, [warpTo])

    /* ── Flavor 2: Konami code, the full show ───────────────────────────── */

    const konamiTrigger = useCallback(() => {
        // One abduction at a time — the mothership has limited beam capacity
        if (phaseRef.current !== 'idle') return

        posthog.capture('konami_ufo_triggered')

        // Motion-sensitive visitors get acknowledged without the full light show
        if (prefersReducedMotion()) {
            toast('signal received. the mothership sends its regards.')
            return
        }

        clearTimers()
        const main = document.querySelector('main')

        changePhase('arrive')
        at(900, () => {
            changePhase('beam')
            document.body.classList.add('ufo-abduct')
            if (main) {
                piecesRef.current = shredPieces(main, { duration: 1.15, step: 0.07, maxStagger: 0.6, jitter: 0.1 })
            }
        })
        at(2900, () => {
            // All pieces consumed — beam off, saucer does a little gulp
            changePhase('swallow')
        })
        at(3400, () => {
            changePhase('depart')
            // Beam the content back down while the saucer leaves
            restorePieces()
            document.body.classList.remove('ufo-abduct')
            document.body.classList.add('ufo-return')
        })
        at(4400, () => {
            document.body.classList.remove('ufo-return')
            changePhase('idle')
            toast('abduction complete. subject returned mostly intact.')
        })
    }, [changePhase, clearTimers, at, restorePieces])

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            const key = e.key.toLowerCase()
            progressRef.current =
                key === KONAMI[progressRef.current] ? progressRef.current + 1 : key === KONAMI[0] ? 1 : 0
            if (progressRef.current === KONAMI.length) {
                progressRef.current = 0
                konamiTrigger()
            }
        }
        window.addEventListener('keydown', onKeyDown)
        return () => {
            window.removeEventListener('keydown', onKeyDown)
            clearTimers()
            restorePieces()
            document.body.classList.remove('ufo-abduct', 'ufo-return')
        }
    }, [konamiTrigger, clearTimers, restorePieces])

    /* ── Render ─────────────────────────────────────────────────────────── */

    if (phase === 'idle') return null

    const saucerAnimation = {
        arrive: 'ufoArrive 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        beam: 'ufoBob 2s ease-in-out infinite',
        swallow: 'ufoSwallow 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        depart: 'ufoDepart 0.9s cubic-bezier(0.55, 0, 0.9, 0.4) forwards',
        'warp-out': 'ufoArrive 0.35s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'warp-in': 'ufoDepart 0.6s cubic-bezier(0.55, 0, 0.9, 0.4) 0.25s both'
    }[phase]

    const beamAnimation =
        phase === 'warp-in'
            ? 'beamRetract 0.45s cubic-bezier(0.55, 0, 0.9, 0.4) forwards'
            : phase === 'warp-out'
              ? 'beamDrop 0.25s cubic-bezier(0.22, 1, 0.36, 1) forwards, beamFlicker 1.1s ease-in-out 0.25s infinite'
              : 'beamDrop 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards, beamFlicker 1.1s ease-in-out 0.4s infinite'

    const showBeam = phase === 'beam' || phase === 'warp-out' || phase === 'warp-in'

    return (
        <div className="fixed inset-0 z-[95] pointer-events-none overflow-hidden" aria-hidden="true">
            {/* Green wash over the whole viewport while the beam is pulling */}
            {(phase === 'beam' || phase === 'warp-out') && (
                <div
                    className="absolute inset-0 animate-pulse"
                    style={{
                        background: 'radial-gradient(ellipse at 50% 0%, hsl(var(--accent) / 0.08), transparent 60%)'
                    }}
                />
            )}

            {/* Saucer + tractor beam, positioned as one unit so the beam stays under the hull */}
            <div className="absolute left-1/2 top-[4%] -translate-x-1/2" style={{ animation: saucerAnimation }}>
                {/* Tractor beam */}
                {showBeam && (
                    <div
                        className="absolute left-1/2 top-[46px] -translate-x-1/2 w-[560px] max-w-[92vw] h-[94vh] origin-top"
                        style={{
                            clipPath: 'polygon(44% 0, 56% 0, 100% 100%, 0 100%)',
                            background:
                                'linear-gradient(to bottom, hsl(var(--accent) / 0.35), hsl(var(--accent) / 0.1) 55%, transparent)',
                            animation: beamAnimation
                        }}
                    />
                )}

                {/* The saucer itself */}
                <svg
                    width="130"
                    height="64"
                    viewBox="0 0 130 64"
                    className="relative drop-shadow-[0_0_18px_hsl(var(--accent)/0.5)]"
                >
                    {/* Cockpit dome */}
                    <ellipse
                        cx="65"
                        cy="24"
                        rx="24"
                        ry="17"
                        fill="hsl(var(--accent) / 0.25)"
                        stroke="hsl(var(--accent) / 0.7)"
                        strokeWidth="1.5"
                    />
                    {/* Pilot silhouette */}
                    <circle cx="65" cy="22" r="6" fill="hsl(var(--accent) / 0.55)" />
                    {/* Hull */}
                    <ellipse
                        cx="65"
                        cy="38"
                        rx="56"
                        ry="15"
                        fill="hsl(200 30% 8%)"
                        stroke="hsl(var(--accent) / 0.8)"
                        strokeWidth="1.5"
                    />
                    {/* Running lights — staggered blink via CSS animation delays */}
                    {[22, 44, 65, 86, 108].map((x, i) => (
                        <circle
                            key={x}
                            cx={x}
                            cy="40"
                            r="3"
                            fill="hsl(var(--accent))"
                            style={{ animation: `flicker 1.2s linear ${i * 0.18}s infinite` }}
                        />
                    ))}
                </svg>
            </div>
        </div>
    )
}
