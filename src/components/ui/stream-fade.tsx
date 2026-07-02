'use client'

/**
 * Wraps streamed (Suspense-resolved) content so it fades in smoothly
 * instead of flashing in abruptly when the server component resolves.
 *
 * Usage: wrap the async server component's return JSX with <StreamFade>.
 * The CSS animation (animate-signal-resolve) handles the blur→sharp transition.
 */
export function StreamFade({
    children,
    className = ''
}: {
    children: React.ReactNode
    className?: string
}) {
    return (
        <div className={`animate-signal-resolve ${className}`}>
            {children}
        </div>
    )
}
