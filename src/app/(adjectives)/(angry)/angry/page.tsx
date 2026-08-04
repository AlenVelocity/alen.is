import { Metadata } from 'next'
import Image from 'next/image'
import { CenteredPage } from '@/components/ui/centered-page'

import { constructMetadata } from '@/lib/metadata'

export const metadata: Metadata = constructMetadata({
    title: 'angry',
    description:
        "Alen is angry. Probably not, but who knows. Don't talk to me — a very small page on alen.is for the days when that is the whole mood.",
    slug: 'angry',
    ogTitle: 'Alen is angry'
})

export default function Angry() {
    return (
        <CenteredPage className="gap-6">
            <Image
                src="/pusheen/pusheen-not-talking.gif"
                alt="pusheen not talking"
                width={200}
                height={200}
                className="rounded-2xl hover:scale-105 transition-transform duration-300"
            />
            <p className="text-lg text-muted-foreground">Don't talk to me ( ｡ •`ᴖ´• ｡)</p>
        </CenteredPage>
    )
}
