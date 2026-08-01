import { redirect } from 'next/navigation'
import { Metadata } from 'next'

import { constructMetadata } from '@/lib/metadata'

export const metadata: Metadata = constructMetadata({
    title: 'pan',
    description:
        'Alen is pan? Basically bi, near enough that this page forwards you to alen.is/bi rather than splitting hairs about it.',
    slug: 'pan',
    ogTitle: 'Alen is pan'
})

export default function Pan() {
    redirect('/bi')
}
