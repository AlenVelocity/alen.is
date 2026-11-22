'use client'

import React, { useRef, useEffect, useState } from 'react'
import { flushSync } from 'react-dom'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Toaster } from '@/components/ui/sonner'
import { useTheme } from 'next-themes'
import { FiBriefcase, FiCode, FiArrowUp } from 'react-icons/fi'
import { motion, AnimatePresence, MotionConfig } from 'framer-motion'
import { posthog } from '@/components/posthog-provider'
import { Plankton } from '@/components/ui/alien-ambience'
import { CommandBar, openCommandBar } from '@/components/ui/command-bar'
import { UfoAbduction } from '@/components/ui/ufo-abduction'
import { DrownTrigger } from '@/components/ui/drown-trigger'
import { CurrentCrumb } from '@/components/ui/typed-crumb'
import { Persona, OnlyAlen, OnlyBan } from '@/components/persona'
import { usePersona } from '@/hooks/use-persona'
import { switchPersona } from '@/lib/persona'

// NAV ITEMS. `ban` is what the same link is called while Ban is in.
const NAV_ITEMS = [
    { href: '/', label: 'alen.is', ban: 'ban.is', icon: null },
    { href: '/working', label: 'exp', ban: 'record', icon: FiBriefcase },
    { href: '/building', label: 'projects', ban: 'schemes', icon: FiCode }
]

/**
 * One spring for every layout move in the nav (the pill resizing, the links
 * sliding along as one drops out). The pill and what is inside it used to run
 * on different curves, so the contents arrived before the box did.
 */
