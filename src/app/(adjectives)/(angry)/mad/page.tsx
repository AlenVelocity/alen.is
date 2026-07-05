import { redirect } from 'next/navigation'
import { Metadata } from 'next'

import { constructMetadata } from '@/lib/metadata'

export const metadata: Metadata = constructMetadata({
    title: 'mad',
    description: 'Alen is mad. Or maybe just angry. Redirecting you.',
    slug: 'mad',
    ogTitle: 'Alen is mad',
    openGraph: { description: 'Alen is mad.' }
})

export default function Mad() {
    redirect('/angry')
}
