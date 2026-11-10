import { Metadata } from 'next'
import { PageTransition } from '@/components/ui/page-transition'

import { constructMetadata } from '@/lib/metadata'
import { EmptyState } from '@/components/ui/empty-state'
import { PageHeader } from '@/components/ui/page-header'
import { Persona } from '@/components/persona'

export const metadata: Metadata = constructMetadata({
    title: 'Lifting',
    description: 'My workouts, once the API starts believing me.',
    slug: 'lifting',
    ogTitle: 'Alen is Lifting'
})

/**
 * Nothing is wired up yet (the fitness router exists, the page does not call
 * it), so this is the shared header, the one line, and an empty state that
 * says what goes here.
 */
export default function Lifting() {
    return (
        <PageTransition>
            <div className="container max-w-3xl py-10 md:py-14 px-4">
                <PageHeader eyebrow="gym log" title="Lifting" banTitle="Training">
                    <p className="text-[0.9rem] text-muted-foreground">
                        <Persona
                            alen="I swear I'm actually working out. The API just doesn't believe me yet."
                            ban="I train. The API does not believe me. That is the API's problem."
                        />
                    </p>
                </PageHeader>

                <EmptyState>
                    <Persona alen="workouts show up here when it does" ban="No records. Take my word for it." />
                </EmptyState>
            </div>
        </PageTransition>
    )
}
