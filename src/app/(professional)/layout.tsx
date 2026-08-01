import { Metadata } from 'next'

export const metadata: Metadata = {
    title: {
        default: '',
        template: '%s | Alen.is'
    },
    description: 'Human* and creator of cool stuff'
}

export default function ProfessionalLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
