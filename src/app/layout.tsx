import type React from 'react'
import { Syne, JetBrains_Mono, Grenze_Gotisch, Libre_Caslon_Text } from 'next/font/google'
import ClientLayout from './ClientLayout'
import { PERSONA_BOOT_SCRIPT } from '@/lib/persona'
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

// Ban's type: a blackletter masthead over a Caslon body. Not preloaded, so
// nobody downloads them until Ban is actually in.
const banDisplay = Grenze_Gotisch({
    variable: '--font-ban-display',
    subsets: ['latin'],
    weight: ['500', '600', '700'],
    preload: false
})

const banText = Libre_Caslon_Text({
    variable: '--font-ban-text',
    subsets: ['latin'],
    weight: ['400', '700'],
    style: ['normal', 'italic'],
    preload: false
})

export const metadata = {
    title: {
        default: "Alen's Personal Website",
        template: 'Alen is %s'
    },
    description: 'Human* and creator of cool stuff',
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
        description: 'Human* and creator of cool stuff',
        siteName: 'Alen Yohannan'
        // og:image comes from src/app/opengraph-image.tsx (next/og)
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Alen.is',
        description: 'Human* and creator of cool stuff'
    }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        // The font variables sit on <html>, not <body>: globals.css builds
        // --font-display / --font-ui out of them on :root, and a custom property
        // can only see variables defined on its own element or above it
        <html
            lang="en"
            suppressHydrationWarning
            data-scroll-behavior="smooth"
            className={`${syne.variable} ${jetbrainsMono.variable} ${banDisplay.variable} ${banText.variable}`}
        >
            <head>
                {/* Decides who is in (Alen or Ban) before anything paints. See lib/persona.ts.
                    In <head>, not <body>: posthog-js inserts its loader before the first
                    script in <body>, which would land in front of this one mid-hydration. */}
                <script dangerouslySetInnerHTML={{ __html: PERSONA_BOOT_SCRIPT }} />
            </head>
            <body className="font-mono-ui">
                {/* Images ship hidden so they can beam in; without JavaScript they just show */}
                <noscript>
                    <style>{`.beam-image img { opacity: 1 !important; }`}</style>
                </noscript>
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
