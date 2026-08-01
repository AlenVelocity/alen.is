import Image from 'next/image'
import { Metadata } from 'next'
import { CenteredPage } from '@/components/ui/centered-page'

import { constructMetadata } from '@/lib/metadata'

export const metadata: Metadata = constructMetadata({
    title: 'thinking',
    description: 'Alen is thinking. Thinking about stuff, ideas, and random thoughts over here.',
    slug: 'thinking',
    ogTitle: 'Alen is thinking',
    openGraph: { description: 'Alen is thinking. Ideas and thoughts.' }
})

export default function Thinking() {
    return (
        <CenteredPage>
            <Image
                src="/thinking.gif"
                alt="Thinking"
                width={400}
                height={400}
                className="max-w-[250px] md:max-w-[400px] h-auto rounded-2xl"
                priority
            />
        </CenteredPage>
    )
}
