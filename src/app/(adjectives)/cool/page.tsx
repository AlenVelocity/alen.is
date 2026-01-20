import Image from 'next/image'
import CoolPoll from '@/components/CoolPoll'
import { api } from '@/trpc/server'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'cool',
    description: 'Am I cool?',
    openGraph: {
        title: 'cool',
        description: 'Am I cool?',
        url: 'https://alen.is/cool',
        images: [{ url: '/rinu-cool.webp', width: 250, height: 250, alt: 'Rinu Cool' }]
    },
    alternates: { canonical: '/cool' }
}

export default async function Cool() {
    const initialPollData = await api.poll.getCoolPoll()

    return (
        <div className="flex flex-col items-center gap-8 px-4">
            <Image 
                src="/images/rinu-cool.webp" 
                alt="Rinu Cool" 
                width={200} 
                height={200} 
                className="rounded-2xl hover:scale-105 transition-transform duration-300" 
                priority 
            />
            <p className="text-xl text-muted-foreground">am I?</p>
            <CoolPoll initialData={initialPollData} />
        </div>
    )
}
