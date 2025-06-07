'use client'

import type React from 'react'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Toaster } from 'sonner'
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { FaSun, FaMoon, FaBriefcase, FaCode } from 'react-icons/fa'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

function DynamicIslandNav() {
    const pathname = usePathname()
    const currentPath = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname
    const isMainPath = pathname === '/' || currentPath === '/experience' || currentPath === '/projects'
    const [scrollY, setScrollY] = useState(0)
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    
    useEffect(() => {
        setMounted(true)
        const handleScroll = () => {
            setScrollY(window.scrollY)
        }
        
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const currentPathSegment = currentPath.split('/').pop()

    const toggleTheme = () => {
        if (!document.startViewTransition) {
			setTheme(theme === 'dark' ? 'light' : 'dark')
		} else {
			document.startViewTransition(() => {
				setTheme(theme === 'dark' ? 'light' : 'dark')
			})
		}
    }

    if (!mounted) {
        return null // Avoid hydration mismatch
    }

    // Smooth scroll calculations
    const maxScroll = 60 // Max scroll distance for full transition
    const scrollProgress = Math.min(scrollY / maxScroll, 1) // 0 to 1
    const isScrolled = scrollY > 10
    const isFullyScrolled = scrollProgress > 0.7 // When to fully switch layouts
    
    // Interpolated values
    const paddingX = 24 - (8 * scrollProgress) // 24px to 16px (px-6 to px-4)
    const gap = 24 - (8 * scrollProgress) // 24px to 16px (gap-6 to gap-4)
    const shadowIntensity = 0.1 + (0.1 * scrollProgress) // 0.1 to 0.2

    return (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300">
            <nav 
                className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-full py-2.5 transition-all duration-300 ease-out"
                style={{
                    paddingLeft: `${paddingX}px`,
                    paddingRight: `${paddingX}px`,
                    boxShadow: `0 ${4 + scrollProgress * 8}px ${20 + scrollProgress * 20}px rgba(0, 0, 0, ${shadowIntensity})`
                }}
            >
                {isMainPath ? (
                    // Main pages: Home, Experience, Projects
                    <div 
                        className="flex items-center transition-all duration-300 ease-out"
                        style={{ gap: `${gap}px` }}
                    >
                        <Link 
                            href="/" 
                            className="font-semibold text-white transition-all duration-300 hover:text-green-400 flex items-center gap-2"
                        >
                            <span className="text-green-400">●</span>
                            Alen.Is
                        </Link>
                        
                        {/* Navigation items - remove unused ones gradually */}
                        <div className="flex items-center gap-4">
                            {/* Experience link - hide if not current page when scrolled */}
                            {(!isFullyScrolled || currentPath === '/experience') && (
                                <div
                                    className="transition-all duration-300 ease-out"
                                    style={{ 
                                        opacity: currentPath !== '/experience' && isScrolled ? 1 - scrollProgress : 1,
                                        transform: `scale(${currentPath !== '/experience' && isScrolled ? 0.95 + (0.05 * (1 - scrollProgress)) : 1})`
                                    }}
                                >
                                    <Link
                                        href="/experience"
                                        className={cn(
                                            'text-sm transition-all duration-300 hover:text-green-400 px-3 py-1.5 rounded-full flex items-center gap-2',
                                            currentPath === '/experience'
                                                ? 'text-green-400 bg-green-400/10'
                                                : 'text-white/80 hover:bg-white/5'
                                        )}
                                    >
                                        <FaBriefcase className="w-4 h-4 sm:hidden" />
                                        <span className="hidden sm:inline">Experience</span>
                                    </Link>
                                </div>
                            )}
                            
                            {/* Projects link - hide if not current page when scrolled */}
                            {(!isFullyScrolled || currentPath === '/projects') && (
                                <div
                                    className="transition-all duration-300 ease-out"
                                    style={{ 
                                        opacity: currentPath !== '/projects' && isScrolled ? 1 - scrollProgress : 1,
                                        transform: `scale(${currentPath !== '/projects' && isScrolled ? 0.95 + (0.05 * (1 - scrollProgress)) : 1})`
                                    }}
                                >
                                    <Link
                                        href="/projects"
                                        className={cn(
                                            'text-sm transition-all duration-300 hover:text-green-400 px-3 py-1.5 rounded-full flex items-center gap-2',
                                            currentPath === '/projects'
                                                ? 'text-green-400 bg-green-400/10'
                                                : 'text-white/80 hover:bg-white/5'
                                        )}
                                    >
                                        <FaCode className="w-4 h-4 sm:hidden" />
                                        <span className="hidden sm:inline">Projects</span>
                                    </Link>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={toggleTheme}
                            className="text-white/80 hover:text-white transition-all duration-300 hover:bg-white/5 p-2 rounded-full"
                            aria-label="Toggle theme"
                        >
                            {theme === 'dark' ? <FaSun className="w-4 h-4" /> : <FaMoon className="w-4 h-4" />}
                        </button>
                    </div>
                ) : (
                    // Other pages: Alen.is / Page name, Mode toggle
                    <div className="flex items-center gap-6">
                        <Link 
                            href="/" 
                            className="font-semibold text-white transition-all duration-300 hover:text-green-400 flex items-center gap-2"
                        >
                            <span className="text-green-400">●</span>
                            Alen.Is
                            <span className="text-white/60">/</span>
                            <span className="capitalize text-green-400">{currentPathSegment}</span>
                        </Link>

                        <button
                            onClick={toggleTheme}
                            className="text-white/80 hover:text-white transition-all duration-300 hover:bg-white/5 p-2 rounded-full"
                            aria-label="Toggle theme"
                        >
                            {theme === 'dark' ? <FaSun className="w-4 h-4" /> : <FaMoon className="w-4 h-4" />}
                        </button>
                    </div>
                )}
            </nav>
        </div>
    )
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className={inter.className}>
            <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
                <DynamicIslandNav />
                <main className="flex-1 mt-20">{children}</main>
                <footer className="border-t border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
                    <div className="container mx-auto max-w-4xl px-4 py-6">
                        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                &copy; {new Date().getFullYear()} Alen.Is. All rights reserved.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
            <Toaster position="top-right" />
        </div>
    )
}
