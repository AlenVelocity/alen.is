import { Metadata } from 'next'

import { constructMetadata } from '@/lib/metadata'

// page.tsx is a client component and cannot export this itself; layout.tsx
// next to it re-exports it.
export const metadata: Metadata = constructMetadata({
    title: 'Meeting',
    description: "Book a call with me. Pick a time and I'll be on it.",
    slug: 'meeting',
    ogTitle: 'Alen is Meeting'
})
