import { redirect } from 'next/navigation'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'mad',
    description: 'Alen is mad. Or maybe just angry. Redirecting you.',
    openGraph: {
        title: 'Alen is mad',
        description: 'Alen is mad.',
        url: 'https://alen.is/mad'
    },
    alternates: { canonical: '/mad' }
}

export default function Mad() {
    redirect('/angry')
}
