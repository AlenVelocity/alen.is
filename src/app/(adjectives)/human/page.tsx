import Link from 'next/link'
import { Metadata } from 'next'
import { CenteredPage } from '@/components/ui/centered-page'
import { constructMetadata } from '@/lib/metadata'
import { Persona } from '@/components/persona'
import { cn } from '@/lib/utils'

export const metadata: Metadata = constructMetadata({
    title: 'human',
    description: 'Alen is human. Obviously. Why would you even check?',
    slug: 'human',
    ogTitle: 'Alen is human',
    openGraph: { description: 'Alen is human. Obviously.' }
})

const LINK =
    'mono-label inline-flex items-center px-4 py-2.5 border border-border/60 rounded-sm text-muted-foreground hover:text-accent hover:border-accent/50 transition-colors duration-200'

/**
 * First stop of /human, /definitely-human, /alien. Alen insists and gives
 * himself away doing it. Ban says the least he can get away with.
 *
 * Two entrance steps: the verdict, then everything under it.
 */
export default function Human() {
    return (
        <CenteredPage>
            <div className="flex flex-col items-center gap-8 text-center">
                <p
                    className="mono-label text-muted-foreground/40 alen:tracking-[0.25em] animate-fade-in-up opacity-0 stagger-1"
                    style={{ animationFillMode: 'forwards' }}
                >
                    <Persona alen="// captcha" ban={<span className="struck">yes, i am</span>} />
                </p>

                <h1
                    className="text-display text-4xl md:text-6xl animate-fade-in-up opacity-0 stagger-1"
                    style={{ animationFillMode: 'forwards' }}
                >
                    <Persona alen="yes, i am" ban="On paper." />
                </h1>

                <p
                    className="text-[0.9rem] text-muted-foreground max-w-sm animate-fade-in-up opacity-0 stagger-2"
                    style={{ animationFillMode: 'forwards' }}
                >
                    <Persona
                        alen="i like uh, games and stuff, just like you and every other human. I also breathe the normal air and everything."
                        ban="He told you he breathes the normal air. I have the paperwork, and it stays in the drawer."
                    />
                </p>

                <Link
                    href="/definitely-human"
                    className={cn(LINK, 'animate-fade-in-up opacity-0 stagger-2')}
                    style={{ animationFillMode: 'forwards' }}
                >
                    <Persona alen="trust me" ban="He made a second page" />
                </Link>
            </div>
        </CenteredPage>
    )
}