const NAV_LAYOUT = { type: 'spring', stiffness: 500, damping: 35 } as const

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

    // An explicit `behavior` beats the reduced-motion rule in globals.css, so ask here
    const scrollToTop = () =>
        window.scrollTo({
            top: 0,
            behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
        })

    return (
        // layoutScroll: the header is fixed, and without it framer measures the nav in
        // page coordinates, so a navigation from a scrolled page made the pill start
        // that many pixels low and spring back up
        <motion.header layoutScroll className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-[calc(100vw-2rem)]">
            <motion.nav
                layout
                transition={{ layout: NAV_LAYOUT }}
                // Alen's is a capsule with a soft lit edge; Ban's is a ruled box (.membrane)
                className="membrane relative flex items-center gap-0 px-1.5 py-1 max-w-full overflow-hidden backdrop-blur-md rounded-full ban:rounded-none"
            >
                {/* Every direct child carries `layout`: the nav resizes with a scale transform,
                    and only layout children get counter-scaled instead of stretched with it */}
                <AnimatePresence mode="popLayout" initial={false}>
                    {isMainNav ? (
                        <motion.div
                            key="main-nav"
                            layout="position"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.15, layout: NAV_LAYOUT }}
                            className="relative flex items-center gap-0"
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
                                            transition={{ duration: 0.15, layout: NAV_LAYOUT }}
                                        >
                                            <Link
                                                href={item.href}
                                                className={cn(
                                                    'relative px-3 max-sm:px-2.5 py-1.5 text-[0.82rem] font-mono-ui block whitespace-nowrap transition-colors duration-150',
                                                    isHome ? 'font-semibold' : 'font-medium',
                                                    isActive
                                                        ? 'text-foreground ban:text-accent'
                                                        : 'text-muted-foreground hover:text-foreground'
                                                )}
                                            >
                                                <Persona alen={item.label} ban={item.ban} />
                                                {/* The page you are on is underlined. One line shared by all
                                                    three links (layoutId), so it slides to the new one
                                                    instead of blinking in place. */}
                                                {isActive && (
                                                    <motion.span
                                                        layoutId="nav-underline"
                                                        // A line of light for Alen, a ruled line for Ban
                                                        className="absolute inset-x-3 max-sm:inset-x-2.5 bottom-[3px] h-[1.5px] rounded-full bg-accent shadow-[var(--glow-accent)] ban:h-px ban:shadow-none"
                                                        transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                                                        aria-hidden="true"
                                                    />
                                                )}
                                            </Link>
                                        </motion.div>
                                    )
                                })}
                            </AnimatePresence>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="breadcrumb"
                            // "position": plain `layout` scales the box, and the crumb text in it
                            // is not a layout child, so it squashed whenever the path changed length
                            layout="position"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.15, layout: NAV_LAYOUT }}
                            className="min-w-0"
                        >
                            <nav
                                ref={breadcrumbRef}
                                aria-label="Breadcrumb"
                                className="no-scrollbar flex items-center px-3 py-1.5 text-[0.82rem] font-mono-ui gap-2 overflow-x-auto min-w-0"
                            >
                                {breadcrumbs.map((crumb, i) => {
                                    const isLast = i === breadcrumbs.length - 1
                                    return (
                                        <React.Fragment key={crumb.href}>
                                            {i !== 0 && <span className="text-accent/70">/</span>}
                                            {!isLast ? (
                                                <Link
                                                    href={crumb.href}
                                                    className={cn(
                                                        'whitespace-nowrap text-muted-foreground hover:text-foreground transition-colors duration-150',
                                                        i === 0 && 'font-semibold'
                                                    )}
                                                >
                                                    {i === 0 ? (
                                                        <Persona alen={crumb.label} ban="ban.is" />
                                                    ) : (
                                                        crumb.label
                                                    )}
                                                </Link>
                                            ) : (
                                                <CurrentCrumb text={crumb.label} />
                                            )}
                                        </React.Fragment>
                                    )
                                })}
                            </nav>
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.div
                    layout="position"
                    transition={{ layout: NAV_LAYOUT }}
                    className="flex items-center shrink-0"
                >
                    <div className="w-px h-3.5 bg-border mx-1.5 shrink-0" />

                    {/* Theme toggle — text style. Fixed width so [light]/[dark] never nudges the nav */}
                    <button
                        onClick={toggleTheme}
                        className={cn(
                            'px-2 max-sm:px-1.5 py-1.5 text-[0.82rem] font-mono-ui text-muted-foreground hover:text-foreground transition-[color,scale] duration-150 ease-out active:[scale:0.96] whitespace-nowrap shrink-0',
                            !mounted && 'opacity-0 pointer-events-none'
                        )}
                        aria-label="Toggle theme"
                    >
                        {/* Gated on `mounted`: the server cannot know the theme, and a label
                            that differs on the first client render fails hydration and
                            makes React rebuild the whole document */}
                        {/* Both words are in the box, stacked, so it is as wide as the wider
                            one in whichever face is in use and never nudges the nav */}
                        <span className="inline-grid text-center">
                            <span className="col-start-1 row-start-1 invisible" aria-hidden="true">
                                light
                            </span>
                            <span className="col-start-1 row-start-1">
                                {mounted && resolvedTheme === 'light' ? 'dark' : 'light'}
                            </span>
                        </span>
                    </button>

                    {/* Only while Ban is in: the way back. Nothing in the nav leads to him. */}
                    <OnlyBan>
                        <button
                            onClick={() => {
                                switchPersona('alen')
                                posthog.capture('persona_switch', { to: 'alen', from: 'nav' })
                            }}
                            className="px-2 max-sm:px-1.5 py-1.5 text-[0.82rem] font-mono-ui text-muted-foreground hover:text-foreground transition-[color,scale] duration-150 ease-out active:[scale:0.96] whitespace-nowrap shrink-0"
                            aria-label="Switch back to Alen"
                            title="let alen back in"
                        >
                            alen
                        </button>
                    </OnlyBan>

                    {/* Command bar trigger — the "alen.is/…" warp drive (also opens with / or Ctrl+K) */}
                    <button
                        onClick={openCommandBar}
                        className="group/key px-1.5 py-1 mr-0.5 shrink-0 transition-[scale] duration-150 ease-out active:[scale:0.94]"
                        aria-label="Open site navigator (press / or Ctrl+K)"
                        title="alen.is/… (press / to open)"
                    >
                        {/* Drawn as the key you press to open it */}
                        <kbd className="grid place-items-center w-[1.35rem] h-[1.35rem] rounded-md ban:rounded-none border border-border text-[0.72rem] leading-none font-data text-muted-foreground group-hover/key:text-foreground group-hover/key:border-muted-foreground/60 transition-colors duration-150">
                            /
                        </kbd>
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
                            transition={{ duration: 0.15, layout: NAV_LAYOUT }}
                        >
                            <button
                                onClick={scrollToTop}
                                className="px-2 py-1.5 text-[0.82rem] font-mono-ui text-muted-foreground hover:text-foreground transition-[color,scale] duration-150 ease-out active:[scale:0.94]"
                                aria-label="Scroll to top"
                            >
                                <FiArrowUp className="w-3.5 h-3.5" aria-hidden="true" />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>
        </motion.header>
    )
}

