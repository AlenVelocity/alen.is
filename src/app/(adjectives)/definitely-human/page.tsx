import Link from 'next/link'
import { Metadata } from 'next'
import { CenteredPage } from '@/components/ui/centered-page'
import { constructMetadata } from '@/lib/metadata'

export const metadata: Metadata = constructMetadata({
    title: 'definitely human',
    description:
        'Alen is definitely human. Trust me. Here is the full list of completely normal human credentials, offered as reassurance and not at all as evidence.',
    slug: 'definitely-human',
    image: '/api/og?is=definitely%20human',
    ogTitle: 'Alen is definitely human'
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

export default function DefinitelyHuman() {
    return (
        <CenteredPage>
            <div className="flex flex-col items-center gap-7 text-center">
                {/* Eyebrow */}
                <p
                    className="mono-label text-muted-foreground/35 tracking-[0.25em] animate-fade-in-up opacity-0 stagger-1"
                    style={{ animationFillMode: 'forwards' }}
                >
                    <span data-nosnippet>// re-verified?</span>
                </p>

                {/* The insistence */}
                <h1
                    className="text-display text-4xl md:text-6xl animate-fade-in-up opacity-0 stagger-2"
                    style={{ animationFillMode: 'forwards' }}
                >
                    trust me
                </h1>

                {/* Credentials — the lady doth protest too much */}
                <ul
                    className="flex flex-col gap-1.5 animate-fade-in-up opacity-0 stagger-3"
                    style={{ animationFillMode: 'forwards' }}
                >
                    {CREDENTIALS.map((line) => (
                        <li key={line} className="mono-label text-muted-foreground/50 flex items-center gap-2">
                            <span className="text-accent/60">✓</span>
                            {line}
                        </li>
                    ))}
                </ul>

                {/* The tell */}
                <Link
                    href="/alien"
                    className="group mono-label inline-flex items-center gap-2 px-4 py-2.5 border border-border/60 rounded-sm text-muted-foreground hover:text-accent hover:border-accent/50 hover:bg-accent/5 hover:shadow-[0_0_12px_hsl(var(--accent)/0.15)] transition-all duration-200 animate-fade-in-up opacity-0 stagger-4"
                    style={{ animationFillMode: 'forwards' }}
                >
                    still not convinced?
                    <span className="text-accent/40 group-hover:text-accent transition-colors">→</span>
                </Link>

                <p
                    className="mono-label text-muted-foreground/25 animate-fade-in-up opacity-0 stagger-5"
                    style={{ animationFillMode: 'forwards' }}
                >
                    (do not press it pls)
                </p>
            </div>
        </CenteredPage>
    )
}
