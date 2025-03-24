import Image from 'next/image'
import CoolPoll from '@/components/CoolPoll'
import { api } from '@/trpc/server'

export const metadata = {
    title: 'Cool',
    description: 'Am I?'
}

export default async function Cool() {
    const initialPollData = await api.poll.getCoolPoll()

    return (
        <div className="flex flex-col items-center justify-center gap-8 py-12 pt-24">
            <Image src="/rinu-cool.webp" alt="Rinu Cool" width={250} height={250} className="rounded-lg" priority />
            <p className="text-xl font-medium text-muted-foreground">am I cool?</p>
            <CoolPoll initialData={initialPollData} />
        </div>
    )
}
