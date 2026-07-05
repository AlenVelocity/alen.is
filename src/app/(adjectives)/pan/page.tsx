import { redirect } from 'next/navigation'
import { Metadata } from 'next'

import { constructMetadata } from '@/lib/metadata'

export const metadata: Metadata = constructMetadata({
    title: 'pan',
    description: 'Alen is pan? Basically bi. Redirecting...',
    slug: 'pan',
    ogTitle: 'Alen is pan',
    openGraph: { description: 'Alen is pan.' }
})

export default function Pan() {
    redirect('/bi')
}
