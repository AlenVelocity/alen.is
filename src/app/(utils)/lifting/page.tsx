import { Metadata } from 'next'
import { CenteredPage } from '@/components/ui/centered-page'
import { GiWeightLiftingUp } from 'react-icons/gi'

import { constructMetadata } from '@/lib/metadata'

export const metadata: Metadata = constructMetadata({
    title: 'Lifting',
    description:
        'Alen is lifting — workout logs and fitness stats, once the API is convinced any of it actually happened. Work in progress for now.',
    slug: 'lifting',
    ogTitle: 'Alen is Lifting'
})

export default function Lifting() {
    return (
        <CenteredPage>
            <GiWeightLiftingUp className="w-16 h-16 text-muted-foreground mb-6" />

            <h2 className="text-xl font-semibold mb-2">Work in Progress</h2>

            <p className="text-muted-foreground text-center max-w-md">
                I swear I'm actually working out. The API just doesn't believe me yet.
            </p>
        </CenteredPage>
    )
}
