import { Metadata } from 'next'

export const metadata: Metadata = {
    title: {
        default: '',
        template: '%s | Alen.is'
    },
    description:
        'Alen Yohannan — software engineer, human* and creator of cool stuff. Experience, projects and everything else worth putting on a page.'
}

export default function ProfessionalLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
