import Image from 'next/image'
import { Metadata } from 'next'
import { CenteredPage } from '@/components/ui/centered-page'

import { constructMetadata } from '@/lib/metadata'

export const metadata: Metadata = constructMetadata({
    title: 'thinking',
    description:
        'Alen is thinking. Stuff, ideas and half-formed thoughts, parked here on alen.is until they turn into something worth writing down.',
    slug: 'thinking',
    ogTitle: 'Alen is thinking'
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
