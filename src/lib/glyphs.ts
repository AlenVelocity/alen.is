/**
 * Stand-in characters for DecodeText, which scrambles real text and so needs
 * something a font can draw. Round marks only: the blocks and brackets that
 * were here read as a terminal. His actual script is drawn, not typed, and
 * lives in components/ui/alien-script.tsx.
 */
export const ALIEN_GLYPHS = '○◌◍◎●◐◑◒◓◔◕⊙⊚⊛∘◦'

export function randomGlyph(): string {
    return ALIEN_GLYPHS[Math.floor(Math.random() * ALIEN_GLYPHS.length)]
}
