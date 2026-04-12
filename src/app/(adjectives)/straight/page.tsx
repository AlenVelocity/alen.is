import { redirect } from 'next/navigation'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'straight',
    description: 'Alen is straight. Wait no he\'s not. Redirecting you to bi.',
    openGraph: {
        title: 'Alen is straight',
        description: 'Alen is straight.',
        url: 'https://alen.is/straight'
    },
    alternates: { canonical: '/straight' }
}

export default function Straight() {
    redirect('/bi')
}
