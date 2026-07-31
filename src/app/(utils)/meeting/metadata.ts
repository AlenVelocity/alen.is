import { Metadata } from 'next'

import { constructMetadata } from '@/lib/metadata'

export const metadata: Metadata = constructMetadata({
    title: 'Schedule a Meeting',
    description:
        'Book a one-hour meeting with Alen. Pick a slot that suits you and it lands straight in the calendar — no back-and-forth email needed.',
    slug: 'meeting'
})
