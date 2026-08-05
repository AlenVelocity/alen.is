import { Metadata } from 'next'
import { constructMetadata } from '@/lib/metadata'
import { AlienReveal } from './alien-reveal'

export const metadata: Metadata = constructMetadata({
    title: 'alien',
    description: "Alen is alien. You probably shouldn't have come here.",
    slug: 'alien',
    ogTitle: 'Alen is alien',
    openGraph: { description: "Alen is alien. You probably shouldn't have come here." }
})

export default function Alien() {
    return <AlienReveal />
}
