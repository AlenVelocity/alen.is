import { Metadata } from 'next'
import { CenteredPage } from '@/components/ui/centered-page'
import { GiWeightLiftingUp } from 'react-icons/gi'

export const metadata: Metadata = {
    title: 'lifting',
    description: 'Alen is lifting weights. My workout and fitness stats coming soon to the app.',
    openGraph: {
        title: 'Alen is lifting',
        description: 'Alen is lifting weights. My workout and fitness stats coming soon.'
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
