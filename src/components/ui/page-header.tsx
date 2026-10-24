import type { ReactNode } from 'react'
import { DecodeText } from './decode-text'

interface PageHeaderProps {
    /** The joke, without the leading slashes */
    eyebrow: string
    title: string
    /** Rendered inside the h1 after the title, for the equalizer on /listening */
    titleExtra?: ReactNode
    /** One sentence under the title */
    children?: ReactNode
    /** An action on the right, like the resume download */
    aside?: ReactNode
}

/** The header every content page shares: eyebrow, decoding title, one line, optional action. */
export function PageHeader({ eyebrow, title, titleExtra, children, aside }: PageHeaderProps) {
    return (
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4 mb-10">
            <div className="min-w-0">
                <p className="mono-label text-muted-foreground/50 mb-3">// {eyebrow}</p>
                <h1 className="text-display text-4xl md:text-5xl mb-2 flex items-center gap-4">
                    <DecodeText text={title} onMount />
                    {titleExtra}
                </h1>
                {children}
            </div>
            {aside}
        </div>
    )
}
