import type { ReactNode } from 'react'
import { DecodeText } from './decode-text'
import { Persona } from '@/components/persona'

interface PageHeaderProps {
    /** The joke, without the leading slashes */
    eyebrow: string
    title: string
    /**
     * Ban's name for this page. While he is in it replaces the title, and
     * Alen's title sits above it, struck out.
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
 * The header every content page shares: eyebrow, title, one line, optional
 * action. Alen's title decodes out of glyphs. Ban's does nothing: it is
 * already there, over the title he crossed out.
 */
export function PageHeader({ eyebrow, title, banTitle, titleExtra, children, aside }: PageHeaderProps) {
    return (
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4 mb-10">
            <div className="min-w-0">
                <p className="mono-label text-muted-foreground/50 mb-3">
                    <Persona
                        alen={`// ${eyebrow}`}
                        ban={banTitle ? <span className="struck">{title.toLowerCase()}</span> : eyebrow}
                    />
                </p>
                <h1 className="text-display text-4xl md:text-5xl mb-2 flex items-center gap-4 ban:text-5xl ban:md:text-6xl">
                    <Persona alen={<DecodeText text={title} onMount />} ban={banTitle ?? title} />
                    {titleExtra}
                </h1>
                {children}
            </div>
            {aside}
        </div>
    )
}
