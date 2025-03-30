'use client'

import Cal, { getCalApi } from '@calcom/embed-react'
import { useEffect } from 'react'
import { PageTransition } from '@/components/ui/page-transition'

export default function MeetingPage() {
    useEffect(() => {
        ;(async () => {
            const cal = await getCalApi()
            cal('ui', {
                theme: 'light',
                hideEventTypeDetails: false,
                layout: 'month_view'
            })
        })()
    }, [])

    return (
        <PageTransition>
            <div className="container min-h-screen py-12">
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
                        theme: 'light'
                    }}
                />
            </div>
        </PageTransition>
    )
}
