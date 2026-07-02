'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { SITE_ROUTES } from '@/lib/routes'
import { posthog } from '@/components/posthog-provider'
import { ufoWarp } from '@/components/ui/ufo-abduction'
import { isMinimalMotion, setMinimalMotion } from '@/lib/motion-pref'

/**
 * "alen.is/…" command bar — the site's alien warp drive.
 *
 * The domain reads as a sentence ("alen is cool", "alen is coding"), so instead
 * of a conventional menu this bar lets visitors finish the sentence themselves:
 * summon it with `/` or Ctrl/⌘+K, type a suffix (with ghost autocomplete), and
 * warp to that context. Implements the WAI-ARIA combobox pattern: the input is
 * a combobox controlling a listbox, with aria-activedescendant tracking the
 * highlighted option so screen readers follow keyboard navigation.
 */

/** Custom event other components (e.g. the navbar trigger) dispatch to summon the bar */
export const OPEN_COMMAND_BAR_EVENT = 'alen:open-command-bar'

export function openCommandBar() {
    if (typeof window !== 'undefined') window.dispatchEvent(new Event(OPEN_COMMAND_BAR_EVENT))
}

/** True when the keystroke originated inside an editable element, where `/` means typing, not summoning */
function isTypingTarget(el: EventTarget | null) {
    if (!(el instanceof HTMLElement)) return false
    return el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable
}

/** A listed route, or the visitor's own typed guess (`mystery`) offered at the end of the list */
interface CommandResult {
    slug: string
    description: string
    group: string
    mystery?: boolean
}

