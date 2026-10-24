/** The alien alphabet. Shared by the glyph rain, DecodeText and the "person" word on the home page. */
export const ALIEN_GLYPHS = '▓░▒█▄▀■□▪▫◆◇○●◉⌖⌗⊗⊕⊞⊟⊠⊡⋯⋮∞∅∆∇⌀⌁⌂⌃⌄⌅⌆⌇⌈⌉⌊⌋⌌⌍⌎⌏⌐⌑⌒⌓⌔⌕⌘⌙⌜⌝⌞⌟'

export function randomGlyph(): string {
    return ALIEN_GLYPHS[Math.floor(Math.random() * ALIEN_GLYPHS.length)]
}
