import { redirect } from 'next/navigation'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'gay',
    description: 'Alen is gay?',
    openGraph: {
        title: 'Alen is gay',
        description: 'Alen is gay.',
        url: 'https://alen.is/gay',
        images: [{ url: '/api/og?is=gay', width: 1200, height: 630, alt: 'alen is gay' }]
    },
    alternates: { canonical: '/gay' }
}

export default function Gay() {
    redirect('/bi')
}
