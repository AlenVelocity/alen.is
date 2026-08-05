import { Metadata } from 'next'
import { PageTransition } from '@/components/ui/page-transition'
import { constructMetadata } from '@/lib/metadata'

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
            <span className="font-mono-ui text-sm font-medium transition-colors duration-150 group-hover:text-accent">
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
            <div className="container max-w-2xl py-12 md:py-20 px-4">
                {/* Header */}
                <div className="mb-16">
                    <p
                        className="mono-label text-muted-foreground/50 mb-4 animate-fade-in-up opacity-0 stagger-1"
                        style={{ animationFillMode: 'forwards' }}
                    >
                        // keeping track
                    </p>
                    <h1
                        className="text-display text-5xl md:text-6xl mb-3 animate-fade-in-up opacity-0 stagger-2"
                        style={{ animationFillMode: 'forwards' }}
                    >
                        Thankful
                    </h1>
                    <p
                        className="text-[0.9rem] text-muted-foreground animate-fade-in-up opacity-0 stagger-3"
                        style={{ animationFillMode: 'forwards' }}
                    >
                        Things and people I&apos;m glad about. Adding to this as I go.
                    </p>
                </div>

                {/* Sections */}
                {sectionsWithItems.length > 0 ? (
                    <div className="space-y-12">
                        {sectionsWithItems.map((section, i) => (
                            <section
                                key={section.title}
                                className={`animate-fade-in-up opacity-0 stagger-${Math.min(i + 4, 6)}`}
                                style={{ animationFillMode: 'forwards' }}
                            >
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
                    <p
                        className="mono-label text-muted-foreground/40 animate-fade-in-up opacity-0 stagger-4"
                        style={{ animationFillMode: 'forwards' }}
                    >
                        // still counting
                        <span className="animate-blink text-accent ml-1">▌</span>
                    </p>
                )}
            </div>
        </PageTransition>
    )
}
