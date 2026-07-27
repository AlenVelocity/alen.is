import Link from 'next/link'
import { Metadata } from 'next'
import { CenteredPage } from '@/components/ui/centered-page'
import { constructMetadata } from '@/lib/metadata'

export const metadata: Metadata = constructMetadata({
    title: 'human',
    description: 'Alen is human. Obviously. Why would you even check?',
    slug: 'human',
    ogTitle: 'Alen is human',
    openGraph: { description: 'Alen is human. Obviously.' }
})

export default function Human() {
    return (
        <CenteredPage>
            <div className="flex flex-col items-center gap-8 text-center">
                {/* Eyebrow */}
                <p
                    className="mono-label text-muted-foreground/35 tracking-[0.25em] animate-fade-in-up opacity-0 stagger-1"
                    style={{ animationFillMode: 'forwards' }}
                >
                    // species: verified?
                </p>

                {/* The claim */}
                <h1
                    className="text-display text-4xl md:text-6xl animate-fade-in-up opacity-0 stagger-2"
                    style={{ animationFillMode: 'forwards' }}
                >
                    yes, i am
                </h1>

                <p
                    className="text-[0.9rem] text-muted-foreground max-w-sm animate-fade-in-up opacity-0 stagger-3"
                    style={{ animationFillMode: 'forwards' }}
                >
                    i like uh, games and stuff, just like you and every other human. I also breathe the normal air and everything.
                </p>

                {/* The doubt */}
                <Link
                    href="/definitely-human"
                    className="group mono-label inline-flex items-center gap-2 px-4 py-2.5 border border-border/60 rounded-sm text-muted-foreground hover:text-accent hover:border-accent/50 hover:bg-accent/5 hover:shadow-[0_0_12px_hsl(var(--accent)/0.15)] transition-all duration-200 animate-fade-in-up opacity-0 stagger-4"
                    style={{ animationFillMode: 'forwards' }}
                >
                    trust me!
                    <span className="text-accent/40 group-hover:text-accent transition-colors">→</span>
                </Link>
            </div>
        </CenteredPage>
    )
}
