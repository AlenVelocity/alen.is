import { TbArrowUpRight } from 'react-icons/tb'

/**
 * The mark after a link that leaves the site. A drawn arrow, the same one the
 * home page's links use, in place of a typed "↗": a typed arrow changes shape
 * with the font and sat differently in Alen's face and Ban's. It is the size
 * of the text around it and takes its colour from the span it sits in.
 */
export function ExternalMark({ className }: { className?: string }) {
    return (
        <TbArrowUpRight
            className={`inline-block w-[1em] h-[1em] align-[-0.125em] ${className ?? ''}`}
            aria-hidden="true"
        />
    )
}
