import { cn } from '@/lib/utils'
import Image from 'next/image'
import { FiHeadphones } from 'react-icons/fi'

/**
 * The artists that come up most in the recent scrobbles, as a bar chart: one
 * row each, the bar's length relative to the artist at the top.
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
        <ol>
            {signals.map((signal) => {
                const strength = signal.count / max
                return (
                    <li key={signal.artist} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 py-2.5">
                        {/* Decorative: the name is right next to it */}
                        {signal.image ? (
                            <div className="relative w-8 h-8 rounded overflow-hidden shrink-0">
                                <Image src={signal.image} alt="" fill className="object-cover" sizes="32px" />
                            </div>
                        ) : (
                            <div className="w-8 h-8 rounded bg-muted flex items-center justify-center shrink-0">
                                <FiHeadphones className="w-3.5 h-3.5 text-muted-foreground/40" />
                            </div>
                        )}

                        <div className="min-w-0">
                            <p className="text-sm font-medium truncate mb-1">{signal.artist}</p>
                            <div className="h-1 bg-muted/60 overflow-hidden rounded-sm">
                                <div
                                    className="h-full rounded-sm bg-accent/60"
                                    style={{ width: `${Math.max(strength * 100, 6)}%` }}
                                />
                            </div>
                        </div>

                        <span className="mono-label text-right text-muted-foreground/50 tabular-nums">
                            ×{signal.count}
                        </span>
                    </li>
                )
            })}
        </ol>
    )
}

/**
 * The equalizer. It only dances, so only render it next to something that is
 * playing right now: it is a live indicator and takes the signal colour.
 */
export function EqualizerBars({ className }: { className?: string }) {
    return (
        <span className={cn('inline-flex items-end gap-[3px] h-5', className)} aria-hidden="true">
            <span className="w-[3px] bg-signal rounded-sm animate-music-bar-1" />
            <span className="w-[3px] bg-signal rounded-sm animate-music-bar-2" />
            <span className="w-[3px] bg-signal rounded-sm animate-music-bar-3" />
            <span className="w-[3px] bg-signal rounded-sm animate-music-bar-4" />
        </span>
    )
}
