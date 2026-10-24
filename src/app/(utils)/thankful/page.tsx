import { Metadata } from 'next'
import { PageTransition } from '@/components/ui/page-transition'
import { constructMetadata } from '@/lib/metadata'
import { EmptyState } from '@/components/ui/empty-state'
import { PageHeader } from '@/components/ui/page-header'

export const metadata: Metadata = constructMetadata({
    title: 'Thankful',
    description: "Things and people I'm glad about",
    slug: 'thankful',
    ogTitle: 'Alen is Thankful',
    openGraph: { description: "Things and people I'm glad about" }
})

type Gratitude = {
    /** Who or what */
    name: string
    /** Why — one line is plenty */
    note?: string
    /** Optional link, e.g. someone's site or a project */
    link?: string
}

type GratitudeSection = {
    title: string
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
    { title: 'People', items: [] },
    { title: 'Things', items: [] },
    { title: 'Moments', items: [] }
]

function GratitudeRow({ item }: { item: Gratitude }) {
    const content = (
        <>
            <span className="font-mono-ui text-sm font-medium transition-colors duration-150 group-hover:text-accent mr-auto md:mr-0">
                {item.name}
            </span>
            {item.note && (
                <>
                    <span className="flex-1 border-b border-dotted border-muted-foreground/10 translate-y-[-4px] hidden md:block" />
                    <span className="mono-label text-muted-foreground/45 text-right hidden sm:block shrink-0 max-w-[280px]">
                        {item.note}
                    </span>
                </>
            )}
        </>
    )

    const className =
        'group flex items-baseline gap-3 py-3 border-b border-dashed border-border/40 hover:border-accent/30 transition-colors duration-150'

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
                <PageHeader eyebrow="keeping track" title="Thankful">
                    <p className="text-[0.9rem] text-muted-foreground">
                        Things and people I&apos;m glad about. Adding to this as I go.
                    </p>
                </PageHeader>

                {/* Sections */}
                {sectionsWithItems.length > 0 ? (
                    <div className="space-y-12">
                        {sectionsWithItems.map((section, i) => (
                            <section key={section.title}>
                                <div className="section-label mb-3">{section.title.toLowerCase()}</div>
                                <div>
                                    {section.items.map((item) => (
                                        <GratitudeRow key={item.name} item={item} />
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                ) : (
                    <EmptyState>still counting</EmptyState>
                )}
            </div>
        </PageTransition>
    )
}
