'use client'

import { useEffect } from 'react'

export default function AdjectivesLayout({ children }: { children: React.ReactNode }) {
    // Lock body/html scroll on mount to prevent mobile address bar rubber-banding
    useEffect(() => {
        const html = document.documentElement
        const body = document.body

        const originalHtmlOverflow = html.style.overflow
        const originalBodyOverflow = body.style.overflow

        html.style.overflow = 'hidden'
        body.style.overflow = 'hidden'

        return () => {
            html.style.overflow = originalHtmlOverflow
            body.style.overflow = originalBodyOverflow
        }
    }, [])

    // Safe centering + its own scroll: on short screens (landscape phones, iOS
    // with both toolbars showing) content taller than the stage starts at the
    // top and scrolls, instead of being clipped at both ends with no way to reach it
    return (
        <div className="adjective-stage no-scrollbar fixed inset-x-0 top-[var(--navbar-height)] bottom-0 overflow-x-hidden overflow-y-auto overscroll-none flex items-center [align-items:safe_center] justify-center">
            {children}
        </div>
    )
}
