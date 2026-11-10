/**
 * Splitting the live page into animatable pieces.
 *
 * Shared by the "the page goes somewhere" effects: the UFO tractor beam pulls
 * the pieces up and Ban's redaction strikes them out (both in
 * ufo-abduction.tsx), and /drowning lets them sink. Each aims at the pieces in
 * its own way, so the only thing they need in common is *what counts as a
 * piece*.
 */

/**
 * An element's children as the layout sees them. <Persona> wrappers
 * (`[data-as]`, see components/persona.tsx) are `display: contents`: they have
 * no box to animate or measure, so the visible person's wrapper is replaced by
 * what is inside it and the hidden person's is dropped.
 */
function boxChildren(el: Element): HTMLElement[] {
    const out: HTMLElement[] = []
    for (const kid of el.children) {
        if (!(kid instanceof HTMLElement)) continue
        if (kid.dataset.as === undefined) out.push(kid)
        else if (getComputedStyle(kid).display !== 'none') out.push(...boxChildren(kid))
    }
    return out
}

/**
 * Descend through single-child wrappers (PageTransition, containers), take the
 * content blocks, then explode small blocks into their children so the page
 * comes apart like confetti rather than as three big slabs.
 */
export function collectPieces(root: HTMLElement): HTMLElement[] {
    let node: HTMLElement = root
    for (let only = boxChildren(node); only.length === 1; only = boxChildren(node)) {
        node = only[0]
    }
    const blocks = boxChildren(node)
    const explode = (els: HTMLElement[]) =>
        els.flatMap((el) => {
            const kids = boxChildren(el)
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
