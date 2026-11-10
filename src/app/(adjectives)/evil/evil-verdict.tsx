'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Persona } from '@/components/persona'
import { getPersona } from '@/lib/persona'
import { isMinimalMotion } from '@/lib/motion-pref'

/** How long the other answer shows when it slips, in ms */
const SLIP_MIN_MS = 90
const SLIP_EXTRA_MS = 90
/** How long Alen's answer holds between slips, in ms */
const HOLD_MIN_MS = 3200
const HOLD_EXTRA_MS = 4200

/**
 * The answer to "alen is evil". Alen's is "no". Every few seconds it slips for
 * about a tenth of a second and Ban's answer shows through, in his type and
 * his red. Hovering or focusing the word holds the slip open, and following it
 * leads to /ban, which is the only way anyone finds that page.
 *
 * While Ban is in there is nothing to slip: the answer is his.
 */
export function EvilVerdict() {
    const [slipped, setSlipped] = useState(false)

    useEffect(() => {
        if (getPersona() === 'ban') return
        if (isMinimalMotion() || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
        let hold: ReturnType<typeof setTimeout>
        let slip: ReturnType<typeof setTimeout>
        const wait = () => {
            hold = setTimeout(
                () => {
                    setSlipped(true)
                    slip = setTimeout(
                        () => {
                            setSlipped(false)
                            wait()
                        },
                        SLIP_MIN_MS + Math.random() * SLIP_EXTRA_MS
                    )
                },
                HOLD_MIN_MS + Math.random() * HOLD_EXTRA_MS
            )
        }
        wait()
        return () => {
            clearTimeout(hold)
            clearTimeout(slip)
        }
    }, [])

    return (
        <Persona
            alen={
                <Link href="/ban" className="group relative inline-block" aria-label="no">
                    <span className={cn('group-hover:opacity-0 group-focus-visible:opacity-0', slipped && 'opacity-0')}>
                        no
                    </span>
                    <span
                        aria-hidden="true"
                        className={cn(
                            'ban-slip absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100',
                            slipped && 'opacity-100'
                        )}
                    >
                        Obviously.
                    </span>
                </Link>
            }
            ban="Obviously."
        />
    )
}
