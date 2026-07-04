'use client'

import Cal, { getCalApi } from '@calcom/embed-react'
import { useEffect } from 'react'
import { PageTransition } from '@/components/ui/page-transition'
import { useTheme } from 'next-themes'

export default function MeetingPage() {
    const { theme } = useTheme()

    useEffect(() => {
        ;(async function () {
            const cal = await getCalApi()
            cal('ui', {
                theme: theme === 'dark' ? 'dark' : 'light',
                hideEventTypeDetails: false,
                layout: 'month_view',
                styles: { branding: { brandColor: '#10b981' } }
            })
        })()
    }, [theme])

    return (
        <PageTransition>
            <div className="container max-w-4xl py-12">
                <Cal
                    namespace="20-min-meeting"
                    calLink="xlxnyx/20-min"
                    style={{
                        width: '100%',
                        height: 'calc(100dvh - 8rem)',
                        borderRadius: '1rem'
                    }}
                    config={{
                        layout: 'month_view',
                        theme: theme === 'dark' ? 'dark' : 'light',
                        styles: { branding: '#10b981' }
                    }}
                />
            </div>
        </PageTransition>
    )
}
