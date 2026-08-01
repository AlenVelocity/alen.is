import { redirect } from 'next/navigation'
import { Metadata } from 'next'

import { constructMetadata } from '@/lib/metadata'

export const metadata: Metadata = constructMetadata({
    title: 'mad',
    description:
        'Alen is mad. Or maybe just angry — same thing around here, so this one forwards you to alen.is/angry where the actual answer lives.',
    slug: 'mad',
    ogTitle: 'Alen is mad'
})

export default function Mad() {
    redirect('/angry')
}