export function CommandBar() {
    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState('')
    const [activeIndex, setActiveIndex] = useState(0)
    const inputRef = useRef<HTMLInputElement>(null)
    const restoreFocusRef = useRef<HTMLElement | null>(null)

    // Prefix matches rank above substring/description matches so ghost completion stays
    // intuitive. Whatever the visitor typed is always offered as a final "mystery" entry —
    // it might be a page, it might not; the list won't spoil which.
    const results = useMemo<CommandResult[]>(() => {
        const q = query.trim().toLowerCase()
        if (!q) return SITE_ROUTES
        const starts = SITE_ROUTES.filter((r) => r.slug.startsWith(q))
        const rest = SITE_ROUTES.filter(
            (r) => !r.slug.startsWith(q) && (r.slug.includes(q) || r.description.toLowerCase().includes(q))
        )
        const matches: CommandResult[] = [...starts, ...rest]
        if (!matches.some((r) => r.slug === q)) {
            matches.push({
                slug: q,
                description: 'could be a page… or not. one way to find out',
                group: '???',
                mystery: true
            })
        }
        return matches
    }, [query])

    // "fx" toggle: persisted minimal-motion preference (skips the UFO warp transition)
    const [minimalFx, setMinimalFx] = useState(false)
    useEffect(() => {
        if (open) setMinimalFx(isMinimalMotion())
    }, [open])
    const toggleFx = () => {
        const next = !minimalFx
        setMinimalFx(next)
        setMinimalMotion(next)
        posthog.capture('minimal_motion_toggled', { minimal: next })
    }

    // Ghost autocomplete: the untyped remainder of the best prefix match, accepted with Tab or →
    const ghost = useMemo(() => {
        const q = query.trim().toLowerCase()
        if (!q) return ''
        const best = results[0]
        return best && best.slug.startsWith(q) ? best.slug.slice(q.length) : ''
    }, [query, results])

    const active = results[activeIndex]

    const close = useCallback(() => {
        setOpen(false)
        restoreFocusRef.current?.focus?.()
    }, [])

    const navigate = useCallback((slug: string) => {
        setOpen(false)
        posthog.capture('command_bar_navigate', { slug })
        // Warp via the UFO page transition — it falls back to router.push internally
        ufoWarp(`/${slug}`)
    }, [])

    // Global summon shortcuts: `/`, Ctrl/⌘+K, and the custom event from the navbar trigger
    useEffect(() => {
        const summon = () => {
            restoreFocusRef.current = document.activeElement as HTMLElement | null
            setQuery('')
            setActiveIndex(0)
            setOpen(true)
        }
        const onKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault()
                if (open) setOpen(false)
                else summon()
                return
            }
            if (e.key === '/' && !open && !e.ctrlKey && !e.metaKey && !e.altKey && !isTypingTarget(e.target)) {
                e.preventDefault()
                summon()
            }
        }
        const onSummonEvent = () => summon()
        window.addEventListener('keydown', onKeyDown)
        window.addEventListener(OPEN_COMMAND_BAR_EVENT, onSummonEvent)
        return () => {
            window.removeEventListener('keydown', onKeyDown)
            window.removeEventListener(OPEN_COMMAND_BAR_EVENT, onSummonEvent)
        }
    }, [open])

    // While open: focus the input and lock body scroll behind the overlay
    useEffect(() => {
        if (!open) return
        inputRef.current?.focus()
        const original = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = original
        }
    }, [open])

    // Reset highlight to the top whenever the query changes
    useEffect(() => setActiveIndex(0), [query])

    // Keep the highlighted option visible while arrowing through a long list
    useEffect(() => {
        if (!open || !active) return
        document.getElementById(`cmdbar-opt-${active.slug}`)?.scrollIntoView({ block: 'nearest' })
    }, [open, active, activeIndex])

    const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault()
                setActiveIndex((i) => (results.length ? (i + 1) % results.length : 0))
                break
            case 'ArrowUp':
                e.preventDefault()
                setActiveIndex((i) => (results.length ? (i - 1 + results.length) % results.length : 0))
                break
            case 'Tab':
            case 'ArrowRight':
                // Accept the ghost completion only when the caret is at the end
                if (ghost && inputRef.current?.selectionStart === query.length) {
                    e.preventDefault()
                    setQuery(query + ghost)
                }
                break
            case 'Enter':
                e.preventDefault()
                if (active) navigate(active.slug)
                else if (query.trim()) navigate(query.trim().toLowerCase())
                break
            case 'Escape':
                e.preventDefault()
                close()
                break
        }
    }

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-[90] flex items-start justify-center px-4 pt-[18vh]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Site navigator"
                >
                    {/* Backdrop — click to dismiss */}
                    <div
                        className="absolute inset-0 bg-background/70 backdrop-blur-sm"
                        onClick={close}
                        aria-hidden="true"
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ opacity: 0, y: -14, scale: 0.98, filter: 'blur(6px)' }}
                        animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: -8, scale: 0.98, filter: 'blur(4px)' }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        className={cn(
                            'relative w-full max-w-lg clip-notch border border-accent/30 bg-background/95',
                            'backdrop-blur-md shadow-[0_0_0_1px_hsl(var(--accent)/0.1),0_0_40px_hsl(var(--accent)/0.12),0_24px_60px_rgba(0,0,0,0.45)]'
                        )}
                    >
                        {/* Live sentence preview — the whole point of the domain */}
                        <p className="px-4 pt-3 mono-label text-muted-foreground/50 select-none" aria-live="polite">
                            <span className="text-accent">&gt;</span> alen is{' '}
                            <span className="text-foreground">{active?.slug ?? (query.trim() || '…')}</span>
                        </p>

                        {/* Input row: fixed "alen.is/" prefix + query + ghost completion */}
                        <div className="flex items-center gap-0 px-4 py-3 border-b border-border/60">
                            <span className="font-mono-ui text-sm text-accent glow-text select-none shrink-0">
                                alen.is/
                            </span>
                            <div className="relative flex-1 min-w-0">
                                {/* Ghost layer sits behind the transparent-background input; mono font keeps them aligned */}
                                <div
                                    className="absolute inset-0 flex items-center font-mono-ui text-sm pointer-events-none whitespace-pre"
                                    aria-hidden="true"
                                >
                                    <span className="invisible">{query}</span>
                                    <span className="text-muted-foreground/40">{ghost}</span>
                                </div>
                                <input
                                    ref={inputRef}
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value.replace(/\s/g, '-'))}
                                    onKeyDown={onInputKeyDown}
                                    className="relative w-full bg-transparent font-mono-ui text-sm text-foreground outline-none placeholder:text-muted-foreground/30 caret-[hsl(var(--accent))]"
                                    placeholder="type to complete the sentence"
                                    role="combobox"
                                    aria-expanded={results.length > 0}
                                    aria-controls="cmdbar-listbox"
                                    aria-activedescendant={active ? `cmdbar-opt-${active.slug}` : undefined}
                                    aria-label="Where is Alen? Type a route suffix"
                                    autoComplete="off"
                                    autoCorrect="off"
                                    autoCapitalize="off"
                                    spellCheck={false}
                                />
                            </div>
                        </div>

                        {/* Results */}
                        <ul
                            id="cmdbar-listbox"
                            role="listbox"
                            aria-label="Destinations"
                            className="max-h-[44vh] overflow-y-auto py-1.5"
                        >
                            {results.map((route, i) => {
                                const isActive = i === activeIndex
                                return (
                                    <li
                                        key={route.slug}
                                        id={`cmdbar-opt-${route.slug}`}
                                        role="option"
                                        aria-selected={isActive}
                                        onMouseMove={() => setActiveIndex(i)}
                                        onClick={() => navigate(route.slug)}
                                        className={cn(
                                            'flex items-baseline gap-2.5 px-4 py-2 cursor-pointer text-sm font-mono-ui transition-colors duration-100',
                                            isActive
                                                ? 'bg-accent/10 text-accent'
                                                : 'text-muted-foreground hover:text-foreground',
                                            route.mystery && 'border-t border-dashed border-border/40 mt-1 pt-2.5'
                                        )}
                                    >
                                        <span
                                            className={cn(
                                                'text-accent transition-opacity duration-100 w-3 shrink-0',
                                                isActive ? 'opacity-100' : 'opacity-0'
                                            )}
                                            aria-hidden="true"
                                        >
                                            {route.mystery ? '?' : '▸'}
                                        </span>
                                        <span className={cn('shrink-0', isActive && 'glow-text', route.mystery && 'italic')}>
                                            /{route.slug}
                                        </span>
                                        <span className="text-[0.68rem] text-muted-foreground/50 truncate flex-1">
                                            {route.description}
                                        </span>
                                        <span className="text-[0.6rem] uppercase tracking-widest text-muted-foreground/35 shrink-0">
                                            {route.group}
                                        </span>
                                    </li>
                                )
                            })}
                        </ul>

                        {/* Hints */}
                        <footer className="flex items-center gap-3 px-4 py-2 border-t border-border/60 text-[0.62rem] font-mono-ui text-muted-foreground/40 select-none">
                            <span>
                                <span className="text-accent/60">↑↓</span> navigate
                            </span>
                            <span>
                                <span className="text-accent/60">tab</span> complete
                            </span>
                            <span>
                                <span className="text-accent/60">↵</span> warp
                            </span>
                            {/* Minimal-motion toggle: skips the UFO warp transition, persists in localStorage */}
                            <button
                                onClick={toggleFx}
                                aria-pressed={minimalFx}
                                title="Toggle the UFO page transition"
                                className="ml-auto hover:text-accent transition-colors duration-150"
                            >
                                <span className="text-accent/60">fx</span> {minimalFx ? 'minimal' : 'full'}
                            </button>
                            <span>
                                <span className="text-accent/60">esc</span> abort
                            </span>
                        </footer>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
