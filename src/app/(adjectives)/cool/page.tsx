import CoolPoll from '@/components/CoolPoll'
import { api } from '@/trpc/server'
import { Metadata } from 'next'
import { unstable_rethrow } from 'next/navigation'

import { constructMetadata } from '@/lib/metadata'
import { BeamImage } from '@/components/ui/beam-image'
import { Persona } from '@/components/persona'

export const metadata: Metadata = constructMetadata({
    title: 'cool',
    description: 'Am I cool?',
    slug: 'cool',
    ogTitle: 'Alen is cool?',
    openGraph: { description: 'Am I cool?' }
})

/**
 * Alen asks the room and puts it to a vote. Ban does not ask: his line is a
 * statement and the poll under it is a formality (see CoolPoll for what he
 * makes of the count).
 *
 * Two entrance steps: the exhibit, then the question and the poll.
 */
export default async function Cool() {
    // The count is the one thing here that can fail. Without it the page still
    // renders and the poll asks again from the browser. Next's own control-flow
    // errors (the bail-out to dynamic rendering) have to pass through the catch.
    const initialPollData = await api.poll.getCoolPoll().catch((error: unknown) => {
        unstable_rethrow(error)
        return null
    })

    return (
        <div className="flex flex-col items-center justify-center gap-8 px-4 py-8 min-h-full w-full">
            <p
                className="mono-label text-muted-foreground/40 alen:tracking-[0.25em] animate-fade-in-up opacity-0 stagger-1"
                style={{ animationFillMode: 'forwards' }}
            >
                <Persona alen="// peer review" ban={<span className="struck">am I cool?</span>} />
            </p>

            {/* Polaroid. `rotate` is its own property, so it does not fight the entrance's transform */}
            <div
                className="animate-fade-in-up opacity-0 stagger-1"
                style={{ animationFillMode: 'forwards', rotate: '-2.5deg' }}
            >
                <div
                    className="bg-card border border-border/60 p-3 pb-8 relative overflow-hidden scanline-hover"
                    style={{ boxShadow: '4px 4px 0 hsl(var(--border))' }}
                >
                    {/* Corner brackets */}
                    <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-accent/50" />
                    <div className="absolute top-0 right-0 w-5 h-5 border-t border-r border-accent/50" />
                    <div className="absolute bottom-0 left-0 w-5 h-5 border-b border-l border-accent/50" />
                    <div className="absolute bottom-0 right-0 w-5 h-5 border-b border-r border-accent/50" />

                    <div className="relative w-[200px] h-[200px] mx-auto">
                        <BeamImage
                            src="/images/rinu-cool.webp"
                            alt="rinu in sunglasses"
                            sizes="200px"
                            className="object-cover"
                            priority
                        />
                    </div>
                    <p className="text-center mono-label text-muted-foreground/40 mt-4">
                        <Persona alen="exhibit_A.jpg" ban="Exhibit A. That is not him." />
                    </p>
                </div>
            </div>

            <h1
                className="text-display text-3xl ban:text-4xl text-center animate-fade-in-up opacity-0 stagger-2"
                style={{ rotate: '0.5deg', animationFillMode: 'forwards' }}
            >
                <Persona alen="am I cool?" ban="I am cool." />
            </h1>

            <div
                className="w-full max-w-xs animate-fade-in-up opacity-0 stagger-2"
                style={{ animationFillMode: 'forwards' }}
            >
                <CoolPoll initialData={initialPollData} />
            </div>
        </div>
    )
}
