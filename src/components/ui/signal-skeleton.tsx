import { cn } from '@/lib/utils'

/**
 * Modern, polished skeleton loading placeholders.
 *
 * Instead of the old ▓▒░ glyph static, these use smooth gradient shimmer
 * bars that feel premium and match the site's dark aesthetic. Each element
 * pulses with a staggered delay so the skeleton feels alive, not frozen.
 */

/** A smooth shimmer bar standing in for a line of text */
export function SkeletonBar({
    width = '100%',
    height = '0.75rem',
    delay = 0,
    className
}: {
    width?: string
    height?: string
    delay?: number
    className?: string
}) {
    return (
        <div
            className={cn('skeleton-shimmer rounded-sm', className)}
            style={{
                width,
                height,
                animationDelay: `${delay}s`
            }}
        />
    )
}

/** Square placeholder standing in for album art / thumbnails */
export function SkeletonTile({ className }: { className?: string }) {
    return <div className={cn('skeleton-shimmer rounded-md shrink-0', className)} />
}

/** Track-list-shaped placeholder: ranked rows with smooth shimmer bars */
export function SignalRowsSkeleton({ rows, ranked = true }: { rows: number; ranked?: boolean }) {
    return (
        <div aria-hidden="true">
            {[...Array(rows)].map((_, i) => (
                <div
                    key={i}
                    className="flex items-center gap-3 py-2.5 border-b border-dashed border-border/30 last:border-b-0"
                    style={{ animationDelay: `${i * 0.08}s` }}
                >
                    {ranked && (
                        <span className="mono-label text-muted-foreground/15 w-5 text-right shrink-0">
                            {String(i + 1).padStart(2, '0')}
                        </span>
                    )}
                    <SkeletonTile className="w-9 h-9" />
                    <div className="flex-1 min-w-0 space-y-2">
                        <SkeletonBar width={`${55 + ((i * 17) % 30)}%`} height="0.625rem" delay={i * 0.12} />
                        <SkeletonBar width={`${30 + ((i * 11) % 20)}%`} height="0.5rem" delay={i * 0.12 + 0.15} />
                    </div>
                </div>
            ))}
        </div>
    )
}
