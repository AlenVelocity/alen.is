import { Metadata } from 'next'
import BiClient from './BiClient'

export const metadata: Metadata = {
    title: 'bi',
    description: "Alen is bi. Everyone's cute, not his fault.",
    openGraph: {
        title: 'Alen is bi',
        description: "Alen is bi. Everyone's cute.",
        url: 'https://alen.is/bi',
        images: [{ url: '/api/og?is=bi', width: 1200, height: 630, alt: 'alen is bi' }]
    },
    alternates: { canonical: '/bi' }
}

export default function Bi() {
    return <BiClient />
}
