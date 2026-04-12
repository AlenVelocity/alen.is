'use client'

import { useState, type ReactNode } from 'react'
import { FiChevronDown } from 'react-icons/fi'

export function CollapsibleSection({
    title,
    icon,
    children,
    defaultOpen = false,
}: {
    title: string
    icon?: ReactNode
    children: ReactNode
    defaultOpen?: boolean
}) {
    const [open, setOpen] = useState(defaultOpen)

    return (
        <section className="mb-12">
            <button
                onClick={() => setOpen(!open)}
                className="group flex items-center gap-2 w-full text-left text-sm font-medium text-muted-foreground uppercase tracking-wider border-l-2 border-accent pl-3 mb-4 hover:text-foreground transition-colors"
            >
                {icon}
                {title}
                <FiChevronDown
                    className={`w-3.5 h-3.5 ml-auto transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                />
            </button>
            <div
                className={`grid transition-all duration-300 ease-in-out ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
            >
                <div className="overflow-hidden">
                    {children}
                </div>
            </div>
        </section>
    )
}
