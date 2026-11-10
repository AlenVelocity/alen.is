import type { Metadata } from 'next'

// The page itself is a client component (it is a canvas), so its title lives here.
// Not indexed: this is where every missing address ends up.
export const metadata: Metadata = {
    title: 'lost',
    description: 'Alen is lost. There is nothing at that address.',
    robots: { index: false, follow: true }
}

export default function LostLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
