import Image from 'next/image'
import CoolPoll from '@/components/CoolPoll'
import { api } from '@/trpc/server'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'cool',
    description: 'Am I cool?',
    openGraph: {
        title: 'Alen is cool?',
        description: 'Am I cool?',
        url: 'https://alen.is/cool',
        images: [{ url: '/api/og?is=cool', width: 1200, height: 630, alt: 'alen is cool?' }]
    },
    alternates: { canonical: '/cool' }
}

export default async function Cool() {
    const initialPollData = await api.poll.getCoolPoll()

    return (
        <div className="flex flex-col items-center justify-center gap-8 px-4 h-full">
            {/* Eyebrow */}
            <p
                className="mono-label text-muted-foreground/35 animate-fade-in-up opacity-0 stagger-1 tracking-[0.25em]"
                style={{ animationFillMode: 'forwards' }}
            >
                // query: am_i_cool
            </p>

            {/* Polaroid */}
            <div
                className="animate-fade-in-up opacity-0 stagger-2 relative group"
                style={{ animationFillMode: 'forwards', rotate: '-2.5deg' }}
            >
                {/* Outer glow ring on hover */}
                <div
                    className="absolute -inset-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                        background: 'radial-gradient(ellipse at center, hsl(var(--accent)/0.15), transparent 70%)'
                    }}
                />

                <div
                    className="bg-card border border-border/60 p-3 pb-8 relative overflow-hidden scanline-hover"
                    style={{ boxShadow: '4px 4px 0 hsl(var(--border))' }}
                >
                    {/* Corner brackets */}
                    <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-accent/50" />
                    <div className="absolute top-0 right-0 w-5 h-5 border-t border-r border-accent/50" />
                    <div className="absolute bottom-0 left-0 w-5 h-5 border-b border-l border-accent/50" />
                    <div className="absolute bottom-0 right-0 w-5 h-5 border-b border-r border-accent/50" />

                    <Image
                        src="/images/rinu-cool.webp"
                        alt="Rinu Cool"
                        width={200}
                        height={200}
                        className="group-hover:scale-[1.03] transition-transform duration-700"
                        priority
                    />
                    <p className="text-center mono-label text-muted-foreground/40 mt-4">exhibit_A.jpg</p>
                </div>
            </div>

            {/* Question */}
            <p
                className="text-display text-3xl text-center animate-fade-in-up opacity-0 stagger-3 animate-glitch-shift"
                style={{ rotate: '0.5deg', animationFillMode: 'forwards' }}
            >
                am I cool?
            </p>

            {/* Poll */}
            <div
                className="w-full max-w-xs animate-fade-in-up opacity-0 stagger-4"
                style={{ animationFillMode: 'forwards' }}
            >
                <CoolPoll initialData={initialPollData} />
            </div>
        </div>
    )
}
