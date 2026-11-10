import Link from 'next/link'
import { Metadata } from 'next'
import { CenteredPage } from '@/components/ui/centered-page'
import { constructMetadata } from '@/lib/metadata'
import { Persona } from '@/components/persona'
import { EvilVerdict } from './evil-verdict'

export const metadata: Metadata = {
    ...constructMetadata({
        title: 'evil',
        description: 'Alen is evil? He returns the shopping cart.',
        slug: 'evil',
        ogTitle: 'Alen is evil',
        openGraph: { description: 'He returns the shopping cart.' }
    }),
    // Unlisted. It is the only page that points at /ban
    robots: { index: false, follow: false }
}

const LINK =
    'mono-label inline-flex items-center px-4 py-2.5 border border-border/60 rounded-sm text-muted-foreground hover:text-accent hover:border-accent/50 transition-colors duration-200'

/**
 * The two of them disagree about this one. Alen says no, and the answer slips
 * now and then (see EvilVerdict). Ban does not slip.
 */
export default function Evil() {
    return (
        <CenteredPage>
            <div className="flex flex-col items-center gap-7 text-center max-w-md">
                <p className="mono-label text-muted-foreground/40 alen:tracking-[0.25em]">
                    <Persona alen="// character reference" ban={<span className="struck">no</span>} />
                </p>

                <h1 className="text-display text-5xl md:text-7xl">
                    <EvilVerdict />
                </h1>

                <p className="text-[0.9rem] text-muted-foreground leading-relaxed">
                    <Persona
                        alen="i return the shopping cart. i thank the bus driver. i only break prod by accident."
                        ban="I break prod on purpose. I take the last one and put the empty box back. He told you to ask anyone, and you asked me."
                    />
                </p>

                <Link href="/ban" className={LINK}>
                    <Persona alen="ask anyone" ban="Ask him yourself" />
                </Link>
            </div>
        </CenteredPage>
    )
}
