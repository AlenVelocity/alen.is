import { redirect } from 'next/navigation'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'pan',
    description: 'Alen is pan? Basically bi. Redirecting...',
    openGraph: {
        title: 'Alen is pan',
        description: 'Alen is pan.',
        url: 'https://alen.is/pan',
        images: [{ url: '/api/og?is=pan', width: 1200, height: 630, alt: 'alen is pan' }]
    },
    alternates: { canonical: '/pan' }
}

export default function Pan() {
    redirect('/bi')
}
