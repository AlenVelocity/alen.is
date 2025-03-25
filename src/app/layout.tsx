import type React from "react"
import ClientLayout from "./ClientLayout"
import { TRPCReactProvider } from '@/trpc/react'

export const metadata = {
  title: "Alen's Personal Website",
  description: "Engineer, developer and creator of cool stuff",
  metadataBase: new URL('https://alen.is'),
  manifest: "/manifest.json",
  themeColor: "#000000",
  viewport: "width=device-width, initial-scale=1, shrink-to-fit=no",
  applicationName: "Alen.is",
  appleWebApp: {
    capable: true,
    title: "Alen.is",
    statusBarStyle: "default",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-video-preview': -1,
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/',
  },
  keywords: ['Alen Yohannan', 'developer', 'engineer', 'Frappe', 'web development', 'NextJS', 'TypeScript', 'Rust', 'AI', 'LLM'],
  authors: [{ name: 'Alen Yohannan' }],
  creator: 'Alen Yohannan',
  publisher: 'Alen Yohannan',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://alen.is',
    title: "Alen.is",
    description: "Engineer, developer and creator of cool stuff",
    siteName: 'Alen Yohannan',
    images: [
      { 
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Alen Yohannan - Developer"
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Alen.is",
    description: "Engineer, developer and creator of cool stuff",
    images: ["/og.jpg"],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" href="/Better Signature Font.otf" as="font" type="font/otf" crossOrigin="anonymous" />
        <link rel="preload" href="/Better Signature Font.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body>
        <TRPCReactProvider>
          <ClientLayout>{children}</ClientLayout>
        </TRPCReactProvider>
      </body>
    </html>
  )
}

import './globals.css'