import { Metadata } from 'next'
import { constructMetadata } from '@/lib/metadata'
import { Descent } from './descent'

export const metadata: Metadata = constructMetadata({
    title: 'drowning',
    description: 'Alen is drowning. Sixteen ways, in order, getting faster.',
    slug: 'drowning',
    ogTitle: 'Alen is drowning',
    openGraph: { description: 'Alen is drowning. Sixteen ways, in order, getting faster.' }
})

export default function Drowning() {
    return <Descent />
}
