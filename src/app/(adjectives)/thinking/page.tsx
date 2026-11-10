import Image from 'next/image'
import { Metadata } from 'next'
import { CenteredPage } from '@/components/ui/centered-page'

import { constructMetadata } from '@/lib/metadata'
import { OnlyBan } from '@/components/persona'

export const metadata: Metadata = constructMetadata({
    title: 'thinking',
    description: 'Alen is thinking. Mostly in excalidraw.',
    slug: 'thinking',
    ogTitle: 'Alen is thinking',
    openGraph: { description: 'Alen is thinking. Mostly in excalidraw.' }
})

/**
 * The gif is Alen's whole answer (it loads thoughts and finds none), so his
 * page has no words. Ban's answer goes under it.
 */
export default function Thinking() {
    return (
        <CenteredPage className="gap-6">
            <Image
                src="/thinking.gif"
                alt="pusheen under a loading spinner. thoughts loading, then: no thoughts found"
                width={400}
                height={400}
                className="max-w-[250px] md:max-w-[400px] h-auto rounded ban:rounded-none"
                priority
            />
            <OnlyBan as="div">
                <p className="text-lg text-muted-foreground text-center max-w-sm">
                    He calls this thinking. I skipped that step.
                </p>
            </OnlyBan>
        </CenteredPage>
    )
}
