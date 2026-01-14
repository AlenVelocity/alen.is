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
                    namespace="1-hour-meeting"
                    calLink="xlxnyx/1-hour-meeting"
                    style={{
                        width: '100%',
                        height: 'calc(100vh - 8rem)',
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
