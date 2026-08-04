import { redirect } from 'next/navigation'
import { Metadata } from 'next'

import { constructMetadata } from '@/lib/metadata'

export const metadata: Metadata = constructMetadata({
    title: 'gay',
    description:
        'Alen is gay? Close, but bi is the accurate one — this page hands you straight over to alen.is/bi where the answer is spelled out.',
    slug: 'gay',
    ogTitle: 'Alen is gay'
})

export default function Gay() {
    redirect('/bi')
}
