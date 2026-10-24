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
