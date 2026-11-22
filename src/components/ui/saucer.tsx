/** The site's saucer, small enough to sit in a line of text. Inherits currentColor. */
export function Saucer({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 40 26" className={className} fill="none" aria-hidden="true">
            {/* Cockpit dome */}
            <ellipse cx="20" cy="9.5" rx="7" ry="5.5" fill="currentColor" opacity="0.4" />
            {/* Hull */}
            <ellipse cx="20" cy="15" rx="17" ry="4.8" fill="currentColor" />
            {/* Running lights */}
            <circle cx="9" cy="15.5" r="1.5" fill="currentColor" opacity="0.55" />
            <circle cx="20" cy="16.2" r="1.5" fill="currentColor" opacity="0.55" />
            <circle cx="31" cy="15.5" r="1.5" fill="currentColor" opacity="0.55" />
        </svg>
    )
}

/** The ship's own size, in px. The page change draws it at this size; the home page scales it up. */
export const SHIP_W = 130
export const SHIP_H = 64

/**
 * The ship itself, with its pilot in the dome. There is one drawing of it and
 * it is used wherever the ship is more than an icon: parked in the home page's
 * hero, and flying in to change the page (ufo-abduction.tsx). They have to be
 * the same drawing, because on the home page they are the same ship: the one
 * in the hero is the one that goes and does the abducting.
 *
 * Flat and matte: a dark hull with an outline, a tinted dome, five lights and
 * a soft glow around the lot. The outlines do not scale, so they are the same
 * weight at 130px and at twice that. `flicker` sets the lights going, which is
 * for when it is working.
 */
export function SaucerShip({ className, flicker = false }: { className?: string; flicker?: boolean }) {
    return (
        <svg
            viewBox={`0 0 ${SHIP_W} ${SHIP_H}`}
            className={`block overflow-visible drop-shadow-[0_0_16px_hsl(var(--accent)/0.42)] ${className ?? ''}`}
            fill="none"
            aria-hidden="true"
        >
            {/* Cockpit dome */}
            <ellipse
                cx="65"
                cy="24"
                rx="24"
                ry="17"
                fill="hsl(var(--accent) / 0.22)"
                stroke="hsl(var(--accent) / 0.75)"
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
            />
            {/* The pilot */}
            <circle cx="65" cy="22" r="6" fill="hsl(var(--accent) / 0.55)" />
            {/* Hull, and the shade under it */}
            <ellipse
                cx="65"
                cy="38"
                rx="56"
                ry="15"
                fill="hsl(var(--card))"
                stroke="hsl(var(--accent) / 0.8)"
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
            />
            <ellipse cx="65" cy="44" rx="40" ry="6.5" fill="hsl(var(--accent) / 0.1)" />
            {/* Running lights. While it is working they flicker one after another. */}
            {[22, 44, 65, 86, 108].map((x, i) => (
                <circle
                    key={x}
                    cx={x}
                    cy="40"
                    r="3"
                    fill="hsl(var(--accent))"
                    style={flicker ? { animation: `flicker 1.2s linear ${i * 0.18}s infinite` } : undefined}
                />
            ))}
        </svg>
    )
}

/**
 * A tractor beam hanging under a saucer: a cone that fades out downwards.
 * Positioned by the caller; `className` sets the width and height.
 */
export function Beam({ className }: { className?: string }) {
    return (
        <span
            className={className}
            aria-hidden="true"
            style={{
                clipPath: 'polygon(42% 0, 58% 0, 100% 100%, 0 100%)',
                background: 'linear-gradient(to bottom, hsl(var(--accent) / 0.35), hsl(var(--accent) / 0.04))'
            }}
        />
    )
}
