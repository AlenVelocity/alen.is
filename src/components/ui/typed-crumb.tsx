'use client'

import { useEffect, useRef, useState } from 'react'
import { isMinimalMotion } from '@/lib/motion-pref'

const CHAR_MS = 45

/**
 * The current segment of the nav, with the prompt's cursor after it. On a
 * navigation the new segment types itself in; the first paint shows it whole
 * so nothing flashes on load. The cursor is the one blinking thing on the
 * site: the prompt is live.
 */
export function TypedCrumb({ text, className }: { text: string; className?: string }) {
    const [shown, setShown] = useState(text)
    const previous = useRef(text)

    useEffect(() => {
        // Type on a change of segment, or on mounting after a warp (the body keeps
        // that class for the session). A plain first load shows the word whole.
        const changed = previous.current !== text
        previous.current = text
        const arrived = changed || document.body.classList.contains('ufo-navigated')
        if (!arrived || isMinimalMotion() || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setShown(text)
            return
        }
        let i = 0
        setShown('')
        const id = setInterval(() => {
            i += 1
            setShown(text.slice(0, i))
            if (i >= text.length) clearInterval(id)
        }, CHAR_MS)
        return () => clearInterval(id)
    }, [text])

    return (
        <span className={`relative inline-block whitespace-nowrap pr-[0.6ch] ${className ?? ''}`}>
            {/* Holds the full width so the nav does not resize while typing */}
            <span className="invisible">{text}</span>
            <span className="absolute left-0 top-0 text-accent">
                {shown}
                <span className="animate-blink" aria-hidden="true">
                    ▮
                </span>
            </span>
        </span>
    )
}
