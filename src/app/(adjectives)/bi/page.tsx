import { Metadata } from 'next'
import BiClient from './BiClient'

import { constructMetadata } from '@/lib/metadata'

export const metadata: Metadata = constructMetadata({
    title: 'bi',
    description:
        "Alen is bi. Everyone's cute and that is frankly not his fault. One of the shorter answers on alen.is, and one of the easier ones.",
    slug: 'bi',
    ogTitle: 'Alen is bi'
})

export default function Bi() {
    return <BiClient />
}
