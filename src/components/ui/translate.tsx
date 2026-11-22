import type { CSSProperties } from 'react'
import { AlienGlyph, glyphIndex } from './alien-script'

/** A word takes this long to come through, plus a little per letter */
const WORD_MS = 360
const LETTER_MS = 16
/** Each word starts this long after the one before it */
const WORD_GAP_MS = 120
const GLYPH_MS = 260

interface TranslateProps {
    text: string
    /** Hold the whole thing back, in ms (for the page to land first) */
    delay?: number
    className?: string
}

/**
 * A heading that arrives in Alen's script and turns into English, one word at
 * a time, left to right. The English is the real text and is in the HTML from
 * the start, one text node per word, so search engines and screen readers get
 * a normal heading. The glyphs are a layer on top that dissolves.
 *
 * All of it is CSS (`.xl-*` in globals.css), so it starts at first paint and
 * needs no JavaScript. It runs once. Under reduced motion the English is
 * simply there.
 */
export function Translate({ text, delay = 0, className }: TranslateProps) {
    const words = text.split(' ')
    let at = delay
    let position = 0
    let previous = -1

    return (
        <span className={className}>
            {words.map((word, w) => {
                const duration = WORD_MS + word.length * LETTER_MS
                const start = at
                at += WORD_GAP_MS + word.length * 6
                // Fewer glyphs than letters: his words are shorter than ours
                const count = Math.max(1, Math.round(word.length * 0.7))
                const glyphs = Array.from({ length: count }, (_, g) => {
                    const char = word[Math.floor((g * word.length) / count)] ?? 'a'
                    position += 1
                    // Never the same glyph twice running: two alike read as a stutter
                    let index = glyphIndex(char, position)
                    if (index === previous) index = (index + 5) % 16
                    previous = index
                    return {
                        index,
                        // A glyph goes as the English reaches it
                        at: start + ((g + 0.5) / count) * (duration - GLYPH_MS) * 0.8
                    }
                })

                return (
                    <span key={w}>
                        <span className="xl-word">
                            <span
                                className="xl-text"
                                style={{ '--xl-at': `${start}ms`, '--xl-dur': `${duration}ms` } as CSSProperties}
                            >
                                {word}
                            </span>
                            <span className="xl-glyphs" aria-hidden="true">
                                {glyphs.map((glyph, g) => (
                                    <AlienGlyph
                                        key={g}
                                        index={glyph.index}
                                        style={{ '--xl-at': `${Math.round(glyph.at)}ms` } as CSSProperties}
                                    />
                                ))}
                            </span>
                        </span>
                        {w < words.length - 1 && ' '}
                    </span>
                )
            })}
        </span>
    )
}
