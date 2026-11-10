import { Metadata } from 'next'
import { PageTransition } from '@/components/ui/page-transition'
import { constructMetadata } from '@/lib/metadata'
import { EmptyState } from '@/components/ui/empty-state'
import { PageHeader } from '@/components/ui/page-header'
import { Persona } from '@/components/persona'

export const metadata: Metadata = constructMetadata({
    title: 'Thankful',
    description: "Things and people I'm glad about.",
    slug: 'thankful',
    ogTitle: 'Alen is Thankful'
})

type Gratitude = {
    /** Who or what */
    name: string
    /** Why. One line is plenty. */
    note?: string
    /** Optional link, e.g. someone's site or a project */
    link?: string
}

type GratitudeSection = {
    title: string
    /** What Ban calls the same section. Falls back to `title`. */
    ban?: string
    items: Gratitude[]
}

/**
 * Fill these in whenever. Sections render only when they have items, so you
 * can add one entry at a time and the page stays presentable throughout.
 *
 * Example:
 *   { title: 'People', items: [{ name: 'Someone', note: 'talked me out of a bad rewrite' }] }
 */
const gratitudeSections: GratitudeSection[] = [
    { title: 'People', ban: 'Creditors', items: [] },
    { title: 'Things', items: [] },
    { title: 'Moments', items: [] }
]

function GratitudeRow({ item }: { item: Gratitude }) {
    // The name over the reason on a phone, side by side with a leader from sm up
    const content = (
        <>
            <span
                className={`font-mono-ui text-sm font-medium transition-colors duration-150 ${item.link ? 'group-hover:text-accent' : ''}`}
            >
                {item.name}
                {item.link && (
                    <span className="mono-label text-muted-foreground/40 ml-2" aria-hidden="true">
                        ↗
                    </span>
                )}
            </span>
            {item.note && (
                <>
                    <span className="flex-1 border-b border-dotted border-muted-foreground/10 translate-y-[-4px] hidden md:block" />
                    <span className="mono-label text-muted-foreground/50 sm:text-right sm:ml-auto md:ml-0 sm:shrink-0 sm:max-w-[280px]">
                        {item.note}
                    </span>
                </>
            )}
        </>
    )

    const className =
        'group flex flex-col sm:flex-row sm:items-baseline gap-x-3 gap-y-0.5 py-3 border-b border-dashed border-border/40'

    return item.link ? (
        <a href={item.link} target="_blank" rel="noopener noreferrer" className={className}>
            {content}
        </a>
    ) : (
        <div className={className}>{content}</div>
    )
}

export default function Thankful() {
    const sectionsWithItems = gratitudeSections.filter((section) => section.items.length > 0)

    return (
        <PageTransition>
            <div className="container max-w-3xl py-10 md:py-14 px-4">
                {/* Header */}
                <PageHeader eyebrow="keeping track" title="Thankful" banTitle="Debts">
                    <p className="text-[0.9rem] text-muted-foreground">
                        <Persona
                            alen="Things and people I'm glad about. Adding to this as I go."
                            ban="Everyone and everything I owe. He calls it gratitude."
                        />
                    </p>
                </PageHeader>

                {/* Sections */}
                {sectionsWithItems.length > 0 ? (
                    <div className="space-y-12">
                        {sectionsWithItems.map((section) => (
                            <section key={section.title}>
                                <div className="section-label mb-3">
                                    <Persona
                                        alen={section.title.toLowerCase()}
                                        ban={(section.ban ?? section.title).toLowerCase()}
                                    />
                                </div>
                                <div>
                                    {section.items.map((item) => (
                                        <GratitudeRow key={item.name} item={item} />
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                ) : (
                    <EmptyState>
                        <Persona alen="still counting" ban="Nothing owed. I checked." />
                    </EmptyState>
                )}
            </div>
        </PageTransition>
    )
}
