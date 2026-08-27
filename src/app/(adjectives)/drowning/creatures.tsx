/**
 * The bridge of Darren Korb's "Drown You to Death" rattles off sixteen ways
 * the sea can ruin your day, one after another, faster than you can track.
 * This is that list as a gauntlet: sixteen beats, sixteen creatures, each one
 * taking its turn.
 *
 * The captions are ours, not the song's — deadpan asides in the site's voice.
 *
 * This file is the choreography only. The drawings live in art/<name>.svg and
 * are compiled into art.generated.tsx by `pnpm drowning:art`; CreatureArt puts
 * the two together. A creature with no file simply does not draw, so the
 * importer's warnings are the thing to watch.
 */

/** Which edge a creature enters from — keeps consecutive beats from stacking */
export type Approach = 'left' | 'right' | 'above' | 'below'

/** How the figure takes it: knocked back, wrapped up, rattled, flattened — or swallowed */
export type Reaction = 'knock' | 'squeeze' | 'shake' | 'crumple' | 'eaten'

export interface Beat {
    /** Creature name, shown as the mono label under the scene */
    name: string
    /** The aside that flashes with it */
    caption: string
    /** Depth reading once this one lands, in metres */
    depth: number
    approach: Approach
    /** Rendered size in px — a whale should not arrive crab-sized */
    size: number
    /** Its own keyframe — a shark passes through, an octopus wraps, a whale grows (globals.css) */
    anim: string
    /** What being hit by this one does to the figure */
    react: Reaction
    /** Fraction of the beat the strike occupies; the remainder is a pause. Default 1. */
    speed?: number
    /** Mirror the art — for creatures drawn facing left that swim in from the left */
    flip?: boolean
    /**
     * Pixel-art override, as a path under /public. Takes precedence over the
     * hand-drawn vector in art/. See SPRITE_CANVAS.
     */
    sprite?: string
    /** Frames in the strip, if the sprite is an animated sheet. Omit for a still. */
    frames?: number
    /** Playback rate for a strip. Defaults to SPRITE_FPS. */
    fps?: number
}

/**
 * Hand-drawn sprite contract (Aseprite → /public/drowning/).
 *
 * Every hand-drawn creature shares one canvas and one integer upscale, so the
 * pixel grid stays identical across the whole gauntlet — a crab and a whale
 * are the same file size, and the difference in scale is drawn into the art
 * rather than applied by CSS. Non-integer scaling is what makes pixel art look
 * mushy, so these two numbers should stay whole and stay in sync with the
 * Aseprite canvas.
 *
 * Animated sheets are horizontal strips: SPRITE_CANVAS wide per frame, one row.
 */
export const SPRITE_CANVAS = 64
export const SPRITE_SCALE = 3
/** Rendered size of any hand-drawn sprite, in px */
export const SPRITE_PX = SPRITE_CANVAS * SPRITE_SCALE
/** Default strip playback rate */
export const SPRITE_FPS = 8

export const BEATS: Beat[] = [
    {
        name: 'crab',
        caption: 'pinched by a',
        depth: 8,
        approach: 'below',
        size: 92,
        anim: 'crabScuttle',
        react: 'knock'
    },
    {
        name: 'octopus',
        caption: 'strangled by an',
        depth: 24,
        approach: 'left',
        size: 100,
        anim: 'octopusWrap',
        react: 'squeeze'
    },
    {
        name: 'shark',
        caption: 'bitten by a',
        depth: 51,
        approach: 'right',
        size: 120,
        anim: 'sharkPass',
        react: 'knock',
        speed: 0.6
    },
    {
        name: 'jellyfish',
        caption: 'stung by a',
        depth: 88,
        approach: 'above',
        size: 96,
        anim: 'jellyfishDrift',
        react: 'shake'
    },
    {
        name: 'urchin',
        caption: 'poked by an',
        depth: 137,
        approach: 'below',
        size: 88,
        anim: 'urchinSettle',
        react: 'crumple',
        speed: 0.9
    },
    {
        name: 'marlin',
        caption: 'stabbed by a',
        depth: 199,
        approach: 'left',
        size: 118,
        anim: 'marlinLance',
        react: 'knock',
        speed: 0.55,
        flip: true
    },
    {
        name: 'sawfish',
        caption: 'sawed by a',
        depth: 276,
        approach: 'right',
        size: 118,
        anim: 'sawfishSaw',
        react: 'shake'
    },
    {
        name: 'charybdis',
        caption: 'crushed by',
        depth: 370,
        approach: 'below',
        size: 130,
        anim: 'charybdisSpin',
        react: 'squeeze'
    },
    {
        name: 'bass',
        caption: 'slapped by a',
        depth: 483,
        approach: 'left',
        size: 100,
        anim: 'bassSlap',
        react: 'knock',
        speed: 0.95
    },
    {
        name: 'sturgeon',
        caption: 'sliced by a',
        depth: 617,
        approach: 'right',
        size: 116,
        anim: 'sturgeonSlice',
        react: 'knock',
        speed: 0.6
    },
    {
        name: 'charp',
        caption: 'clobbered by a',
        depth: 774,
        approach: 'above',
        size: 96,
        anim: 'charpDart',
        react: 'shake'
    },
    {
        name: 'hippocampus',
        caption: 'stomped by a',
        depth: 956,
        approach: 'left',
        size: 100,
        anim: 'hippocampusStomp',
        react: 'crumple'
    },
    {
        name: 'knucklehead',
        caption: 'smacked by a',
        depth: 1165,
        approach: 'below',
        size: 104,
        anim: 'knuckleheadSmash',
        react: 'crumple'
    },
    {
        name: 'scuffer',
        caption: 'poisoned by a',
        depth: 1403,
        approach: 'right',
        size: 96,
        anim: 'scufferThrob',
        react: 'shake'
    },
    {
        name: 'slavug',
        caption: 'burned by a',
        depth: 1672,
        approach: 'left',
        size: 100,
        anim: 'slavugBurn',
        react: 'shake',
        flip: true
    },
    {
        name: 'whale',
        caption: 'swallowed by a',
        depth: 1974,
        // Swims in from the right so it travels the way it faces, mouth first
        approach: 'right',
        size: 210,
        anim: 'whaleSwallow',
        react: 'eaten',
        // Two and a half beats: opening, engulfing and leaving all have to fit
        speed: 2.4
    }
]
