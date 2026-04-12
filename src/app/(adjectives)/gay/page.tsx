import { redirect } from 'next/navigation'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'gay',
    description: 'Alen is gay? Try bi. Redirecting...',
    openGraph: {
        title: 'Alen is gay',
        description: 'Alen is gay.',
        url: 'https://alen.is/gay'
    },
    alternates: { canonical: '/gay' }
}

export default function Gay() {
    redirect('/bi')
}
