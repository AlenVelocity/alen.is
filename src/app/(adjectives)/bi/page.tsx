import { Metadata } from 'next'
import BiClient from './BiClient'

import { constructMetadata } from '@/lib/metadata'

export const metadata: Metadata = constructMetadata({
    title: 'bi',
    description: "Alen is bi. Everyone's cute, not his fault.",
    slug: 'bi',
    ogTitle: 'Alen is bi',
    openGraph: { description: "Alen is bi. Everyone's cute." }
})

export default function Bi() {
    return <BiClient />
}
