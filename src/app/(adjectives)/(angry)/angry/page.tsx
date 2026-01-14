import { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
    title: 'angry',
    description: 'Probably not but who knows'
}

export default function Angry() {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center gap-6 py-12">
            <Image
                src="/pusheen/pusheen-not-talking.gif"
                alt="pusheen not talking"
                width={200}
                height={200}
                className="rounded-2xl hover:scale-105 transition-transform duration-300"
            />
            <p className="text-lg text-muted-foreground">Don't talk to me ( ｡ •`ᴖ´• ｡)</p>
        </div>
    )
}
