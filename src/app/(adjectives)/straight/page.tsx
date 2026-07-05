import { constructMetadata } from '@/lib/metadata'
import { redirect } from 'next/navigation'
import { Metadata } from 'next'

export const metadata: Metadata = constructMetadata({
    title: 'straight',
    description: 'Alen is straight? Try bi. Redirecting...',
    slug: 'straight',
    ogTitle: 'Alen is straight',
    openGraph: { description: 'Alen is straight.' }
})

export default function Straight() {
    redirect('/bi')
}
