'use client'

import React, { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Toaster } from 'sonner'
import { useTheme } from 'next-themes'
import { FiBriefcase, FiCode } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { posthog } from '@/components/posthog-provider'
import { AlienDataStream } from '@/components/ui/alien-ambience'

// NAV ITEMS
const NAV_ITEMS = [
    { href: '/', label: 'alen.is', icon: null },
    { href: '/working', label: 'exp', icon: FiBriefcase },
    { href: '/building', label: 'projects', icon: FiCode },
]

function humanize(slug: string) {
    return slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
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
        const navMatch = NAV_ITEMS.find(
            nav => nav.href.replace(/^\/|\/$/, '') === parts[i].replace(/^\/|\/$/, '')
        )
        let label
        if (navMatch && navMatch.label !== 'alen.is') {
            label = navMatch.label
        } else {
            label = humanize(decodeURIComponent(parts[i]))
        }
        breadcrumbs.push({ href, label })
    }
    return breadcrumbs
}

function MarqueeBreadcrumb({ children }: { children: React.ReactNode }) {
    const outerRef = useRef<HTMLSpanElement>(null)
    const innerRef = useRef<HTMLSpanElement>(null)
    const [shouldMarquee, setShouldMarquee] = useState(false)
    const [marqueeOffset, setMarqueeOffset] = useState(0)

    useEffect(() => {
        if (!outerRef.current || !innerRef.current) { setShouldMarquee(false); return }
        const outer = outerRef.current
        const inner = innerRef.current
        const overflow = inner.scrollWidth - outer.offsetWidth
        if (overflow > 4) {
            setShouldMarquee(true)
            setMarqueeOffset(overflow)
        } else {
            setShouldMarquee(false)
        }
    }, [children])

    return (
        <span
            ref={outerRef}
            className={cn(
                'relative max-w-[8rem] sm:max-w-[10rem] overflow-hidden inline-block align-middle',
                shouldMarquee && 'will-change-transform'
            )}
            tabIndex={0}
        >
            <span
                ref={innerRef}
                className="block whitespace-nowrap"
                style={
                    shouldMarquee
                        ? {
                            animation: 'breadcrumb-marquee 4s ease-in-out infinite',
                            '--marquee-offset': `-${marqueeOffset}px`,
                        } as React.CSSProperties
                        : undefined
                }
                aria-label={typeof children === 'string' ? children : undefined}
            >
                {children}
            </span>
        </span>
    )
}

// Custom cursor blob
function CursorBlob() {
    const blobRef = useRef<HTMLDivElement>(null)
    const pos = useRef({ x: -100, y: -100 })
    const curr = useRef({ x: -100, y: -100 })
    const rafRef = useRef<number | null>(null)
    const [hovering, setHovering] = useState(false)

    useEffect(() => {
        document.body.classList.add('custom-cursor')

        const onMove = (e: MouseEvent) => {
            pos.current = { x: e.clientX, y: e.clientY }
        }

        const onEnter = () => setHovering(true)
        const onLeave = () => setHovering(false)

        const addListeners = () => {
            document.querySelectorAll('a, button, [role="button"]').forEach(el => {
                el.addEventListener('mouseenter', onEnter)
                el.addEventListener('mouseleave', onLeave)
            })
        }

        const observer = new MutationObserver(addListeners)
        observer.observe(document.body, { childList: true, subtree: true })
        addListeners()

        const animate = () => {
            curr.current.x += (pos.current.x - curr.current.x) * 0.12
            curr.current.y += (pos.current.y - curr.current.y) * 0.12
            if (blobRef.current) {
                blobRef.current.style.transform = `translate(${curr.current.x}px, ${curr.current.y}px) translate(-50%, -50%)`
            }
            rafRef.current = requestAnimationFrame(animate)
        }

        document.addEventListener('mousemove', onMove)
        rafRef.current = requestAnimationFrame(animate)

        return () => {
            document.body.classList.remove('custom-cursor')
            document.removeEventListener('mousemove', onMove)
            observer.disconnect()
            if (rafRef.current) cancelAnimationFrame(rafRef.current)
        }
    }, [])

    return (
        <div
            ref={blobRef}
            className={cn('cursor-blob hidden lg:block', hovering && 'is-hovering')}
            aria-hidden="true"
        />
    )
}

