import { redirect } from 'next/navigation'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'mad',
    description: 'Alen is mad. Or maybe just angry. Redirecting you.',
    openGraph: {
        title: 'Alen is mad',
        description: 'Alen is mad.',
        url: 'https://alen.is/mad',
        images: [{ url: '/api/og?is=mad', width: 1200, height: 630, alt: 'alen is mad' }]
    },
    alternates: { canonical: '/mad' }
}

export default function Mad() {
    redirect('/angry')
}
