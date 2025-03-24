import type React from "react"
import ClientLayout from "./ClientLayout"

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
  return <ClientLayout>{children}</ClientLayout>
}



import './globals.css'