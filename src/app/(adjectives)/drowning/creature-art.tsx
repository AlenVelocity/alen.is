import { HAND_DRAWN } from './art.generated'
import { SPRITE_FPS, SPRITE_PX, type Beat } from './creatures'

/**
 * Draws one creature.
 *
 * Two forms, in preference order:
 *
 *   1. A pixel sprite named by `sprite`, optionally a `frames` strip.
 *   2. The hand-drawn vector from art/<name>.svg, compiled into
 *      art.generated.tsx by `pnpm drowning:art`.
 *
 * Neither knows anything about the gauntlet: the strike keyframes, approach
 * vectors and beat timing all sit on the wrapper in descent.tsx and never look
 * inside. That is what lets a drawing be swapped without touching motion.
 *
 * A beat with no drawing at all renders nothing rather than substituting
 * something — `pnpm drowning:art` lists which creatures are missing, and a
 * silent gap in the run is easier to trace than a stand-in.
 */
export function CreatureArt({ beat }: { beat: Beat }) {
    const mirror = beat.flip ? { transform: 'scaleX(-1)' } : undefined

    // Pixel strip: one row of SPRITE_CANVAS-wide frames, stepped through
    if (beat.sprite && beat.frames && beat.frames > 1) {
        const seconds = beat.frames / (beat.fps ?? SPRITE_FPS)
        return (
            <div
                role="img"
                aria-label={beat.name}
                style={
                    {
                        ...mirror,
                        width: SPRITE_PX,
                        height: SPRITE_PX,
                        imageRendering: 'pixelated',
                        backgroundImage: `url(${beat.sprite})`,
                        backgroundSize: `${SPRITE_PX * beat.frames}px ${SPRITE_PX}px`,
                        '--sprite-travel': `-${SPRITE_PX * beat.frames}px`,
                        animation: `spriteStrip ${seconds.toFixed(3)}s steps(${beat.frames}) infinite`
                    } as React.CSSProperties
                }
            />
        )
    }

    // Pixel still
    if (beat.sprite) {
        return (
            // Plain <img>, not next/image: re-encoding pixel art defeats the point,
            // and these are fixed-size local files with nothing to optimise.
            // eslint-disable-next-line @next/next/no-img-element
            <img
                src={beat.sprite}
                alt={beat.name}
                width={SPRITE_PX}
                height={SPRITE_PX}
                style={{ ...mirror, imageRendering: 'pixelated' }}
            />
        )
    }

    const drawn = HAND_DRAWN[beat.name]
    if (!drawn) return null

    return (
        <svg width={beat.size} height={beat.size} viewBox={drawn.viewBox} aria-hidden="true" style={mirror}>
            {drawn.art}
        </svg>
    )
}
