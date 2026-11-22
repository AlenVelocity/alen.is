/**
 * Alen's script. Sixteen glyphs built from the same few parts (a ring, half a
 * ring, a nucleus, a stem), so they read as one hand. They are drawn, not
 * typed: no font has them, which is the point. A 20 by 20 box, stroked in
 * currentColor.
 */
const RING = 'M10 3a7 7 0 1 0 .01 0'
const DOT = (x: number, y: number) => `M${x} ${y}h.01`

const GLYPHS: string[] = [
    // ring
    RING,
    // ring with a nucleus
    `${RING}${DOT(10, 10)}`,
    // ring with a stem coming down from the top
    `${RING}M10 3v6.5`,
    // dome over a dot
    `M3 12a7 7 0 0 1 14 0${DOT(10, 16)}`,
    // cup on a stem
    'M3 7a7 7 0 0 0 14 0M10 14v4',
    // ring with a bar
    `${RING}M5.5 10h9`,
    // open to the right, a dot in the mouth
    `M13 3.7a7 7 0 1 0 0 12.6${DOT(15.5, 10)}`,
    // open to the left, a dot in the mouth
    `M7 3.7a7 7 0 1 1 0 12.6${DOT(4.5, 10)}`,
    // ring inside a ring
    `${RING}M10 7a3 3 0 1 0 .01 0`,
    // three quarters of a ring, a dot where the rest would be
    `M17 10a7 7 0 1 1-7-7${DOT(15.2, 4.8)}`,
    // small ring with a tail
    'M10 3a4.5 4.5 0 1 0 .01 0M10 12v6',
    // stem into a cup
    'M10 18v-7M4 5a6 6 0 0 0 12 0',
    // three cells
    'M10 3.5a2 2 0 1 0 .01 0M5 12.5a2 2 0 1 0 .01 0M15 12.5a2 2 0 1 0 .01 0',
    // dome inside a dome
    'M3 14a7 7 0 0 1 14 0M6.5 14a3.5 3.5 0 0 1 7 0',
    // ring, crossed
    `${RING}M6 6l8 8`,
    // dome with a leg and a nucleus
    `M3 11a7 7 0 0 1 14 0M3 11v6${DOT(10, 11)}`
]

/**
 * Which glyph stands in for a character. Fixed by the character and where it
 * sits, so the server and the browser draw the same thing and a word always
 * looks the same.
 */
export function glyphIndex(char: string, position: number): number {
    return (char.charCodeAt(0) * 7 + position * 3) % GLYPHS.length
}

export function AlienGlyph({
    index,
    className,
    style
}: {
    index: number
    className?: string
    style?: React.CSSProperties
}) {
    return (
        <svg
            viewBox="0 0 20 20"
            className={className}
            style={style}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.1"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d={GLYPHS[index % GLYPHS.length]} />
        </svg>
    )
}
