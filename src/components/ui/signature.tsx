'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { Persona } from '@/components/persona'

interface SignatureProps {
    name: string
    /** What Ban signs. Falls back to `name`. */
    banName?: string
    className?: string
}

/** The page gets this long to land before the pen starts, in ms */
const WRITE_DELAY_MS = 400
const WRITE_SECONDS = 1.8
const WRITE_EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'

/**
 * The handwritten name under the about text.
 *
 * In light mode it is written on, left to right, behind a pen cursor: a block
 * of the page colour covers the name and shrinks away to the right. In dark
 * mode there is no write-on and the name is there from the start, as it has
 * been since the animation was added.
 *
 * Which mode it is comes from CSS (`dark:`), not from the theme hook, so the
 * server HTML is already right and the dark-mode name does not wait for
 * hydration and then fade in after the page has already arrived.
 */
export function Signature({ name, banName, className }: SignatureProps) {
    const [phase, setPhase] = useState<'waiting' | 'writing' | 'done'>('waiting')
    const written = phase !== 'waiting'

    useEffect(() => {
        const start = setTimeout(() => setPhase('writing'), WRITE_DELAY_MS)
        // The pen is put away on a timer, not on animationend: in dark mode it is
        // display:none and never animates, and a pen left mounted would run its
        // sweep across a finished name the first time the theme went light
        const end = setTimeout(() => setPhase('done'), WRITE_DELAY_MS + WRITE_SECONDS * 1000)
        return () => {
            clearTimeout(start)
            clearTimeout(end)
        }
    }, [])

    return (
        <div
            className={cn(
                'signature-text text-6xl relative overflow-hidden',
                'text-foreground/80 mt-4 pr-2',
                className
            )}
            style={{
                fontFamily: "'Better Signature', cursive",
                fontWeight: 'normal',
                fontStyle: 'normal'
            }}
        >
            <div className="relative inline-block">
                {/* Held back until the pen starts: the cover is only as big as the text
                    box, and a script face has strokes that reach outside it */}
                <span className={cn('relative', !written && 'opacity-0 dark:opacity-100')}>
                    <Persona alen={name} ban={banName ?? name} />
                </span>
                {/* The cover. Anchored right and shrinking, so the name appears from the left */}
                <span
                    className="absolute top-0 right-0 h-full bg-background transition-[width] dark:hidden"
                    style={{
                        width: written ? '0%' : '100%',
                        transitionDuration: `${WRITE_SECONDS}s`,
                        transitionTimingFunction: WRITE_EASE
                    }}
                    aria-hidden="true"
                />
                {/* The pen, riding the edge of the cover */}
                {phase === 'writing' && (
                    <span
                        className="absolute top-1 w-[3px] h-[80%] bg-accent/70 rounded-full dark:hidden"
                        style={{
                            right: '0%',
                            animation: `signatureCursorMove ${WRITE_SECONDS}s ${WRITE_EASE} forwards`
                        }}
                        aria-hidden="true"
                    />
                )}
            </div>
        </div>
    )
}
