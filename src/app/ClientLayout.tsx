"use client"

import type React from "react"

import { Inter } from "next/font/google"
import "./globals.css"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"] })

function MainNav() {
  const pathname = usePathname()

  return (
    <nav className="flex gap-6">
      <Link
        href="/experience"
        className={cn(
          "text-sm transition-colors hover:text-foreground/80 hover:underline hover:decoration-green-500 hover:decoration-2",
          pathname === "/experience"
            ? "text-foreground underline decoration-green-500 decoration-2"
            : "text-foreground/60",
        )}
      >
        Experience
      </Link>
      <Link
        href="/projects"
        className={cn(
          "text-sm transition-colors hover:text-foreground/80 hover:underline hover:decoration-green-500 hover:decoration-2",
          pathname === "/projects"
            ? "text-foreground underline decoration-green-500 decoration-2"
            : "text-foreground/60",
        )}
      >
        Projects
      </Link>
    </nav>
  )
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-50 w-full border-b bg-background">
            <div className="container flex h-16 items-center justify-between">
              <div className="mr-4 font-semibold">
                <Link href="/">Alen.Is</Link>
              </div>
              <MainNav />
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="border-t py-6 md:py-0">
            <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
              <p className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} Alen.Is. All rights reserved.
              </p>
              <div className="flex gap-4">
                <Link href="#" className="text-sm text-muted-foreground hover:underline hover:decoration-green-500">
                  LinkedIn
                </Link>
                <Link href="#" className="text-sm text-muted-foreground hover:underline hover:decoration-green-500">
                  GitHub
                </Link>
                <Link href="#" className="text-sm text-muted-foreground hover:underline hover:decoration-green-500">
                  Twitter
                </Link>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}

