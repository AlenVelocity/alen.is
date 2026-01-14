import { Metadata } from 'next'
import { PageTransition } from '@/components/ui/page-transition'
import { GiWeightLiftingUp } from 'react-icons/gi'

export const metadata: Metadata = {
    title: 'Lifting',
    description: 'My workout and fitness stats',
    openGraph: {
        title: 'Alen is Lifting',
        description: 'My workout and fitness stats'
    },
    alternates: { canonical: '/lifting' }
}

export default function Lifting() {
    return (
        <PageTransition>
            <div className="container max-w-2xl py-12 md:py-20">
                <div className="flex flex-col items-center justify-center py-24">
                    <GiWeightLiftingUp className="w-16 h-16 text-muted-foreground mb-6" />
                    
                    <h2 className="text-xl font-semibold mb-2">Work in Progress</h2>
                    
                    <p className="text-muted-foreground text-center max-w-md">
                        I swear I'm actually working out. The API just doesn't believe me yet.
                    </p>
                </div>
            </div>
        </PageTransition>
    )
}
