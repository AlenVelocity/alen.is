'use client'

import React from 'react'
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

// Helper: Title-cases and splits slugs ("persona-5" -> "Persona 5")
function humanize(slug: string) {
    return slug
        .replace(/-/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase())
}

function getBreadcrumbs(currentPath: string) {
    if (currentPath === '/') return []

    const parts = currentPath.split('/').filter(Boolean)
    // Start with: { href: '/', label: 'Alen.is' }
    const breadcrumbs = [{ href: '/', label: 'Alen.is' }]
    let href = ''

    for (let i = 0; i < parts.length; i++) {
        href += '/' + parts[i]

        // Try to use label from NAV_ITEMS for top-level pages
        const navMatch = NAV_ITEMS.find(
            nav =>
                nav.href.replace(/^\/|\/$/g, '') ===
                parts[i].replace(/^\/|\/$/g, '')
        )
        let label
        if (navMatch && navMatch.label !== 'Alen.is') {
            label = navMatch.label
        } else {
            label = humanize(parts[i])
        }
        breadcrumbs.push({ href, label })
    }
    return breadcrumbs
}

function Navigation() {
    const pathname = usePathname()
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [showScrollBtn, setShowScrollBtn] = useState(false)
    const showScrollBtnRef = useRef(false)

    // Normalize path - remove trailing slash except for root
    const currentPath = pathname === '/' ? '/' : pathname.replace(/\/$/, '')

    // Check if we're on a main nav page (home, experience, projects)
    const isMainNav = NAV_ITEMS.some(item => item.href === currentPath)

    // Filter nav items based on scroll state and current page
    // When scrolled: hide non-current pages (but keep home always visible)
    const visibleNavItems = scrolled && isMainNav
        ? NAV_ITEMS.filter(item => item.href === '/' || item.href === currentPath)
        : NAV_ITEMS

    // Breadcrumbs for non-main-nav pages
    const breadcrumbs = getBreadcrumbs(currentPath)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 50
            setScrolled(isScrolled)

            if (isScrolled && !showScrollBtnRef.current) {
                showScrollBtnRef.current = true
                setShowScrollBtn(true)
            } else if (!isScrolled && showScrollBtnRef.current) {
                showScrollBtnRef.current = false
                setShowScrollBtn(false)
            }
        }
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

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

    return (
        <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
            <motion.nav
                layout
                transition={{
                    layout: { type: 'spring', stiffness: 500, damping: 35 }
                }}
                className={cn(
                    'flex items-center gap-1 px-2 py-1.5 rounded-xl border',
                    'bg-card/90 backdrop-blur-sm border-border paper-shadow'
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
                            <AnimatePresence mode="popLayout" initial={false}>
                                {visibleNavItems.map((item) => {
                                    const isActive = currentPath === item.href
                                    const isHome = item.href === '/'
                                    const Icon = item.icon

                                    return (
                                        <motion.div
                                            key={item.href}
                                            layout
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <Link
                                                href={item.href}
                                                className={cn(
                                                    'relative px-3 py-1.5 text-sm rounded-lg transition-colors duration-200 block whitespace-nowrap',
                                                    isHome ? 'font-bold' : 'font-medium',
                                                    isActive
                                                        ? 'text-foreground'
                                                        : 'text-muted-foreground hover:text-foreground'
                                                )}
                                            >
                                                {/* Animated underline indicator */}
                                                {isActive && (
                                                    <motion.span
                                                        layoutId="nav-pill"
                                                        className="absolute bottom-0 left-2 right-2 h-0.5 bg-accent rounded-full"
                                                        transition={{
                                                            type: 'spring',
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
                                        </motion.div>
                                    )
                                })}
                            </AnimatePresence>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="breadcrumb"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                        >
                            <nav
                                aria-label="Breadcrumb"
                                className="flex items-center px-3 py-1.5 text-sm font-medium transition-colors gap-2"
                            >
                                {breadcrumbs.map((crumb, i) => {
                                    const isLast = i === breadcrumbs.length - 1
                                    return (
                                        <React.Fragment key={crumb.href}>
                                            {i !== 0 && (
                                                <span className="text-accent/60">/</span>
                                            )}
                                            {!isLast ? (
                                                <Link
                                                    href={crumb.href}
                                                    className={cn(
                                                        i === 0
                                                            ? 'text-muted-foreground font-bold'
                                                            : 'text-muted-foreground hover:text-foreground'
                                                    )}
                                                >
                                                    {crumb.label}
                                                </Link>
                                            ) : (
                                                <span className="text-foreground capitalize">{crumb.label}</span>
                                            )}
                                        </React.Fragment>
                                    )
                                })}
                            </nav>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="w-px h-4 bg-accent/20 mx-1" />

                {mounted ? (
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200"
                        aria-label="Toggle theme"
                    >
                        {theme === 'dark' ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
                    </button>
                ) : (
                    <div className="p-2 w-8 h-8" />
                )}

                <AnimatePresence initial={false}>
                    {showScrollBtn && (
                        <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 40, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                        >
                            <button
                                onClick={scrollToTop}
                                className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200"
                                aria-label="Scroll to top"
                            >
                                <FiArrowUp className="w-4 h-4" />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
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
            <main className={cn('flex-1', showNavbar && 'pt-[var(--navbar-height)]')}>{children}</main>
            {showFooter && (
                <footer className="border-t border-dashed border-border py-8">
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
