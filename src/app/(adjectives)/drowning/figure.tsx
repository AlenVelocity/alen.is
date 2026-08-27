import { HAND_DRAWN_PARTS } from './figure.generated'

/**
 * The one being drowned. Not a self-portrait.
 *
 * Sixteen things happen to this figure and none of them wash off. `damage` is
 * how many hits have landed so far, and each one switches on a permanent
 * change: an arm gets crimped, then bitten off, then the torso stops being a
 * straight line, and so on down to the burnt outline it wears into the whale.
 *
 * The injury appears the moment a strike connects, not when the beat ends —
 * see CONTACT_AT in descent.tsx — so the change reads as the cause of the
 * flinch rather than an edit between beats.
 *
 * He is assembled from the named parts in PART_LIST rather than drawn
 * seventeen times. Most damage levels are not art at all: the tilted head,
 * splayed legs, flattened body, crooked posture and burnt outline are
 * transforms applied over whatever the parts draw.
 *
 * The parts themselves live in art/figure/<id>.svg and are compiled into
 * figure.generated.tsx by `pnpm drowning:art`. A part with no file does not
 * draw; the importer reports which are missing.
 */

/** Every part shares this canvas, so pieces drawn separately still line up */
const FIGURE_VIEWBOX = '0 0 52 76'
export const FIGURE_WIDTH = 52
export const FIGURE_HEIGHT = 76

/** What each hit leaves behind, in beat order. Indexed 0–15; the sprite page lists them. */
export const INJURIES = [
    { from: 'crab', note: 'left arm crimped' },
    { from: 'octopus', note: 'torso no longer straight' },
    { from: 'shark', note: 'right arm mostly gone' },
    { from: 'jellyfish', note: 'welts' },
    { from: 'urchin', note: 'spines in the leg' },
    { from: 'marlin', note: 'hole clean through' },
    { from: 'sawfish', note: 'left leg serrated' },
    { from: 'charybdis', note: 'eyes have given up' },
    { from: 'bass', note: 'head knocked askew' },
    { from: 'sturgeon', note: 'torso in two pieces' },
    { from: 'charp', note: 'whole figure crooked' },
    { from: 'hippocampus', note: 'legs splayed' },
    { from: 'knucklehead', note: 'flattened' },
    { from: 'scuffer', note: 'dripping' },
    { from: 'slavug', note: 'outline burnt through' },
    { from: 'whale', note: 'gone' }
]

/** Where the limbs meet the body — hand-drawn parts must hit these too */
const SHOULDER = '26,26'
const HIP = '26,47'

/** How far each leg swings out from the hip once the hippocampus is done */
const SPLAY_DEG = 16

/** The parts as a list, for the contact sheet and for anyone redrawing them */
export const PART_LIST: { id: string; note: string }[] = [
    { id: 'head', note: 'centre 26,13 · r8' },
    { id: 'head-dead', note: 'overlay · from charybdis' },
    { id: 'torso', note: `${SHOULDER} down to ${HIP}` },
    { id: 'torso-bent', note: 'from octopus' },
    { id: 'torso-split', note: 'two pieces · from sturgeon' },
    { id: 'hole', note: 'overlay at 26,33 · from marlin' },
    { id: 'arm-l', note: `joins at ${SHOULDER}` },
    { id: 'arm-l-crimped', note: 'from crab' },
    { id: 'arm-r', note: `joins at ${SHOULDER}` },
    { id: 'arm-r-stub', note: 'bitten · from shark' },
    { id: 'leg-l', note: `joins at ${HIP}` },
    { id: 'leg-l-serrated', note: 'from sawfish' },
    { id: 'leg-r', note: `joins at ${HIP}` },
    { id: 'welts', note: 'overlay · from jellyfish' },
    { id: 'spines', note: 'overlay · from urchin' },
    { id: 'drips', note: 'overlay · from scuffer' }
]

/** One part on its own, on the shared canvas so it exports in position */
export function FigurePart({ id, className }: { id: string; className?: string }) {
    const part = HAND_DRAWN_PARTS[id]
    return (
        <svg width={FIGURE_WIDTH} height={FIGURE_HEIGHT} viewBox={FIGURE_VIEWBOX} className={className} aria-label={id}>
            {part}
        </svg>
    )
}

interface FigureProps {
    /** Hits landed so far, 0–16 */
    damage: number
    className?: string
}

export function Figure({ damage, className }: FigureProps) {
    /** Has the injury from hit number n landed? */
    const has = (n: number) => damage >= n
    const part = HAND_DRAWN_PARTS

    // Flattened by the knucklehead, then knocked crooked by the Charp
    const squash = has(13) ? 'scale(1.12, 0.84)' : ''
    const tilt = has(11) ? 'rotate(-7)' : ''
    const posture = squash || tilt ? `translate(26 44) ${squash} ${tilt} translate(-26 -44)` : undefined

    // Splay is a rotation about the hip rather than different endpoints, so it
    // composes with a serrated leg — and with a hand-drawn one — instead of
    // needing a separate drawing for every combination.
    const splay = has(12)

    return (
        <svg
            width={FIGURE_WIDTH}
            height={FIGURE_HEIGHT}
            viewBox={FIGURE_VIEWBOX}
            className={className}
            aria-hidden="true"
        >
            {/* The burnt outline is applied here rather than baked into each part,
                so it reaches hand-drawn replacements too — the importer strips the
                stroke-dasharray editors write, leaving this free to cascade. */}
            <g transform={posture} strokeDasharray={has(15) ? '5 2.5' : undefined}>
                {/* Head — tilted after the bass, X-eyed after the whirlpool */}
                <g transform={has(9) ? 'rotate(-16 26 13)' : undefined}>
                    {part.head}
                    {has(8) && part['head-dead']}
                </g>

                {/* Torso — straight, then bent, then in two pieces */}
                {has(10) ? part['torso-split'] : has(2) ? part['torso-bent'] : part.torso}
                {has(6) && part.hole}

                {has(1) ? part['arm-l-crimped'] : part['arm-l']}
                {has(3) ? part['arm-r-stub'] : part['arm-r']}

                {/* Each leg swings away from the midline, so the signs are opposite:
                    SVG rotates clockwise on positive values, which pushes the left
                    leg out and the right leg in. */}
                <g transform={splay ? `rotate(${SPLAY_DEG} ${HIP.replace(',', ' ')})` : undefined}>
                    {has(7) ? part['leg-l-serrated'] : part['leg-l']}
                </g>
                <g transform={splay ? `rotate(${-SPLAY_DEG} ${HIP.replace(',', ' ')})` : undefined}>{part['leg-r']}</g>

                {has(4) && part.welts}
                {has(5) && part.spines}
                {has(14) && part.drips}
            </g>
        </svg>
    )
}
