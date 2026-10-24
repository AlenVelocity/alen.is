import type { ReactNode } from 'react'
import { Beam, Saucer } from './saucer'

/**
 * Nothing here yet: the saucer hovers over the spot and scans it. The one
 * animated thing on a page that has nothing else to show.
 */
export function EmptyState({ children }: { children: ReactNode }) {
    return (
        <div className="inline-flex flex-col items-center py-6">
            <div className="relative w-24 h-16" aria-hidden="true">
                <Saucer className="absolute left-1/2 -translate-x-1/2 top-0 w-9 text-accent/80 animate-[ufoBob_3s_ease-in-out_infinite]" />
                <Beam className="absolute left-1/2 -translate-x-1/2 top-[14px] w-20 h-12" />
            </div>
            <p className="mono-label text-muted-foreground/50 text-center">{children}</p>
        </div>
    )
}
