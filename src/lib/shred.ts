/**
 * Splitting the live page into animatable pieces.
 *
 * Shared by the two "the page goes somewhere" effects: the UFO tractor beam
 * pulls the pieces up (see ufo-abduction.tsx) and /drowning lets them sink.
 * Both aim each piece at a target point via inline CSS vars, so the only
 * thing they need in common is *what counts as a piece*.
 */

/**
 * Descend through single-child wrappers (PageTransition, containers), take the
 * content blocks, then explode small blocks into their children so the page
 * comes apart like confetti rather than as three big slabs.
 */
export function collectPieces(root: HTMLElement): HTMLElement[] {
    let node: HTMLElement = root
    while (node.children.length === 1 && node.firstElementChild instanceof HTMLElement) {
        node = node.firstElementChild
    }
    const blocks = [...node.children].filter((el): el is HTMLElement => el instanceof HTMLElement)
    const explode = (els: HTMLElement[]) =>
        els.flatMap((el) => {
            const kids = [...el.children].filter((k): k is HTMLElement => k instanceof HTMLElement)
            return kids.length >= 2 && kids.length <= 8 ? kids : [el]
        })
    // Two explosion passes: container → sections → headings/paragraphs/rows
    const exploded = explode(explode(blocks))
    // Cap the piece count so huge pages don't animate 100 elements at once
    const pieces = exploded.length <= 30 ? exploded : explode(blocks).length <= 30 ? explode(blocks) : blocks
    return pieces.filter((el) => {
        const rect = el.getBoundingClientRect()
        return rect.width > 0 && rect.height > 0
    })
}
