import { constructMetadata } from '@/lib/metadata'
import { redirect } from 'next/navigation'
import { Metadata } from 'next'

export const metadata: Metadata = constructMetadata({
    title: 'straight',
    description:
        'Alen is straight? Not quite — bi, actually. This page sends you along to alen.is/bi where that gets a proper answer.',
    slug: 'straight',
    ogTitle: 'Alen is straight'
})

export default function Straight() {
    redirect('/bi')
}
