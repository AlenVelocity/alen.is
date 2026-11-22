import type { ReactNode } from 'react'
import { Translate } from './translate'
import { Persona } from '@/components/persona'

interface PageHeaderProps {
    /** The small line that goes with the title. A few words, in Alen's voice. */
    eyebrow: string
    title: string
    /**
     * Ban's name for this page. While he is in it replaces the title, and
     * Alen's title follows it on the same line, struck out.
     */
    banTitle?: string
    /** Rendered inside the h1 after the title, for the equalizer on /listening */
    titleExtra?: ReactNode
    /** One sentence under the title */
    children?: ReactNode
    /** An action on the right, like the resume download */
    aside?: ReactNode
}

/**
 * The header every content page shares: title, a small line after it, one
 * sentence under it, optional action. The small line used to sit above the
 * title as an eyebrow with `//` in front. It now follows the title on the same
 * line (and drops under it when there is no room), so the title is the first
 * thing on the page. For Ban that slot holds the title he crossed out. Alen's title arrives in his script and turns into English (CSS, so
 * it starts with the page and not after hydration). Ban's does nothing: it is
 * already there, over the title he crossed out.
 */
export function PageHeader({ eyebrow, title, banTitle, titleExtra, children, aside }: PageHeaderProps) {
    return (
        <div className="page-header flex flex-wrap items-end justify-between gap-x-6 gap-y-4 mb-10">
            <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-2.5">
                    <h1 className="text-display text-4xl md:text-5xl flex items-center gap-4 ban:text-5xl ban:md:text-6xl">
                        <Persona alen={<Translate text={title} delay={260} />} ban={banTitle ?? title} />
                        {titleExtra}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        <Persona
                            alen={eyebrow}
                            ban={banTitle ? <span className="struck">{title.toLowerCase()}</span> : eyebrow}
                        />
                    </p>
                </div>
                {children}
            </div>
            {aside}
        </div>
    )
}
