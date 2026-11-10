import { Metadata } from 'next'
import Image from 'next/image'
import { CenteredPage } from '@/components/ui/centered-page'

import { constructMetadata } from '@/lib/metadata'
import { Persona } from '@/components/persona'

export const metadata: Metadata = constructMetadata({
    title: 'angry',
    description: "Alen is angry. Don't talk to him.",
    slug: 'angry',
    ogTitle: 'Alen is angry',
    openGraph: { description: "Alen is angry. Don't talk to him." }
})

/**
 * Alen is pretending, with a cat that has turned its back. Ban is calm, which
 * is worse: to him the cat is Alen.
 */
export default function Angry() {
    return (
        <CenteredPage className="gap-6">
            <Image
                src="/pusheen/pusheen-not-talking.gif"
                alt="pusheen on a pillow with its back turned"
                width={200}
                height={200}
                className="rounded ban:rounded-none"
            />
            <p className="text-lg text-muted-foreground text-center max-w-sm">
                <Persona
                    alen="Don't talk to me ( ｡ •`ᴖ´• ｡)"
                    ban="That is him sulking. I keep a list, and he is on it twice."
                />
            </p>
        </CenteredPage>
    )
}
