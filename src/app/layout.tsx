import type React from "react"
import ClientLayout from "./ClientLayout"
import { TRPCReactProvider } from '@/trpc/react'

export const metadata = {
  title: "Portfolio",
  description: "My professional portfolio",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <TRPCReactProvider>
          <ClientLayout>{children}</ClientLayout>
        </TRPCReactProvider>
      </body>
    </html>
  )
}

import './globals.css'