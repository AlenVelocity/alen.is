import type React from 'react'
import ClientLayout from './ClientLayout'
import { TRPCReactProvider } from '@/trpc/react'
import { ThemeProvider } from '@/components/theme-provider'
import { Databuddy } from '@databuddy/sdk';

export const metadata = {
    title: {
        default: "Alen's Personal Website",
        template: 'Alen is %s'
    },
    description: 'Engineer, developer and creator of cool™ stuff',
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
        description: 'Engineer, developer and creator of cool™ stuff',
        siteName: 'Alen Yohannan',
        images: [
            {
                url: '/og.jpg',
                width: 1200,
                height: 630,
                alt: 'Alen Yohannan - Developer'
            }
        ]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Alen.is',
        description: 'Engineer, developer and creator of cool™ stuff',
        images: ['/og.jpg']
    }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                <TRPCReactProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="light"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <ClientLayout>{children}</ClientLayout>
                    </ThemeProvider>
                </TRPCReactProvider>
                <Databuddy
                    clientId="zqwjrmeJFRJrzTzszsnvV"
                    trackHashChanges={true}
                    trackInteractions={true}
                    trackEngagement={true}
                    enableBatching={true}
                />
            </body>
        </html>
    )
}

import './globals.css'
