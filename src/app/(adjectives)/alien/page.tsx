import { Metadata } from 'next'
import { constructMetadata } from '@/lib/metadata'
import { AlienReveal } from './alien-reveal'

export const metadata: Metadata = constructMetadata({
    title: 'alien',
    description:
        "Alen is alien. You probably shouldn't have come here, but since you did, here is what has been transmitting from this corner of alen.is.",
    slug: 'alien',
    ogTitle: 'Alen is alien'
})

export default function Alien() {
    return <AlienReveal />
}
