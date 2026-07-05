import { redirect } from 'next/navigation'
import { Metadata } from 'next'

import { constructMetadata } from '@/lib/metadata'

export const metadata: Metadata = constructMetadata({
    title: 'gay',
    description: 'Alen is gay? Try bi. Redirecting...',
    slug: 'gay',
    ogTitle: 'Alen is gay',
    openGraph: { description: 'Alen is gay.' }
})

export default function Gay() {
    redirect('/bi')
}
