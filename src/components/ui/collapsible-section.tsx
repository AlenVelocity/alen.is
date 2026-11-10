'use client'

import { useState, type ReactNode } from 'react'
import { FiChevronDown } from 'react-icons/fi'

/**
 * A section that opens and closes under its own label.
 *
 * `title` can be any node, so a caller can pass a <Persona> and give each of
 * them his own name for the section. Its case comes from `.section-label`.
 */
export function CollapsibleSection({
    title,
    icon,
    children,
    defaultOpen = false
}: {
    title: ReactNode
    icon?: ReactNode
    children: ReactNode
    defaultOpen?: boolean
}) {
    const [open, setOpen] = useState(defaultOpen)

    return (
        <section className="mb-12">
            <button
                type="button"
                onClick={() => setOpen(!open)}
                aria-expanded={open}
                className="section-label w-full text-left mb-4 hover:text-foreground transition-colors"
            >
                {icon}
                {title}
                <FiChevronDown
                    className={`w-3.5 h-3.5 ml-auto transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                />
            </button>
            <div
                className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                // Collapsed content stays in the DOM; inert keeps it out of the tab order
                inert={!open}
            >
                <div className="overflow-hidden">{children}</div>
            </div>
        </section>
    )
}
