'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

import { randomGlyph } from '@/lib/glyphs'
import { Beam, Saucer } from './saucer'

const TARGET = 'alien'
const SOURCE = 'person'

interface GlitchWordProps {
    className?: string
}

/**
 * "person" on the home page. Hover it and the saucer drops in, the beam lands
 * on the word, and it scrambles into "alien". Leave and it scrambles back.
 */
export function GlitchPersonWord({ className }: GlitchWordProps) {
    const [displayed, setDisplayed] = useState(SOURCE)
    const [isAlien, setIsAlien] = useState(false)
    const [beaming, setBeaming] = useState(false)
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
                    return randomGlyph()
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
        setBeaming(true)
        scramble(TARGET, SOURCE, () => setIsAlien(true))
    }, [isAlien, scramble])

    const handleMouseLeave = useCallback(() => {
        if (!isAlien) return
        setBeaming(false)
        scramble(SOURCE, TARGET, () => setIsAlien(false))
    }, [isAlien, scramble])

    useEffect(() => {
        return () => {
            if (rafRef.current) clearTimeout(rafRef.current)
        }
    }, [])

    return (
        <span className="relative inline-block">
            {/* The saucer, parked above the word while it is being beamed */}
            <span
                className={`absolute left-1/2 -translate-x-1/2 -top-8 w-8 h-8 text-accent pointer-events-none transition-[opacity,transform] duration-200 ${
                    beaming ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
                }`}
                aria-hidden="true"
            >
                <Saucer className="w-8" />
                <Beam
                    className={`absolute left-1/2 -translate-x-1/2 top-[13px] w-10 h-7 origin-top transition-transform duration-200 delay-100 ${
                        beaming ? 'scale-y-100' : 'scale-y-0'
                    }`}
                />
            </span>
            <span
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className={`
                    inline-block min-w-[6ch] font-mono-ui cursor-crosshair select-none
                    transition-colors duration-100
                    ${isAlien ? 'text-accent [text-shadow:var(--glow-accent)]' : 'hover:text-accent/70'}
                    ${className ?? ''}
                `}
                title="hover me"
                aria-label="person"
            >
                {displayed}
            </span>
        </span>
    )
}