function Navigation() {
    const pathname = usePathname()
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [showScrollBtn, setShowScrollBtn] = useState(false)
    const showScrollBtnRef = useRef(false)

    const currentPath = pathname === '/' ? '/' : pathname.replace(/\/$/, '')
    const isMainNav = NAV_ITEMS.some(item => item.href === currentPath)
    const visibleNavItems = scrolled && isMainNav
        ? NAV_ITEMS.filter(item => item.href === '/' || item.href === currentPath)
        : NAV_ITEMS
    const breadcrumbs = getBreadcrumbs(currentPath)

    useEffect(() => { setMounted(true) }, [])

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
            document.startViewTransition(() => { setTheme(newTheme) })
        }
        posthog.capture('theme_toggle', { theme: newTheme })
    }

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

    return (
        <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
            <motion.nav
                layout
                transition={{ layout: { type: 'spring', stiffness: 500, damping: 35 } }}
                className={cn(
                    'flex items-center gap-0 px-1 py-1 border border-border/60',
                    'bg-background/90 backdrop-blur-md sharp-shadow',
                    'rounded-sm'
                )}
            >
                <AnimatePresence mode="popLayout" initial={false}>
                    {isMainNav ? (
                        <motion.div
                            key="main-nav"
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
                                                    'relative px-3 py-1.5 text-xs font-mono-ui tracking-wide block whitespace-nowrap transition-all duration-150',
                                                    isHome ? 'font-semibold' : 'font-medium',
                                                    isActive
                                                        ? 'text-accent bg-accent/8'
                                                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                                                )}
                                            >
                                                {isActive && (
                                                    <span className="mr-1 text-accent font-bold">//</span>
                                                )}
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
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                        >
                            <nav
                                aria-label="Breadcrumb"
                                className="flex items-center px-3 py-1.5 text-xs font-mono-ui tracking-wide gap-2"
                            >
                                {breadcrumbs.map((crumb, i) => {
                                    const isLast = i === breadcrumbs.length - 1
                                    return (
                                        <React.Fragment key={crumb.href}>
                                            {i !== 0 && (
                                                <span className="text-accent font-bold">/</span>
                                            )}
                                            {!isLast ? (
                                                <Link
                                                    href={crumb.href}
                                                    className={cn(
                                                        i === 0
                                                            ? 'text-muted-foreground font-semibold hover:text-foreground'
                                                            : 'text-muted-foreground hover:text-foreground'
                                                    )}
                                                    tabIndex={0}
                                                >
                                                    <MarqueeBreadcrumb>{crumb.label}</MarqueeBreadcrumb>
                                                </Link>
                                            ) : (
                                                <span className="text-foreground">
                                                    <MarqueeBreadcrumb>{crumb.label}</MarqueeBreadcrumb>
                                                </span>
                                            )}
                                        </React.Fragment>
                                    )
                                })}
                            </nav>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="w-px h-3 bg-border mx-1" />

                {/* Theme toggle — text style */}
                {mounted ? (
                    <button
                        onClick={toggleTheme}
                        className="px-2 py-1.5 text-xs font-mono-ui text-muted-foreground hover:text-accent transition-colors duration-150 whitespace-nowrap"
                        aria-label="Toggle theme"
                    >
                        [{theme === 'dark' ? 'light' : 'dark'}]
                    </button>
                ) : (
                    <div className="px-2 py-1.5 text-xs opacity-0 select-none">[dark]</div>
                )}

                <AnimatePresence initial={false}>
                    {showScrollBtn && (
                        <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 'auto', opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="overflow-hidden"
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
        <div className="min-h-screen flex flex-col">
            <AlienDataStream />
            <CursorBlob />
            {showNavbar && <Navigation />}
            <main className={cn('flex-1 relative z-10', showNavbar && 'pt-[var(--navbar-height)]')}>{children}</main>
            {showFooter && (
                <footer className="relative z-10 border-t border-dashed border-border/40 py-8">
                    <div className="container max-w-4xl">
                        <p className="text-xs font-mono-ui text-muted-foreground/50 text-center tracking-wide">
                            © {new Date().getFullYear()} alen yohannan
                            <span className="animate-blink ml-0.5">_</span>
                        </p>
                    </div>
                </footer>
            )}
            <Toaster position="top-right" />
        </div>
    )
}
