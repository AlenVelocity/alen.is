'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { posthog } from '@/components/posthog-provider'
import { ufoWarp } from '@/components/ui/ufo-abduction'

/**
 * Type "drown" anywhere on the site and it takes you at your word.
 *
 * Same buffer trick as the Konami listener in ufo-abduction.tsx, with two
 * extra guards a word needs that an arrow sequence doesn't: it stays out of
 * text fields, and it stops listening once you're already down there.
 */

const WORD = 'drown'

export function DrownTrigger() {
    const pathname = usePathname()
    const progressRef = useRef(0)

    useEffect(() => {
        if (pathname.startsWith('/drowning')) return

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.metaKey || e.ctrlKey || e.altKey) return
            const target = e.target as HTMLElement | null
            // Never fire while the visitor is actually typing something
            if (target?.isContentEditable || /^(input|textarea|select)$/i.test(target?.tagName ?? '')) return

            const key = e.key.toLowerCase()
            progressRef.current = key === WORD[progressRef.current] ? progressRef.current + 1 : key === WORD[0] ? 1 : 0
            if (progressRef.current === WORD.length) {
                progressRef.current = 0
                posthog.capture('drown_triggered', { from: pathname })
                ufoWarp('/drowning')
            }
        }

        window.addEventListener('keydown', onKeyDown)
        return () => window.removeEventListener('keydown', onKeyDown)
    }, [pathname])

    return null
}