/**
 * The tab title follows whoever is in: "Alen is working" becomes "Ban is working".
 * Not on /ban, where "Alen is Ban" is the claim the page is about, and only
 * becomes true once Ban is in. "Ban is Ban" would answer nothing.
 */
function usePersonaTitle(persona: 'alen' | 'ban') {
    useEffect(() => {
        const [from, to] = persona === 'ban' ? [/\bAlen\b/g, 'Ban'] : [/\bBan\b/g, 'Alen']
        const fix = () => {
            const path = window.location.pathname.replace(/\/$/, '')
            // Nor on /drowning: that claim stays Alen's. Ban doesn't drown, and
            // "Ban is drowning" in the tab would say he does.
            if (persona === 'ban' && (path === '/ban' || path === '/drowning')) return
            const wanted = document.title.replace(from, to)
            if (wanted !== document.title) document.title = wanted
        }
        fix()
        // Next rewrites <title> on every navigation, so keep correcting it
        const observer = new MutationObserver(fix)
        observer.observe(document.head, { childList: true, subtree: true, characterData: true })
        return () => observer.disconnect()
    }, [persona])
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const persona = usePersona()
    usePersonaTitle(persona)
    const showNavbar = !pathname.startsWith('/lost')
    const showFooter = pathname === '/' || pathname.startsWith('/working') || pathname.startsWith('/building')

    return (
        // reducedMotion="user": framer-motion drops transform/layout animation for visitors
        // who ask for reduced motion (the CSS side of that lives in globals.css)
        <MotionConfig reducedMotion="user">
            <div className="min-h-screen flex flex-col">
                {/* The water and what drifts in it are Alen's. CSS hides them the moment
                    Ban is in; the unmount that follows stops the loop. */}
                <OnlyAlen as="div">{persona === 'alen' && <Plankton />}</OnlyAlen>
                <CommandBar />
                <UfoAbduction />
                <DrownTrigger />
                {showNavbar && <Navigation />}
                {/* overflow-x-clip: the home page's saucer hangs past the column, and its
                    glow would otherwise give a phone a sideways scroll. `clip` and not
                    `hidden`, which would make main a scroll container. */}
                <main className={cn('flex-1 relative z-10 overflow-x-clip', showNavbar && 'pt-[var(--navbar-height)]')}>
                    {children}
                </main>
                {showFooter && (
                    <footer className="relative z-10 border-t border-dashed border-border py-8">
                        <div className="container max-w-4xl">
                            <p className="text-xs font-mono-ui text-muted-foreground text-center">
                                <Persona
                                    alen={`© ${new Date().getFullYear()} alen yohannan`}
                                    ban={`© ${new Date().getFullYear()} ban. all rights seized.`}
                                />
                            </p>
                        </div>
                    </footer>
                )}
                <Toaster position="top-right" />
            </div>
        </MotionConfig>
    )
}
