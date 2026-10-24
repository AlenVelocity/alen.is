import { api } from '@/trpc/server'
import { FiHeadphones } from 'react-icons/fi'
import Link from 'next/link'
import Image from 'next/image'
import { calculateFrequency, getStreakInfo } from '@/lib/streak'
import { SkeletonBar, SkeletonTile } from '@/components/ui/signal-skeleton'
import { StreamFade } from '@/components/ui/stream-fade'
import { RepeatRing } from '@/components/ui/repeat-ring'

/**
 * Placeholder rendered by the home page's Suspense boundary while the
 * Last.fm round-trip is in flight — smooth shimmer bars instead of glyph static.
 */
export function CurrentlyListeningSkeleton() {
    return (
        <div className="border-l-2 border-accent/20 bg-card/60 p-4 flex items-center gap-4" aria-hidden="true">
            <SkeletonTile className="w-10 h-10" />
            <div className="flex-1 min-w-0 space-y-2">
                <SkeletonBar width="5.5rem" height="0.5rem" delay={0} />
                <SkeletonBar width="60%" height="0.625rem" delay={0.1} />
                <SkeletonBar width="35%" height="0.5rem" delay={0.2} />
            </div>
        </div>
    )
}

/**
 * Server component streamed in behind Suspense: the hero renders immediately
 * while this section waits on Last.fm, instead of the whole page (or a
 * client-side fetch waterfall) paying for the API's latency.
 */
export async function CurrentlyListening() {
    let lastFmData: Awaited<ReturnType<typeof api.lastfm.getRecentTracks>>
    try {
        lastFmData = await api.lastfm.getRecentTracks()
    } catch {
        // Last.fm being down shouldn't break the home page — just drop the section
        return null
    }

    if (!lastFmData || (lastFmData.recentlyPlayed.length === 0 && !lastFmData.nowPlaying)) {
        return null
    }

    const currentTrack = lastFmData.nowPlaying || lastFmData.recentlyPlayed[0]
    const isNowPlaying = !!lastFmData.nowPlaying
    const nowPlayingFrequency = calculateFrequency(currentTrack, lastFmData.recentlyPlayed)
    const { subtitle, borderGradient, shadowStyle } = getStreakInfo(nowPlayingFrequency, isNowPlaying, 'small', true)

    return (
        <StreamFade>
            <RepeatRing frequency={nowPlayingFrequency} gradient={borderGradient} shadow={shadowStyle}>
                <Link
                    href="/listening"
                    className={`group relative z-10 flex items-center gap-4 p-4 bg-card border-l-2 ${
                        nowPlayingFrequency >= 3 ? 'border-accent' : 'border-border'
                    }`}
                >
                    {/* Album art or fallback */}
                    {currentTrack.image ? (
                        <div className="relative w-10 h-10 rounded-sm overflow-hidden shrink-0">
                            <Image
                                src={currentTrack.image}
                                alt={`${currentTrack.name} album art`}
                                fill
                                className="object-cover"
                            />
                        </div>
                    ) : (
                        <div className="w-10 h-10 bg-muted flex items-center justify-center shrink-0 rounded-sm">
                            <FiHeadphones className="w-4 h-4 text-muted-foreground" />
                        </div>
                    )}

                    <div className="flex-1 min-w-0">
                        {/* Status label */}
                        <div className="flex items-center gap-2 mb-0.5">
                            {isNowPlaying && (
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                            )}
                            <span className="mono-label text-accent">
                                {subtitle}
                                {nowPlayingFrequency >= 3 && (
                                    <span className="ml-1.5 opacity-70">×{nowPlayingFrequency}</span>
                                )}
                            </span>
                        </div>

                        {/* Track name */}
                        <p className="text-display text-sm truncate group-hover:text-accent transition-colors duration-200">
                            {currentTrack.name}
                        </p>

                        {/* Artist */}
                        <p className="mono-label text-muted-foreground truncate mt-0.5">{currentTrack.artist}</p>
                    </div>
                </Link>
            </RepeatRing>
        </StreamFade>
    )
}
