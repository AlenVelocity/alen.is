import type React from "react"
import ClientLayout from "./ClientLayout"
import { TRPCReactProvider } from '@/trpc/react'

export const metadata = {
  title: "Alen.is",
  description: "",
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