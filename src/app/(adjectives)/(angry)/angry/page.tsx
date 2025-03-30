import { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
    title: 'angry',
    description: 'Probably not but who knows'
}

export default async function Cool() {
    return (
        <div className="flex flex-col items-center justify-center gap-8 py-12 pt-24">
            <Image
                src="/pusheen/pusheen-not-talking.gif"
                alt="pusheen not talking"
                width={250}
                height={250}
                className="hover:scale-105 transition-transform duration-300"
            />

            <div className="flex flex-col items-center justify-center gap-4">
                <p className="text-lg">Don't talk to me ( ｡ •`ᴖ´• ｡)</p>
            </div>
        </div>
    )
}
