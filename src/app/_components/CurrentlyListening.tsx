import { api } from '@/trpc/server'
import { FiHeadphones } from 'react-icons/fi'
import Link from 'next/link'
import Image from 'next/image'
import { calculateFrequency, getStreakInfo, RING_FROM } from '@/lib/streak'
import { SkeletonBar, SkeletonTile } from '@/components/ui/signal-skeleton'
import { StreamFade } from '@/components/ui/stream-fade'
import { RepeatRing } from '@/components/ui/repeat-ring'
import { Persona } from '@/components/persona'

/**
 * The section and its label travel with the card, so the two states that have
 * a card (loading, loaded) have a label and the one that has none (Last.fm is
 * down, or nothing has been scrobbled) leaves no label behind over a gap.
 * The label names the section, and the card says whether the track is playing
 * now or was played earlier.
 */
function ListeningSection({ children }: { children: React.ReactNode }) {
    return (
        <section className="mb-20">
            <h2 className="section-label mb-5">
                <Persona alen="listening" ban="noise" />
            </h2>
            {children}
        </section>
    )
}

/**
 * Placeholder rendered by the home page's Suspense boundary while the
 * Last.fm round trip is in flight: shimmer bars in the shape of the card.
 */
export function CurrentlyListeningSkeleton() {
    return (
        <ListeningSection>
            <div className="membrane rounded-xl p-3.5 flex items-center gap-4" aria-hidden="true">
                <SkeletonTile className="w-11 h-11" />
                <div className="flex-1 min-w-0 space-y-2.5">
                    <SkeletonBar width="45%" height="0.7rem" delay={0} />
                    <SkeletonBar width="28%" height="0.55rem" delay={0.1} />
                </div>
                <SkeletonBar width="4.5rem" height="0.5rem" delay={0.2} className="shrink-0 mr-1.5" />
            </div>
        </ListeningSection>
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
        // Last.fm being down shouldn't break the home page, so the section is dropped
        return null
    }

    if (!lastFmData || (lastFmData.recentlyPlayed.length === 0 && !lastFmData.nowPlaying)) {
        return null
    }

    const currentTrack = lastFmData.nowPlaying || lastFmData.recentlyPlayed[0]
    const isNowPlaying = !!lastFmData.nowPlaying
    // A streak only counts while the track is the one playing, as on /listening
    const frequency = isNowPlaying ? calculateFrequency(currentTrack, lastFmData.recentlyPlayed) : 1
    const onRepeat = frequency >= RING_FROM
    const { subtitle, banSubtitle, borderGradient, shadowStyle } = getStreakInfo(frequency, isNowPlaying, 'small', true)

    return (
        <ListeningSection>
            <StreamFade>
                <RepeatRing
                    frequency={frequency}
                    gradient={borderGradient}
                    shadow={shadowStyle}
                    rounded="rounded-[calc(var(--radius)*1.6+2px)]"
                >
                    {/* On repeat the ring is the edge, so the card under it is solid.
                        Otherwise it has the soft edge every card has. */}
                    <Link
                        href="/listening"
                        className={`group relative z-10 flex items-center gap-4 p-3.5 pr-5 rounded-xl transition-[scale] duration-150 ease-out active:[scale:0.99] ${
                            onRepeat ? 'bg-card' : 'membrane'
                        }`}
                    >
                        {/* Album art or fallback */}
                        {currentTrack.image ? (
                            <div className="relative w-11 h-11 rounded-md overflow-hidden shrink-0">
                                <Image
                                    src={currentTrack.image}
                                    alt={`${currentTrack.name} album art`}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ) : (
                            <div className="w-11 h-11 bg-muted flex items-center justify-center shrink-0 rounded-md">
                                <FiHeadphones className="w-4 h-4 text-muted-foreground" />
                            </div>
                        )}

                        <div className="flex-1 min-w-0">
                            {/* Track name */}
                            <p className="font-semibold truncate group-hover:text-accent transition-colors duration-150">
                                {currentTrack.name}
                            </p>

                            {/* Artist */}
                            <p className="text-sm text-muted-foreground truncate">{currentTrack.artist}</p>
                        </div>

                        {/* Status, after the track and not over it. Playing right now is live,
                            so it takes the signal colour; a track that has finished does not.
                            The repeat count is a number, so it alone is in the data face. */}
                        <div
                            className={`flex items-center gap-2 shrink-0 text-xs font-medium ${
                                isNowPlaying ? 'text-signal' : 'text-muted-foreground'
                            }`}
                        >
                            {isNowPlaying && (
                                <span
                                    className="inline-block w-1.5 h-1.5 rounded-full ban:rounded-none bg-signal shrink-0"
                                    aria-hidden="true"
                                />
                            )}
                            <span>
                                <Persona alen={subtitle} ban={banSubtitle} />
                                {onRepeat && <span className="ml-1.5 font-data opacity-80">×{frequency}</span>}
                            </span>
                        </div>
                    </Link>
                </RepeatRing>
            </StreamFade>
        </ListeningSection>
    )
}
