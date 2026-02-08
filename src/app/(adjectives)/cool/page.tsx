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
        <div className="flex flex-col items-center gap-6 px-4">
            {/* Polaroid-style photo */}
            <div
                className="bg-card border border-border paper-shadow p-3 pb-6 rounded-lg"
                style={{ rotate: '-2deg' }}
            >
                <Image
                    src="/images/rinu-cool.webp"
                    alt="Rinu Cool"
                    width={200}
                    height={200}
                    className="rounded-sm hover:scale-105 transition-transform duration-300"
                    priority
                />
                <p className="text-center text-xs text-muted-foreground mt-3 italic">exhibit A</p>
            </div>
            <p className="text-xl text-muted-foreground" style={{ rotate: '0.5deg' }}>
                am I?
            </p>
            <CoolPoll initialData={initialPollData} />
        </div>
    )
}
