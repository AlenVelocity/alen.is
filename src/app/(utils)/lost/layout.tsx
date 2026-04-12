import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'lost',
    description: 'Alen is lost. Not all those who wander are lost. Play Conway\'s Game of Life while you\'re here.',
    openGraph: {
        title: 'Alen is lost',
        description: 'Alen is lost. Not all those who wander are lost.',
        url: 'https://alen.is/lost'
    },
    alternates: { canonical: '/lost' }
}

export default function LostLayout({ children }: { children: React.ReactNode }) {
    return children
}
