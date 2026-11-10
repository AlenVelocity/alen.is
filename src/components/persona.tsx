import type { ReactNode } from 'react'

interface PersonaProps {
    /** What Alen says or shows here */
    alen: ReactNode
    /** What Ban says or shows here */
    ban: ReactNode
    /** Wrapper element. Use 'div' when the content is block level (a list, a section). */
    as?: 'span' | 'div'
}

/**
 * One spot, two people. Both versions are in the HTML and CSS shows the one
 * who is in (`[data-as]` in globals.css), which keeps pages static and means
 * nothing flashes on load. Works in server and client components alike.
 *
 * The wrappers are `display: contents`, so they add no box of their own. That
 * also means a parent's `space-y-*`, `gap` on a grid of fixed cells, or
 * `first:`/`last:` rules see the wrapper and not what is inside it: put
 * <Persona> inside the element being spaced, not around it.
 */
export function Persona({ alen, ban, as: Tag = 'span' }: PersonaProps) {
    return (
        <>
            <Tag data-as="alen">{alen}</Tag>
            <Tag data-as="ban" data-nosnippet="">
                {ban}
            </Tag>
        </>
    )
}

/** Only there while Alen is in. */
export function OnlyAlen({ children, as: Tag = 'span' }: { children: ReactNode; as?: 'span' | 'div' }) {
    return <Tag data-as="alen">{children}</Tag>
}

/** Only there while Ban is in. */
export function OnlyBan({ children, as: Tag = 'span' }: { children: ReactNode; as?: 'span' | 'div' }) {
    return (
        <Tag data-as="ban" data-nosnippet="">
            {children}
        </Tag>
    )
}
