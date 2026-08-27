import { Metadata } from 'next'
import { CreatureArt } from '../creature-art'
import { BEATS, SPRITE_CANVAS, SPRITE_PX, SPRITE_SCALE } from '../creatures'
import { Figure, FigurePart, FIGURE_HEIGHT, FIGURE_WIDTH, INJURIES, PART_LIST } from '../figure'
import { TraceCell } from './trace-cell'

/**
 * A contact sheet for /drowning — every creature and every state of the
 * figure, held still, each with a button that exports it as a tracing
 * reference.
 *
 * This is a workbench, not a page: nothing links here, it stays out of the
 * command bar and out of the sitemap, and it is deliberately noindex. It
 * exists so the sprites can be judged on their own, without waiting for the
 * right beat to come round.
 */

export const metadata: Metadata = {
    title: 'drowning / sprites',
    description: 'Contact sheet for the /drowning sprites.',
    robots: { index: false, follow: false }
}

/** A line of the spec, so the numbers on screen are the ones the code uses */
function Spec({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-baseline gap-2">
            <span className="mono-label text-muted-foreground/60">{label}</span>
            <span className="mono-label text-accent">{value}</span>
        </div>
    )
}

export default function Sprites() {
    return (
        // The (adjectives) layout locks html/body scroll and pins its children in a
        // fixed, overflow-hidden box — correct for the single-viewport adjective
        // pages, but this contact sheet is longer than the viewport. Its own fixed
        // container escapes that clipping (no transformed ancestor) and scrolls
        // internally, without touching the lock the other pages rely on.
        <div className="fixed inset-x-0 bottom-0 top-[var(--navbar-height)] overflow-y-auto overscroll-contain">
            <div className="container max-w-5xl py-16">
                <header className="mb-8 flex flex-col gap-2">
                    <p className="mono-label tracking-[0.25em] text-accent/60">// contact sheet</p>
                    <h1 className="text-display text-3xl md:text-4xl">drowning sprites</h1>
                    <p className="max-w-lg text-[0.9rem] text-muted-foreground">
                        Everything /drowning draws, held still. Dev only — nothing links here and it is noindex. Every
                        cell exports itself: <span className="text-accent">.svg</span> for redrawing the curves,{' '}
                        <span className="text-accent">.png</span> for tracing pixels.
                    </p>
                </header>

                {/* Both contracts, read straight off the constants so they cannot drift */}
                <div className="mb-12 grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-2 rounded-sm border border-dashed border-border/50 p-4">
                        <p className="mono-label tracking-[0.2em] text-accent">vector route</p>
                        <Spec label="canvas" value="1:1 with viewBox" />
                        <Spec label="creatures" value="48 × 48" />
                        <Spec label="figure" value={`${FIGURE_WIDTH} × ${FIGURE_HEIGHT}`} />
                        <Spec label="lands in" value="creatures.tsx → art" />
                    </div>
                    <div className="flex flex-col gap-2 rounded-sm border border-dashed border-border/50 p-4">
                        <p className="mono-label tracking-[0.2em] text-accent">pixel route</p>
                        <Spec label="canvas" value={`${SPRITE_CANVAS} × ${SPRITE_CANVAS}`} />
                        <Spec label="upscale" value={`${SPRITE_SCALE}× → ${SPRITE_PX}px`} />
                        <Spec label="strips" value="horizontal, one row" />
                        <Spec label="lands in" value="/public/drowning/" />
                    </div>
                </div>

                <section className="mb-14">
                    <h2 className="mono-label mb-4 tracking-[0.2em] text-muted-foreground">
                        creatures — {BEATS.length} beats
                    </h2>
                    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                        {BEATS.map((beat, i) => (
                            <TraceCell
                                key={beat.name}
                                slug={beat.name}
                                traceable={!beat.sprite}
                                title={`${i + 1}. ${beat.name}`}
                                note={
                                    beat.sprite
                                        ? `sprite · ${beat.frames ?? 1}f · ${beat.anim}`
                                        : `${beat.size}px · ${beat.approach} · ${beat.anim}`
                                }
                            >
                                {/* Moving parts take their duration from --strike-ms, which
                                    descent.tsx sets per beat. Nothing is striking here, so
                                    give them a steady one to loop against. */}
                                <div
                                    className="sprite-loop text-accent"
                                    style={{ '--strike-ms': '1400ms' } as React.CSSProperties}
                                >
                                    <CreatureArt beat={beat} />
                                </div>
                            </TraceCell>
                        ))}
                    </ul>
                </section>

                <section className="mb-14">
                    <h2 className="mono-label mb-1 tracking-[0.2em] text-muted-foreground">
                        figure parts — {PART_LIST.length} drawings
                    </h2>
                    <p className="mono-label mb-4 max-w-lg text-muted-foreground/60">
                        What the figure is actually built from. Everything else — tilt, splay, squash, the burnt outline
                        — is a transform applied in code, so these are the only pieces that need drawing. Each exports
                        on the full {FIGURE_WIDTH}×{FIGURE_HEIGHT} canvas, in position, so redrawn parts still line up.
                    </p>
                    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                        {PART_LIST.map((part) => (
                            <TraceCell
                                key={part.id}
                                slug={`part-${part.id}`}
                                title={part.id}
                                note={part.note}
                                traceable
                            >
                                <FigurePart id={part.id} className="text-foreground/85" />
                            </TraceCell>
                        ))}
                    </ul>
                </section>

                <section>
                    <h2 className="mono-label mb-4 tracking-[0.2em] text-muted-foreground">
                        figure — {INJURIES.length + 1} damage levels
                    </h2>
                    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                        <TraceCell slug="figure-00-intact" title="0. intact" note="before anything happens">
                            <Figure damage={0} className="text-foreground/85" />
                        </TraceCell>
                        {INJURIES.map((injury, i) => (
                            <TraceCell
                                key={injury.from}
                                slug={`figure-${String(i + 1).padStart(2, '0')}-${injury.from}`}
                                traceable={i + 1 < INJURIES.length}
                                title={`${i + 1}. after ${injury.from}`}
                                note={injury.note}
                            >
                                {/* Level 16 is the whale, and by then there is nothing left to draw */}
                                {i + 1 < INJURIES.length ? (
                                    <Figure damage={i + 1} className="text-foreground/85" />
                                ) : (
                                    <span className="mono-label text-muted-foreground/40">(swallowed)</span>
                                )}
                            </TraceCell>
                        ))}
                    </ul>
                </section>
            </div>
        </div>
    )
}
