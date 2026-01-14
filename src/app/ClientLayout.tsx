'use client'

import type React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Toaster } from 'sonner'
import { useState, useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'
import { FiSun, FiMoon, FiArrowUp, FiBriefcase, FiCode } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { posthog } from '@/components/posthog-provider'

const NAV_ITEMS = [
    { href: '/', label: 'Alen.is', icon: null },
    { href: '/experience', label: 'Experience', icon: FiBriefcase },
    { href: '/building', label: 'Projects', icon: FiCode },
]

function Navigation() {
    const pathname = usePathname()
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [showScrollBtn, setShowScrollBtn] = useState(false)
    const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    
    // Normalize path - remove trailing slash except for root
    const currentPath = pathname === '/' ? '/' : pathname.replace(/\/$/, '')
    
    // Get page name for breadcrumb (from normalized path)
    const currentPageLabel = currentPath.split('/').filter(Boolean).pop() || ''
    
    // Check if we're on a main nav page (home, experience, projects)
    const isMainNav = NAV_ITEMS.some(item => item.href === currentPath)
    
    useEffect(() => {
        setMounted(true)
        const handleScroll = () => {
            const isScrolled = window.scrollY > 50
            setScrolled(isScrolled)
            
            // Smooth delayed show/hide for scroll button
            if (isScrolled && !showScrollBtn) {
                if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
                scrollTimeoutRef.current = setTimeout(() => setShowScrollBtn(true), 100)
            } else if (!isScrolled && showScrollBtn) {
                if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
                scrollTimeoutRef.current = setTimeout(() => setShowScrollBtn(false), 100)
            }
        }
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => {
            window.removeEventListener('scroll', handleScroll)
            if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
        }
    }, [showScrollBtn])

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark'
        if (!document.startViewTransition) {
            setTheme(newTheme)
        } else {
            document.startViewTransition(() => {
                setTheme(newTheme)
            })
        }
        posthog.capture('theme_toggle', { theme: newTheme })
    }

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

    if (!mounted) return null

    return (
        <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
            <motion.nav 
                layout
                transition={{
                    layout: { type: "spring", stiffness: 500, damping: 35 }
                }}
                className={cn(
                    "flex items-center gap-1 px-2 py-1.5 rounded-full border",
                    "bg-background/80 backdrop-blur-xl border-border/50",
                    scrolled && "shadow-lg shadow-black/5 dark:shadow-black/20"
                )}
            >
                <AnimatePresence mode="popLayout" initial={false}>
                    {isMainNav ? (
                        <motion.div
                            key="main-nav"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center gap-1"
                        >
                            {NAV_ITEMS.map((item) => {
                                const isActive = currentPath === item.href
                                const isHome = item.href === '/'
                                const Icon = item.icon
                                
                                return (
                                <Link
                                        key={item.href}
                                        href={item.href}
                                    className={cn(
                                            "relative px-3 py-1.5 text-sm rounded-full transition-colors duration-200",
                                            isHome ? "font-bold" : "font-medium",
                                            isActive
                                                ? "text-background"
                                                : "text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        {/* Animated pill background */}
                                        {isActive && (
                                            <motion.span
                                                layoutId="nav-pill"
                                                className="absolute inset-0 bg-foreground rounded-full"
                                                transition={{
                                                    type: "spring",
                                                    stiffness: 400,
                                                    damping: 30
                                                }}
                                            />
                                        )}
                                        
                                        {/* Content */}
                                        <span className="relative z-10">
                                            {isHome ? (
                                                item.label
                                            ) : (
                                                <>
                                                    {Icon && <Icon className="w-4 h-4 sm:hidden" />}
                                                    <span className="hidden sm:inline">{item.label}</span>
                                                </>
                                            )}
                                        </span>
                                </Link>
                                )
                            })}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="breadcrumb"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                            >
                                <Link
                                href="/"
                                className="px-3 py-1.5 text-sm font-medium hover:text-foreground transition-colors flex items-center gap-2"
                            >
                                <span className="text-muted-foreground font-bold">Alen.is</span>
                                <span className="text-muted-foreground/50">/</span>
                                <span className="text-foreground capitalize">{currentPageLabel}</span>
                                </Link>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="w-px h-4 bg-border mx-1" />
                
                            <button
                                onClick={toggleTheme}
                    className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200"
                                aria-label="Toggle theme"
                            >
                    {theme === 'dark' ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
                            </button>

                            <div
                    className={cn(
                        "transition-all duration-300 ease-out overflow-hidden",
                        showScrollBtn ? "w-10 opacity-100" : "w-0 opacity-0"
                    )}
                            >
                                <button
                        onClick={scrollToTop}
                        className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200"
                                    aria-label="Scroll to top"
                                >
                        <FiArrowUp className="w-4 h-4" />
                                </button>
                            </div>
            </motion.nav>
        </header>
    )
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    // Hide main navbar on /lost page - it has its own custom navbar
    const showNavbar = !pathname.startsWith('/lost')
    const showFooter = pathname === '/' || pathname.startsWith('/experience') || pathname.startsWith('/building')

    return (
        <div className="min-h-screen flex flex-col">
            {showNavbar && <Navigation />}
            <main className={cn("flex-1", showNavbar && "pt-20")}>{children}</main>
            {showFooter && (
                <footer className="border-t border-border/50 py-8">
                    <div className="container max-w-4xl">
                        <p className="text-sm text-muted-foreground text-center">
                            © {new Date().getFullYear()} Alen Yohannan
                            </p>
                    </div>
                </footer>
            )}
            <Toaster position="top-right" />
        </div>
    )
}
