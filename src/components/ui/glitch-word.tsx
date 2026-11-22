'use client'

import { useRef, useState } from 'react'
import { AlienGlyph } from './alien-script'

/** The four glyphs that show for a moment while one word becomes the other */
const BETWEEN = [1, 9, 4, 13]

/**
 * "person" on the home page. Point at it and it turns into "alien", with a
 * flash of his script in between, and the saucer above the hero brightens
 * (that part is CSS: `.hero:has(.person-word[data-alien='true'])`). Leave and
 * it goes back.
 *
 * With a mouse it follows the pointer. On a touch screen or from the keyboard
 * there is no hover, so pressing it toggles.
 */
export function GlitchPersonWord({ className }: { className?: string }) {
    const [isAlien, setIsAlien] = useState(false)
    // Counts changes, so the flash of glyphs is a new element (and a new animation) each time
    const [changes, setChanges] = useState(0)
    const mouse = useRef(false)

    const set = (next: boolean) => {
        if (next === isAlien) return
        setIsAlien(next)
        setChanges((n) => n + 1)
    }

    return (
        <button
            type="button"
            className={`person-word ${className ?? ''}`}
            data-alien={isAlien}
            aria-pressed={isAlien}
            aria-label={isAlien ? 'alien' : 'person'}
            onPointerEnter={(event) => {
                mouse.current = event.pointerType === 'mouse'
                if (mouse.current) set(true)
            }}
            onPointerLeave={(event) => {
                if (event.pointerType === 'mouse') set(false)
            }}
            onClick={(event) => {
                // A mouse click lands while the pointer is already over the word, where
                // hover has done the job. Touch and the keyboard (detail 0) toggle.
                if (mouse.current && event.detail !== 0) return
                set(!isAlien)
            }}
        >
            <span className="person-word-human">person</span>
            <span className="person-word-alien" aria-hidden="true">
                alien
            </span>
            {changes > 0 && (
                <span key={changes} className="person-word-glyphs" data-flash="" aria-hidden="true">
                    {BETWEEN.map((index) => (
                        <AlienGlyph key={index} index={index} />
                    ))}
                </span>
            )}
        </button>
    )
}
