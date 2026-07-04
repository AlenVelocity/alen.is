import type React from 'react'
import { Syne, JetBrains_Mono } from 'next/font/google'
import ClientLayout from './ClientLayout'
import { TRPCReactProvider } from '@/trpc/react'
import { ThemeProvider } from '@/components/theme-provider'
import { PostHogProvider } from '@/components/posthog-provider'
import { Databuddy } from '@databuddy/sdk'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const syne = Syne({
    variable: '--font-syne',
    subsets: ['latin'],
    weight: ['400', '500', '600', '700', '800']
})

const jetbrainsMono = JetBrains_Mono({
    variable: '--font-jetbrains-mono',
    subsets: ['latin'],
    weight: ['400', '500', '600', '700']
})

export const metadata = {
    title: {
        default: "Alen's Personal Website",
        template: 'Alen is %s'
    },
    description: 'Engineer, developer and creator of cool stuff',
    metadataBase: new URL('https://alen.is'),
    manifest: '/manifest.json',
    applicationName: 'Alen.is',
    appleWebApp: {
        capable: true,
        title: 'Alen.is',
        statusBarStyle: 'default'
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-video-preview': -1,
            'max-snippet': -1
        }
    },
    alternates: {
        canonical: '/'
    },
    keywords: [
        'Alen Yohannan',
        'developer',
        'engineer',
        'Frappe',
        'web development',
        'NextJS',
        'TypeScript',
        'Rust',
        'AI',
        'LLM'
    ],
    authors: [{ name: 'Alen Yohannan' }],
    creator: 'Alen Yohannan',
    publisher: 'Alen Yohannan',
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://alen.is',
        title: 'Alen.is',
        description: 'Engineer, developer and creator of cool stuff',
        siteName: 'Alen Yohannan'
        // og:image comes from src/app/opengraph-image.tsx (next/og)
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Alen.is',
        description: 'Engineer and creator of cool stuff'
    }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${syne.variable} ${jetbrainsMono.variable} font-mono-ui`}>
                <PostHogProvider>
                    <TRPCReactProvider>
                        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
                            <ClientLayout>{children}</ClientLayout>
                        </ThemeProvider>
                    </TRPCReactProvider>
                </PostHogProvider>
                <Databuddy
                    clientId="zqwjrmeJFRJrzTzszsnvV"
                    trackHashChanges={true}
                    trackInteractions={true}
                    trackEngagement={true}
                    enableBatching={true}
                />
                <Analytics />
            </body>
        </html>
    )
}
