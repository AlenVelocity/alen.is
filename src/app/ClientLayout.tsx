'use client'

import type React from 'react'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Toaster } from 'sonner'
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { FaSun, FaMoon, FaBriefcase, FaCode, FaArrowUp } from 'react-icons/fa'
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
    const gap = 16 - (4 * scrollProgress) // 16px to 12px (smaller gap)
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
                        
                        {/* Navigation items - smooth fade and scale transitions */}
                        <div className="flex items-center gap-4">
                            {/* Experience link - smooth fade out when not current */}
                            <div
                                className="transition-all duration-300 ease-out overflow-hidden"
                                style={{ 
                                    opacity: currentPath === '/experience' ? 1 : Math.max(0, 1 - (scrollProgress * 1.5)),
                                    transform: `scale(${currentPath === '/experience' ? 1 : Math.max(0.8, 1 - (scrollProgress * 0.3))})`,
                                    maxWidth: currentPath === '/experience' ? '200px' : `${Math.max(0, 200 - (scrollProgress * 200))}px`,
                                    marginRight: currentPath === '/experience' ? '0px' : `${Math.max(-16, -16 * scrollProgress)}px`
                                }}
                            >
                                <Link
                                    href="/experience"
                                    className={cn(
                                        'text-sm transition-all duration-300 hover:text-green-400 px-3 py-1.5 rounded-full flex items-center gap-2 whitespace-nowrap',
                                        currentPath === '/experience'
                                            ? 'text-green-400 bg-green-400/10'
                                            : 'text-white/80 hover:bg-white/5'
                                    )}
                                >
                                    <FaBriefcase className="w-4 h-4 sm:hidden" />
                                    <span className="hidden sm:inline">Experience</span>
                                </Link>
                            </div>
                            
                            {/* Projects link - smooth fade out when not current */}
                            <div
                                className="transition-all duration-300 ease-out overflow-hidden"
                                style={{ 
                                    opacity: currentPath === '/projects' ? 1 : Math.max(0, 1 - (scrollProgress * 1.5)),
                                    transform: `scale(${currentPath === '/projects' ? 1 : Math.max(0.8, 1 - (scrollProgress * 0.3))})`,
                                    maxWidth: currentPath === '/projects' ? '200px' : `${Math.max(0, 200 - (scrollProgress * 200))}px`,
                                    marginRight: currentPath === '/projects' ? '0px' : `${Math.max(-16, -16 * scrollProgress)}px`
                                }}
                            >
                                <Link
                                    href="/projects"
                                    className={cn(
                                        'text-sm transition-all duration-300 hover:text-green-400 px-3 py-1.5 rounded-full flex items-center gap-2 whitespace-nowrap',
                                        currentPath === '/projects'
                                            ? 'text-green-400 bg-green-400/10'
                                            : 'text-white/80 hover:bg-white/5'
                                    )}
                                >
                                    <FaCode className="w-4 h-4 sm:hidden" />
                                    <span className="hidden sm:inline">Projects</span>
                                </Link>
                            </div>
                            
                        </div>

                        <div className="flex items-center">
                            <button
                                onClick={toggleTheme}
                                className="text-white/80 hover:text-white transition-all duration-300 hover:bg-white/5 p-2 rounded-full"
                                aria-label="Toggle theme"
                            >
                                {theme === 'dark' ? <FaSun className="w-4 h-4" /> : <FaMoon className="w-4 h-4" />}
                            </button>

                            {/* Up arrow - appears when links fade out */}
                            <div
                                className="transition-all duration-300 ease-out overflow-hidden"
                                style={{ 
                                    opacity: scrollProgress > 0.5 ? Math.min(1, (scrollProgress - 0.5) * 2) : 0,
                                    transform: `scale(${scrollProgress > 0.5 ? Math.min(1, 0.8 + ((scrollProgress - 0.5) * 0.4)) : 0.8})`,
                                    width: scrollProgress > 0.5 ? '40px' : '0px',
                                    marginLeft: scrollProgress > 0.5 ? `${Math.min(gap, 8)}px` : '0px',
                                    pointerEvents: scrollProgress > 0.5 ? 'auto' : 'none'
                                }}
                            >
                                <button
                                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                    className="text-white/80 hover:text-green-400 transition-all duration-300 hover:bg-white/5 p-2 rounded-full whitespace-nowrap"
                                    aria-label="Scroll to top"
                                >
                                    <FaArrowUp className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
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

    const pathname = usePathname()
    const isLandingPage = pathname === '/'
    const isProfessional = pathname.startsWith('/experience') || pathname.startsWith('/projects')

    return (
        <div className={inter.className}>
            <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
                <DynamicIslandNav />
                <main className="flex-1 mt-20">{children}</main>
                { (isLandingPage || isProfessional) && <footer className="border-t border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
                    <div className="container mx-auto max-w-4xl px-4 py-6">
                        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                &copy; {new Date().getFullYear()} Alen.Is. All rights reserved.
                            </p>
                            <button
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-300 flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </footer>}
            </div>
            <Toaster position="top-right" />
        </div>
    )
}
