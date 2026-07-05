import { Metadata } from 'next'

import { constructMetadata } from '@/lib/metadata'

export const metadata: Metadata = constructMetadata({
    title: 'Schedule a Meeting',
    description: 'Book a one-hour meeting with Alen',
    slug: 'meeting'
})
