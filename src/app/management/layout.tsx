import { Metadata } from 'next'

// Both pages under /management are client components and can't export metadata
// themselves, so the noindex lives here. robots.txt disallows the path too, but
// a disallow only stops the crawl — this is what keeps the URL out of results.
export const metadata: Metadata = {
    title: 'Management',
    robots: { index: false, follow: false, nocache: true }
}

export default function ManagementLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
