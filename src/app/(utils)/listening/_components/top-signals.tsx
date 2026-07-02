'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { FiHeadphones } from 'react-icons/fi'

/**
 * "Top signals" — the most-intercepted artists from recent scrobbles,
 * rendered as a glowing signal-strength chart with artist avatars.
 * Bars sweep in when scrolled into view.
 */

export interface ArtistSignal {
    artist: string
    count: number
    image?: string | null
}

export function TopSignals({ signals }: { signals: ArtistSignal[] }) {
    const max = signals[0]?.count ?? 1

    if (signals.length === 0) return null

    return (
        <div role="list" aria-label="Most played artists recently">
            {signals.map((signal, i) => {
                const strength = signal.count / max
                return (
                    <div
                        key={signal.artist}
                        role="listitem"
                        className="group grid grid-cols-[auto_1fr_auto] items-center gap-3 py-2.5"
                    >
                        {/* Artist image */}
                        {signal.image ? (
                            <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 border border-border/40 group-hover:border-accent/40 transition-colors duration-200">
                                <Image
                                    src={signal.image}
                                    alt={signal.artist}
                                    fill
                                    className="object-cover"
                                    sizes="32px"
                                />
                            </div>
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-muted/50 border border-border/30 flex items-center justify-center shrink-0 group-hover:border-accent/30 transition-colors duration-200">
                                <FiHeadphones className="w-3.5 h-3.5 text-muted-foreground/40" />
                            </div>
                        )}

                        {/* Artist + signal bar */}
                        <div className="min-w-0">
                            <p
                                className={cn(
                                    'text-sm font-medium truncate mb-1 transition-all duration-200',
                                    'group-hover:text-accent group-hover:[text-shadow:var(--glow-accent)]'
                                )}
                            >
                                {signal.artist}
                            </p>
                            <div className="h-1 bg-muted/60 overflow-hidden rounded-full">
                                <motion.div
                                    className={cn(
                                        'h-full rounded-full transition-shadow duration-200',
                                        'bg-accent/50 group-hover:bg-accent group-hover:shadow-[0_0_10px_hsl(var(--accent)/0.7)]'
                                    )}
                                    initial={{ scaleX: 0 }}
                                    whileInView={{ scaleX: 1 }}
                                    viewport={{ once: true, margin: '-40px' }}
                                    transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                                    style={{ width: `${Math.max(strength * 100, 6)}%`, transformOrigin: 'left center' }}
                                />
                            </div>
                        </div>

                        {/* Readout: play count */}
                        <span
                            className={cn(
                                'mono-label text-right transition-colors duration-200',
                                'text-muted-foreground/50 group-hover:text-accent'
                            )}
                        >
                            ×{signal.count}
                        </span>
                    </div>
                )
            })}
        </div>
    )
}

/** Tiny always-dancing equalizer used next to headings */
export function EqualizerBars({ className }: { className?: string }) {
    return (
        <span className={cn('inline-flex items-end gap-[3px] h-5', className)} aria-hidden="true">
            <span className="w-[3px] bg-accent rounded-full animate-music-bar-1" />
            <span className="w-[3px] bg-accent rounded-full animate-music-bar-2" />
            <span className="w-[3px] bg-accent rounded-full animate-music-bar-3" />
            <span className="w-[3px] bg-accent rounded-full animate-music-bar-4" />
        </span>
    )
}
