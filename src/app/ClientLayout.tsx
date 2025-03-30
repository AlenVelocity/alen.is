'use client'

import type React from 'react'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

function MainNav() {
    const pathname = usePathname()
    const currentPath = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname
    const isMainPath = pathname === '/' || currentPath === '/experience' || currentPath === '/projects'

    return (
        <nav className={cn('gap-6', isMainPath ? 'flex' : 'hidden md:flex')}>
            <Link
                href="/experience"
                className={cn(
                    'text-sm transition-colors hover:text-foreground/80 hover:underline hover:decoration-green-500 hover:decoration-2',
                    currentPath === '/experience'
                        ? 'text-foreground underline decoration-green-500 decoration-2'
                        : 'text-foreground/60'
                )}
            >
                Experience
            </Link>
            <Link
                href="/projects"
                className={cn(
                    'text-sm transition-colors hover:text-foreground/80 hover:underline hover:decoration-green-500 hover:decoration-2',
                    currentPath === '/projects'
                        ? 'text-foreground underline decoration-green-500 decoration-2'
                        : 'text-foreground/60'
                )}
            >
                Projects
            </Link>
        </nav>
    )
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const currentPath = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname
    const isMainPath = pathname === '/' || currentPath === '/experience' || currentPath === '/projects'
    const currentPathSegment = currentPath.split('/').pop()

    return (
        <div className={inter.className}>
            <div className="flex min-h-screen flex-col">
                <header className="sticky top-0 z-50 w-full border-b bg-background">
                    <div className="container flex h-16 items-center justify-between">
                        <div className="mr-4 font-semibold flex items-center gap-1">
                            <Link href="/">Alen.Is</Link>
                            {!isMainPath && pathname !== '/' && (
                                <>
                                    <span className="text-foreground/60">/</span>
                                    <span className="capitalize">{currentPathSegment}</span>
                                </>
                            )}
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
                    </div>
                </footer>
            </div>
            <Toaster position="top-right" />
        </div>
    )
}
