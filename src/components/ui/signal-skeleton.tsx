import { cn } from '@/lib/utils'

/**
 * Loading placeholders for the Last.fm sections. A skeleton's job is to hold
 * the space its content will take, so each one here is built from the same
 * boxes as the thing that replaces it: a page should not move when the API
 * answers.
 */

/** A shimmer bar standing in for a run of text */
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

/**
 * A bar that takes up exactly one line of text. `className` is the text style
 * of the line it stands in for ("text-sm", "mono-label"), which is what gives
 * the box the right height in both people's type.
 */
export function SkeletonLine({ width, className }: { width: string; className?: string }) {
    return (
        <div className={cn('flex items-center', className)}>
            {/* The non-breaking space is what makes the box one line tall */}
            <span className="w-0 overflow-hidden">&nbsp;</span>
            <SkeletonBar width={width} height="0.55em" />
        </div>
    )
}

/** Square placeholder standing in for album art and thumbnails */
export function SkeletonTile({ className }: { className?: string }) {
    return <div className={cn('skeleton-shimmer rounded shrink-0', className)} />
}

/**
 * The recent scrobbles list on /listening while it loads. Same grid, same row
 * height and same dividers as the real rows: time in a left rail from md up,
 * on the right of the row below that.
 */
export function ScrobbleRowsSkeleton({ rows }: { rows: number }) {
    return (
        <div aria-hidden="true">
            {[...Array(rows)].map((_, i) => (
                <div
                    key={i}
                    className="grid gap-x-8 md:grid-cols-[10rem_1fr] items-center py-2.5 border-b border-dashed border-border/50 last:border-b-0"
                >
                    <SkeletonLine className="hidden md:flex mono-label" width="5.5rem" />
                    <div className="flex items-center gap-3 min-w-0">
                        <SkeletonTile className="w-9 h-9" />
                        <div className="flex-1 min-w-0">
                            <SkeletonLine className="text-sm" width={`${45 + ((i * 17) % 35)}%`} />
                            <SkeletonLine className="text-xs" width={`${25 + ((i * 11) % 20)}%`} />
                        </div>
                        <SkeletonLine className="md:hidden mono-label shrink-0" width="3.5rem" />
                    </div>
                </div>
            ))}
        </div>
    )
}
