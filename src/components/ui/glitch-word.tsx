'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

const ALIEN_CHARS = '▓░▒█▄▀■□▪▫◆◇○●◉⌖⌗⌘⌀⊗⊕⋯⋮⊞⊟⊠⊡'
const TARGET = 'alien'
const SOURCE = 'person'

interface GlitchWordProps {
    className?: string
}

export function GlitchPersonWord({ className }: GlitchWordProps) {
    const [displayed, setDisplayed] = useState(SOURCE)
    const [isAlien, setIsAlien] = useState(false)
    const rafRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const iterRef = useRef(0)

    const scramble = useCallback((toWord: string, fromWord: string, onDone?: () => void) => {
        if (rafRef.current) clearTimeout(rafRef.current)
        iterRef.current = 0
        const maxLen = Math.max(toWord.length, fromWord.length)
        const totalFrames = maxLen * 5 + 6

        const step = () => {
            iterRef.current += 1
            const progress = iterRef.current / totalFrames

            const result = toWord
                .padEnd(maxLen)
                .split('')
                .map((char, i) => {
                    // Each character resolves left-to-right progressively
                    const charResolvePoint = i / maxLen
                    if (progress > charResolvePoint + 0.15) {
                        return toWord[i] ?? ''
                    }
                    // Still scrambling this char
                    return ALIEN_CHARS[Math.floor(Math.random() * ALIEN_CHARS.length)]
                })
                .join('')

            setDisplayed(result.trimEnd() || toWord)

            if (iterRef.current < totalFrames) {
                rafRef.current = setTimeout(step, 35)
            } else {
                setDisplayed(toWord)
                onDone?.()
            }
        }

        step()
    }, [])

    const handleMouseEnter = useCallback(() => {
        if (isAlien) return
        scramble(TARGET, SOURCE, () => setIsAlien(true))
    }, [isAlien, scramble])

    const handleMouseLeave = useCallback(() => {
        if (!isAlien) return
        scramble(SOURCE, TARGET, () => setIsAlien(false))
    }, [isAlien, scramble])

    useEffect(() => {
        return () => { if (rafRef.current) clearTimeout(rafRef.current) }
    }, [])

    return (
        <span
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`
                inline-block font-mono-ui cursor-crosshair select-none
                transition-colors duration-100
                ${isAlien
                    ? 'text-accent [text-shadow:var(--glow-accent)]'
                    : 'hover:text-accent/70'
                }
                ${className ?? ''}
            `}
            title="hover me"
            aria-label="person"
        >
            {displayed}
        </span>
    )
}
