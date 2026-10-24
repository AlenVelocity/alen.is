'use client'

import Cal, { getCalApi } from '@calcom/embed-react'
import { useEffect } from 'react'
import { PageTransition } from '@/components/ui/page-transition'
import { useTheme } from 'next-themes'

export default function MeetingPage() {
    // resolvedTheme, not theme: with theme="system" the latter never equals 'dark'
    const { resolvedTheme: theme } = useTheme()

    useEffect(() => {
        ;(async function () {
            const cal = await getCalApi()
            cal('ui', {
                theme: theme === 'dark' ? 'dark' : 'light',
                hideEventTypeDetails: false,
                layout: 'month_view',
                styles: { branding: { brandColor: theme === 'dark' ? '#00f583' : '#0da55e' } }
            })
        })()
    }, [theme])

    return (
        <PageTransition>
            <div className="container max-w-4xl py-6">
                <Cal
                    namespace="20-min-meeting"
                    calLink="xlxnyx/20-min"
                    style={{
                        width: '100%',
                        // Exactly fills the viewport under the navbar (py-6 = 3rem) instead of overshooting it
                        height: 'calc(100dvh - var(--navbar-height) - 3rem)',
                        borderRadius: '2px'
                    }}
                    config={{
                        layout: 'month_view',
                        theme: theme === 'dark' ? 'dark' : 'light',
                        styles: { branding: theme === 'dark' ? '#00f583' : '#0da55e' }
                    }}
                />
            </div>
        </PageTransition>
    )
}
