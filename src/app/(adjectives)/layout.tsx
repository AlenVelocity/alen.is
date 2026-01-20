'use client'

import { useEffect } from 'react'

export default function AdjectivesLayout({ children }: { children: React.ReactNode }) {
    // Lock body/html scroll on mount to prevent mobile address bar behavior
    useEffect(() => {
        const html = document.documentElement
        const body = document.body
        
        // Store original styles
        const originalHtmlOverflow = html.style.overflow
        const originalBodyOverflow = body.style.overflow
        const originalHtmlHeight = html.style.height
        const originalBodyHeight = body.style.height
        
        // Lock scroll completely
        html.style.overflow = 'hidden'
        html.style.height = '100%'
        body.style.overflow = 'hidden'
        body.style.height = '100%'
        
        return () => {
            html.style.overflow = originalHtmlOverflow
            html.style.height = originalHtmlHeight
            body.style.overflow = originalBodyOverflow
            body.style.height = originalBodyHeight
        }
    }, [])

    return (
        <div className="fixed inset-x-0 top-20 bottom-0 h-[calc(100dvh-5rem)] overflow-hidden overscroll-none flex items-center justify-center">
            {children}
        </div>
    )
}
