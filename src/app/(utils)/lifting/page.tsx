import { Metadata } from 'next'
import { CenteredPage } from '@/components/ui/centered-page'
import { GiWeightLiftingUp } from 'react-icons/gi'

export const metadata: Metadata = {
    title: 'Lifting',
    description: 'My workout and fitness stats',
    openGraph: {
        title: 'Alen is Lifting',
        description: 'My workout and fitness stats',
        images: [{ url: '/api/og?is=lifting', width: 1200, height: 630, alt: 'alen is lifting' }]
    },
    alternates: { canonical: '/lifting' }
}

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
