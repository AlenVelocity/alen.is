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

    return (
        <div className="fixed inset-x-0 top-[var(--navbar-height)] bottom-0 overflow-hidden overscroll-none flex items-center justify-center">
            {children}
        </div>
    )
}
