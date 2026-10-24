'use client'

import React, { useRef, useEffect, useState } from 'react'
import { flushSync } from 'react-dom'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Toaster } from '@/components/ui/sonner'
import { useTheme } from 'next-themes'
import { FiBriefcase, FiCode } from 'react-icons/fi'
import { motion, AnimatePresence, MotionConfig } from 'framer-motion'
import { posthog } from '@/components/posthog-provider'
import { AlienDataStream } from '@/components/ui/alien-ambience'
import { CommandBar, openCommandBar } from '@/components/ui/command-bar'
import { UfoAbduction } from '@/components/ui/ufo-abduction'
import { DrownTrigger } from '@/components/ui/drown-trigger'

// NAV ITEMS
const NAV_ITEMS = [
    { href: '/', label: 'alen.is', icon: null },
    { href: '/working', label: 'exp', icon: FiBriefcase },
    { href: '/building', label: 'projects', icon: FiCode }
]

function humanize(slug: string) {
    return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

const SKIP_SEGMENTS = new Set(['to'])

function getBreadcrumbs(currentPath: string) {
    if (currentPath === '/') return []
    const parts = currentPath.split('/').filter(Boolean)
    const breadcrumbs = [{ href: '/', label: 'alen.is' }]
    let href = ''
    for (let i = 0; i < parts.length; i++) {
        href += '/' + parts[i]
        if (SKIP_SEGMENTS.has(parts[i].toLowerCase())) continue
        const navMatch = NAV_ITEMS.find((nav) => nav.href.replace(/^\/|\/$/, '') === parts[i].replace(/^\/|\/$/, ''))
        let label
        if (navMatch && navMatch.label !== 'alen.is') {
            label = navMatch.label
        } else {
            label = decodeURIComponent(parts[i])
        }
        breadcrumbs.push({ href, label })
    }
    return breadcrumbs
}

function Navigation() {
    const pathname = usePathname()
    const { resolvedTheme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const breadcrumbRef = useRef<HTMLElement>(null)

    const currentPath = pathname === '/' ? '/' : pathname.replace(/\/$/, '')
    const isMainNav = NAV_ITEMS.some((item) => item.href === currentPath)
    const visibleNavItems =
        scrolled && isMainNav ? NAV_ITEMS.filter((item) => item.href === '/' || item.href === currentPath) : NAV_ITEMS
    const breadcrumbs = getBreadcrumbs(currentPath)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        // setScrolled bails out when the value is unchanged, so this only re-renders at the threshold
        const handleScroll = () => setScrolled(window.scrollY > 50)
        handleScroll() // a restored scroll position shouldn't start with the full nav
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Long paths overflow the breadcrumb — keep the current page (the last crumb) in view
    useEffect(() => {
        const el = breadcrumbRef.current
        if (el) el.scrollLeft = el.scrollWidth
    }, [currentPath])

    const toggleTheme = () => {
        const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark'
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        if (!document.startViewTransition || reduceMotion) {
            setTheme(newTheme)
        } else {
            // next-themes applies the class in an effect; flushSync makes it land inside
            // the callback, otherwise the "new" snapshot is taken before anything changed
            document.startViewTransition(() => flushSync(() => setTheme(newTheme)))
        }
        posthog.capture('theme_toggle', { theme: newTheme })
    }

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

    return (
        <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-[calc(100vw-2rem)]">
            <motion.nav
                layout
                transition={{ layout: { type: 'spring', stiffness: 500, damping: 35 } }}
                className={cn(
                    'relative flex items-center gap-0 px-1 py-1 border border-border/60 max-w-full',
                    'bg-background/90 backdrop-blur-md shadow-lg shadow-background/20',
                    'rounded-sm'
                )}
            >
                {/* Every direct child carries `layout`: the nav resizes with a scale transform,
                    and only layout children get counter-scaled instead of stretched with it */}
                <AnimatePresence mode="popLayout" initial={false}>
                    {isMainNav ? (
                        <motion.div
                            key="main-nav"
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="flex items-center gap-0"
                        >
                            <AnimatePresence mode="popLayout" initial={false}>
                                {visibleNavItems.map((item) => {
                                    const isActive = currentPath === item.href
                                    const isHome = item.href === '/'

                                    return (
                                        <motion.div
                                            key={item.href}
                                            layout
                                            initial={{ opacity: 0, x: -4 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -4 }}
                                            transition={{ duration: 0.15 }}
                                        >
                                            <Link
                                                href={item.href}
                                                className={cn(
                                                    'relative px-3 py-1.5 text-xs font-mono-ui tracking-wide block whitespace-nowrap transition-colors duration-150',
                                                    isHome ? 'font-semibold' : 'font-medium',
                                                    isActive
                                                        ? 'text-accent bg-accent/8'
                                                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                                                )}
                                            >
                                                {isActive && <span className="mr-1 text-accent font-bold">//</span>}
                                                {item.label}
                                            </Link>
                                        </motion.div>
                                    )
                                })}
                            </AnimatePresence>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="breadcrumb"
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="min-w-0"
                        >
                            <nav
                                ref={breadcrumbRef}
                                aria-label="Breadcrumb"
                                className="no-scrollbar flex items-center px-3 py-1.5 text-xs font-mono-ui tracking-wide gap-2 overflow-x-auto min-w-0"
                            >
                                {breadcrumbs.map((crumb, i) => {
                                    const isLast = i === breadcrumbs.length - 1
                                    return (
                                        <React.Fragment key={crumb.href}>
                                            {i !== 0 && <span className="text-accent font-bold">/</span>}
                                            {!isLast ? (
                                                <Link
                                                    href={crumb.href}
                                                    className={cn(
                                                        'whitespace-nowrap text-muted-foreground hover:text-foreground transition-colors duration-150',
                                                        i === 0 && 'font-semibold'
                                                    )}
                                                >
                                                    {crumb.label}
                                                </Link>
                                            ) : (
                                                <span className="text-foreground whitespace-nowrap">{crumb.label}</span>
                                            )}
                                        </React.Fragment>
                                    )
                                })}
                            </nav>
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.div layout className="flex items-center shrink-0">
                    <div className="w-px h-3 bg-border mx-1 shrink-0" />

                    {/* Theme toggle — text style. Fixed width so [light]/[dark] never nudges the nav */}
                    <button
                        onClick={toggleTheme}
                        className={cn(
                            'px-2 py-1.5 text-xs font-mono-ui text-muted-foreground hover:text-accent transition-colors duration-150 whitespace-nowrap shrink-0',
                            !mounted && 'opacity-0 pointer-events-none'
                        )}
                        aria-label="Toggle theme"
                    >
                        <span className="inline-block min-w-[7ch] text-center">
                            [{resolvedTheme === 'light' ? 'dark' : 'light'}]
                        </span>
                    </button>

                    {/* Command bar trigger — the "alen.is/…" warp drive (also opens with / or Ctrl+K) */}
                    <button
                        onClick={openCommandBar}
                        className="px-2 py-1.5 text-xs font-mono-ui text-muted-foreground hover:text-accent transition-colors duration-150 whitespace-nowrap shrink-0"
                        aria-label="Open site navigator (press / or Ctrl+K)"
                        title="alen.is/… — press / to warp"
                    >
                        [/]
                    </button>
                </motion.div>

                <AnimatePresence mode="popLayout" initial={false}>
                    {scrolled && (
                        <motion.div
                            key="scroll-top"
                            layout
                            initial={{ opacity: 0, x: -4 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -4 }}
                            transition={{ duration: 0.15 }}
                        >
                            <button
                                onClick={scrollToTop}
                                className="px-2 py-1.5 text-xs font-mono-ui text-muted-foreground hover:text-accent transition-colors duration-150"
                                aria-label="Scroll to top"
                            >
                                ↑
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
    const showNavbar = !pathname.startsWith('/lost')
    const showFooter = pathname === '/' || pathname.startsWith('/working') || pathname.startsWith('/building')

    return (
        // reducedMotion="user": framer-motion drops transform/layout animation for visitors
        // who ask for reduced motion (the CSS side of that lives in globals.css)
        <MotionConfig reducedMotion="user">
            <div className="min-h-screen flex flex-col">
                <AlienDataStream />
                <CommandBar />
                <UfoAbduction />
                <DrownTrigger />
                {showNavbar && <Navigation />}
                <main className={cn('flex-1 relative z-10', showNavbar && 'pt-[var(--navbar-height)]')}>
                    {children}
                </main>
                {showFooter && (
                    <footer className="relative z-10 border-t border-dashed border-border/40 py-8">
                        <div className="container max-w-4xl">
                            <p className="text-xs font-mono-ui text-muted-foreground/50 text-center tracking-wide">
                                © {new Date().getFullYear()} alen yohannan
                            </p>
                        </div>
                    </footer>
                )}
                <Toaster position="top-right" />
            </div>
        </MotionConfig>
    )
}
