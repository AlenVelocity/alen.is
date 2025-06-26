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
                styles: {
                    branding: { brandColor: '#22c55e' }
                }
            })
        })()
    }, [theme])

    return (
        <PageTransition>
            <div className="mx-auto min-h-screen py-12 min-w-[300px]">
                <Cal
                    namespace="1-hour-meeting"
                    calLink="xlxnyx/1-hour-meeting"
                    style={{
                        width: '100%',
                        height: 'calc(100vh - 6rem)',
                        borderRadius: '0.5rem'
                    }}
                    config={{
                        layout: 'month_view',
                        theme: theme === 'dark' ? 'dark' : 'light',
                        styles: {
                            branding: '#22c55e'
                        }
                    }}
                />
            </div>
        </PageTransition>
    )
}
