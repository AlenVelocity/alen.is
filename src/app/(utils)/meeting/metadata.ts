import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Schedule a Meeting',
    description: 'Book a one-hour meeting with Alen',
    openGraph: {
        title: 'Schedule a Meeting',
        description: 'Book a one-hour meeting with Alen',
        url: 'https://alen.is/meeting',
        images: [{ url: '/api/og?is=meeting', width: 1200, height: 630, alt: 'alen is meeting' }]
    },
    alternates: {
        canonical: '/meeting'
    }
}
