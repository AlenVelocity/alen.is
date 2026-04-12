import { redirect } from 'next/navigation'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'experience',
    description: 'Alen is experienced. Redirecting to /working...',
    openGraph: {
        title: 'Alen is experienced',
        description: 'Redirecting to /working.',
        url: 'https://alen.is/experience'
    },
    alternates: { canonical: '/experience' }
}

export default function ExperienceRedirect() {
    redirect('/working')
}
