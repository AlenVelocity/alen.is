'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { isMinimalMotion } from '@/lib/motion-pref'

const ALIEN_CHARS = '▓░▒█▄▀■□▪▫◆◇○●◉⌖⌗⌘⌀⊗⊕⋯⋮⊞⊟⊠⊡'
const STEP_MS = 32

interface DecodeTextProps {
    text: string
    /** Scramble once on mount (headings) */
    onMount?: boolean
    /** Scramble whenever this flips to true (row hover, driven by the parent) */
    active?: boolean
    className?: string
}

/**
 * Text that resolves out of alien glyphs, left to right, the way the "person"
 * word on the home page turns alien on hover. The real text is rendered
 * underneath for layout and screen readers, so the glyphs never shift the
 * page. Skipped under prefers-reduced-motion and the site's minimal-motion
 * setting.
 */
export function DecodeText({ text, onMount = false, active = false, className }: DecodeTextProps) {
    const [displayed, setDisplayed] = useState(text)
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const scramble = useCallback(() => {
        if (timerRef.current) clearTimeout(timerRef.current)
        if (isMinimalMotion() || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setDisplayed(text)
            return
        }
        const chars = text.split('')
        const totalFrames = Math.min(chars.length, 12) * 2 + 8
        let frame = 0

        const step = () => {
            frame += 1
            const progress = frame / totalFrames
            setDisplayed(
                chars
                    .map((char, i) => {
                        if (char === ' ') return ' '
                        if (progress > i / chars.length + 0.2) return char
                        return ALIEN_CHARS[Math.floor(Math.random() * ALIEN_CHARS.length)]
                    })
                    .join('')
            )
            if (frame < totalFrames) timerRef.current = setTimeout(step, STEP_MS)
            else setDisplayed(text)
        }
        step()
    }, [text])

    useEffect(() => {
        if (onMount) scramble()
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current)
        }
    }, [onMount, scramble])

    useEffect(() => {
        if (active) scramble()
    }, [active, scramble])

    const decoding = displayed !== text

    return (
        <span className={`relative inline-block ${className ?? ''}`}>
            <span className={decoding ? 'invisible' : undefined}>{text}</span>
            {decoding && (
                <span className="absolute inset-0 whitespace-nowrap text-accent/80" aria-hidden="true">
                    {displayed}
                </span>
            )}
        </span>
    )
}
