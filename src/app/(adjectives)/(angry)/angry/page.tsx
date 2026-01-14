import { Metadata } from 'next'
import Image from 'next/image'
import { CenteredPage } from '@/components/ui/centered-page'

export const metadata: Metadata = {
    title: 'angry',
    description: 'Probably not but who knows'
}

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
