import Link from 'next/link'
import { Metadata } from 'next'
import { CenteredPage } from '@/components/ui/centered-page'
import { constructMetadata } from '@/lib/metadata'
import { Persona, OnlyBan } from '@/components/persona'
import { cn } from '@/lib/utils'

export const metadata: Metadata = constructMetadata({
    title: 'definitely human',
    description: 'Alen is definitely human. Trust me.',
    slug: 'definitely-human',
    image: '/api/og?is=definitely%20human',
    ogTitle: 'Alen is definitely human',
    openGraph: { description: 'Alen is definitely human. Trust me.' }
})

/** Reassuring facts that get progressively less reassuring */
const CREDENTIALS = [
    'drinks water',
    'has a favourite persona character',
    'has human friends',
    'experiences the emotion',
    'likes klance',
    'has the normal amount of blood',
    'photosynthesizes to sumika songs'
]

const LINK =
    'mono-label inline-flex items-center px-4 py-2.5 border border-border/60 rounded-sm text-muted-foreground hover:text-accent hover:border-accent/50 transition-colors duration-200'

/**
 * Second stop of /human, /definitely-human, /alien. Alen doubles down with a
 * list. Ban answered once already, so he leaves the list up and reviews it.
 *
 * Two entrance steps: the verdict, then everything under it.
 */
export default function DefinitelyHuman() {
    return (
        <CenteredPage>
            <div className="flex flex-col items-center gap-7 text-center">
                <p
                    className="mono-label text-muted-foreground/40 alen:tracking-[0.25em] animate-fade-in-up opacity-0 stagger-1"
                    style={{ animationFillMode: 'forwards' }}
                >
                    <Persona alen="// captcha, second attempt" ban={<span className="struck">trust me</span>} />
                </p>

                <h1
                    className="text-display text-4xl md:text-6xl animate-fade-in-up opacity-0 stagger-1"
                    style={{ animationFillMode: 'forwards' }}
                >
                    <Persona alen="trust me" ban="Once was enough." />
                </h1>

                <OnlyBan as="div">
                    <p
                        className="text-[0.9rem] text-muted-foreground max-w-sm animate-fade-in-up opacity-0 stagger-2"
                        style={{ animationFillMode: 'forwards' }}
                    >
                        He wrote this list himself. Nobody who drinks water writes it down.
                    </p>
                </OnlyBan>

                {/* The list is Alen's in both modes: it is what Ban is talking about */}
                <ul
                    className="flex flex-col gap-1.5 animate-fade-in-up opacity-0 stagger-2"
                    style={{ animationFillMode: 'forwards' }}
                >
                    {CREDENTIALS.map((line) => (
                        <li key={line} className="mono-label text-muted-foreground/50 flex items-center gap-2">
                            <span className="text-accent/60">✓</span>
                            {line}
                        </li>
                    ))}
                </ul>

                <Link
                    href="/alien"
                    className={cn(LINK, 'animate-fade-in-up opacity-0 stagger-2')}
                    style={{ animationFillMode: 'forwards' }}
                >
                    <Persona alen="still not convinced?" ban="It gets worse" />
                </Link>

                <p
                    className="mono-label text-muted-foreground/25 ban:text-muted-foreground/60 animate-fade-in-up opacity-0 stagger-2"
                    style={{ animationFillMode: 'forwards' }}
                >
                    <Persona alen="(do not press it pls)" ban="(Press it.)" />
                </p>
            </div>
        </CenteredPage>
    )
}
