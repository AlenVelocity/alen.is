import type { ReactNode } from 'react'
import { OnlyAlen, OnlyBan } from '@/components/persona'
import { Beam, Saucer } from './saucer'

/**
 * Nothing here yet. For Alen the saucer hovers over the spot and scans it, the
 * one animated thing on a page that has nothing else to show. Ban has no
 * saucer: he rules a blank line, the way an empty entry is left on a form.
 *
 * `children` are the caller's words. Pass a <Persona> to give Ban his own.
 */
export function EmptyState({ children }: { children: ReactNode }) {
    return (
        <div className="inline-flex flex-col items-center py-6 ban:items-start">
            <OnlyAlen>
                <span className="relative block w-24 h-16" aria-hidden="true">
                    <Saucer className="absolute left-1/2 -translate-x-1/2 top-0 w-9 text-accent/80 animate-[ufoBob_3s_ease-in-out_infinite]" />
                    <Beam className="absolute left-1/2 -translate-x-1/2 top-[14px] w-20 h-12" />
                </span>
            </OnlyAlen>
            <OnlyBan>
                <span className="block w-24 border-t border-foreground/40 mb-3" aria-hidden="true" />
            </OnlyBan>
            <p className="mono-label text-muted-foreground/50 text-center ban:text-left">{children}</p>
        </div>
    )
}
