import { Metadata } from 'next'
import { CenteredPage } from '@/components/ui/centered-page'
import { constructMetadata } from '@/lib/metadata'
import { Persona } from '@/components/persona'
import { BanDoor } from './ban-door'

export const metadata: Metadata = {
    ...constructMetadata({
        // Capitalised, unlike the adjective pages: here the word is somebody's name
        title: 'Ban',
        description: 'Alen is Ban? Not right now.',
        slug: 'ban',
        ogTitle: 'Alen is Ban',
        openGraph: { description: 'Not right now.' }
    }),
    // The door to the other one: reachable if you know the word, not advertised
    robots: { index: false, follow: false }
}

/**
 * alen.is/ban reads "Alen is Ban", and whether that is true depends on who is
 * in. Alen's answer is "not right now", which gives the game away: they are
 * the same person. The button lets Ban out. Once he is out, the same page
 * says he is, and offers the way back.
 */
export default function Ban() {
    return (
        <CenteredPage>
            <div className="flex flex-col items-center gap-7 text-center max-w-md">
                <p className="mono-label text-muted-foreground/40 alen:tracking-[0.25em]">
                    <Persona alen="// alen is ban?" ban={<span className="struck">not right now</span>} />
                </p>

                <h1 className="text-display text-4xl md:text-6xl">
                    <Persona alen="not right now" ban="He is now." />
                </h1>

                <p className="text-[0.9rem] text-muted-foreground leading-relaxed">
                    <Persona
                        alen={
                            <>
                                <span className="ban-slip text-[1.15em]">ban</span> is the other guy. same face, no
                                manners. i keep him behind this page. please don&apos;t press that.
                            </>
                        }
                        ban="He kept me behind this page and asked you nicely not to press that. You pressed it. The site is mine until someone puts him back."
                    />
                </p>

                <BanDoor />
            </div>
        </CenteredPage>
    )
}
