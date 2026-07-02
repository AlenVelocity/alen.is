import { Suspense, cache } from 'react'
import { Metadata } from 'next'
import { PageTransition } from '@/components/ui/page-transition'
import { StreamFade } from '@/components/ui/stream-fade'
import { api } from '@/trpc/server'
import { FiHeadphones, FiArrowUpRight } from 'react-icons/fi'
import Image from 'next/image'
import Link from 'next/link'
import { LinkButton } from '@/components/ui/link-button'
import { SumikaDialog } from './sumika-dialog'
import { encodeTrackParam } from '@/lib/lastfm'
import { calculateFrequency, getStreakInfo } from '@/lib/streak'
import { TopSignals, EqualizerBars } from './_components/top-signals'
import { SkeletonBar, SkeletonTile, SignalRowsSkeleton } from '@/components/ui/signal-skeleton'
import { formatDistanceToNow, parse } from 'date-fns'

export const metadata: Metadata = {
    title: 'Listening',
    description: 'What I listen to',
    openGraph: {
        title: 'Alen is Listening',
        description: 'What I listen to',
        images: [{ url: '/sumika-wrapped.png', width: 250, height: 250, alt: "Alen's Year of Sumika" }]
    },
    alternates: { canonical: '/listening' }
}

/**
 * One Last.fm round-trip per request, shared by every section below via
 * React cache() — each Suspense boundary awaits the same promise, so the
 * static parts of the page stream immediately while the scrobble-powered
 * sections pop in together when the API answers.
 */
const getScrobbles = cache(() => api.lastfm.getRecentTracks({ limit: 200 }))

export default function Listening() {
    return (
        <PageTransition>
            <div className="container max-w-2xl py-12 md:py-20">
                {/* Header — static, renders instantly */}
                <p
                    className="mono-label text-muted-foreground/50 mb-4 animate-fade-in-up opacity-0 stagger-1"
                    style={{ animationFillMode: 'forwards' }}
                >
                    // intercepted audio transmissions
                </p>
                <h1
                    className="text-display text-4xl md:text-5xl mb-10 flex items-center gap-4 animate-fade-in-up opacity-0 stagger-2"
                    style={{ animationFillMode: 'forwards' }}
                >
                    Listening
                    <EqualizerBars />
                </h1>

                {/* Now playing — streams in from Last.fm */}
                <Suspense fallback={<NowPlayingSkeleton />}>
                    <NowPlayingSection />
                </Suspense>

                {/* About — static */}
                <section
                    className="mb-14 space-y-4 text-muted-foreground leading-relaxed animate-fade-in-up opacity-0 stagger-4"
                    style={{ animationFillMode: 'forwards' }}
                >
                    <p>
                        Mostly video game OSTs (Persona is elite) and Japanese rock. Always down for recommendations
                        though.
                    </p>
                    <p>
                        There was a year where <SumikaDialog /> was basically my entire personality.
                    </p>
                    <p>
                        Now I&apos;ve{' '}
                        <LinkButton
                            href="https://open.spotify.com/track/29OHAngqPMvOrDPfl3s9x7?si=ae88719df17c4c95"
                            target="_blank"
                        >
                            reached out to the truth
                        </LinkButton>{' '}
                        (iykyk)
                    </p>
                </section>

                {/* Apple Music — static */}
                <section
                    className="mb-14 animate-fade-in-up opacity-0 stagger-5"
                    style={{ animationFillMode: 'forwards' }}
                >
                    <div className="section-label mb-4">current playlist</div>
                    <div className="flex justify-center rounded-xl overflow-hidden border border-border">
                        <iframe
                            allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write"
                            frameBorder="0"
                            height="450"
                            style={{ width: '100%', maxWidth: '660px', overflow: 'hidden', borderRadius: '10px' }}
                            sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
                            src="https://embed.music.apple.com/in/playlist/writers-room/pl.u-gxblgd1Tb9VXoJA"
                            title="Apple Music playlist: writers room"
                        />
                    </div>
                </section>

                {/* Top signals — streams in from Last.fm */}
                <Suspense fallback={<TopSignalsSkeleton />}>
                    <TopSignalsSection />
                </Suspense>

                {/* Flight recorder — streams in from Last.fm */}
                <Suspense fallback={<FlightRecorderSkeleton />}>
                    <FlightRecorderSection />
                </Suspense>
            </div>
        </PageTransition>
    )
}

/** ── Skeleton components ───────────────────────────────────────────── */

function NowPlayingSkeleton() {
    return (
        <section className="mb-14" aria-hidden="true">
            <div className="section-label mb-4">
                now playing
                <span className="text-accent/30 animate-blink ml-1">▮</span>
            </div>
            <div className="border-b border-dashed border-border/30 py-4 flex items-center gap-4">
                <SkeletonTile className="w-14 h-14 rounded-lg" />
                <div className="flex-1 min-w-0 space-y-2">
                    <SkeletonBar width="4rem" height="0.5rem" delay={0} />
                    <SkeletonBar width="55%" height="0.75rem" delay={0.1} />
                    <SkeletonBar width="40%" height="0.5rem" delay={0.2} />
                </div>
            </div>
        </section>
    )
}

function TopSignalsSkeleton() {
    return (
        <section className="mb-14" aria-hidden="true">
            <div className="section-label mb-4">
                strongest signals
                <span className="text-accent/30 animate-blink ml-1">▮</span>
            </div>
            <div>
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="grid grid-cols-[auto_1fr_auto] items-center gap-3 py-2.5"
                    >
                        <div className="w-8 h-8 rounded-full skeleton-shimmer" style={{ animationDelay: `${i * 0.08}s` }} />
                        <div className="min-w-0 space-y-2">
                            <SkeletonBar width={`${45 + ((i * 13) % 35)}%`} height="0.625rem" delay={i * 0.1} />
                            <div className="h-1 bg-muted/40 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-accent/15 rounded-full"
                                    style={{ width: `${100 - i * 14}%` }}
                                />
                            </div>
                        </div>
                        <SkeletonBar width="2rem" height="0.5rem" delay={i * 0.1 + 0.05} />
                    </div>
                ))}
            </div>
        </section>
    )
}

function FlightRecorderSkeleton() {
    return (
        <section aria-hidden="true">
            <div className="section-label mb-4">
                flight recorder
                <span className="text-accent/30 animate-blink ml-1">▮</span>
            </div>
            <SignalRowsSkeleton rows={6} />
        </section>
    )
}

/** ── Streamed sections ─────────────────────────────────────────────── */

async function NowPlayingSection() {
    const lastFmData = await getScrobbles()
    if (!lastFmData.nowPlaying) return null

    const nowPlayingFrequency = calculateFrequency(lastFmData.nowPlaying, lastFmData.recentlyPlayed)
    const {
        subtitle: nowPlayingSubtitle,
        borderGradient,
        shadowStyle
    } = getStreakInfo(nowPlayingFrequency, true, 'large')

    return (
        <StreamFade>
            <section className="mb-14">
                <div className="section-label mb-4">now playing</div>
                <div
                    className={`relative ${nowPlayingFrequency >= 3 ? 'p-[2px] rounded-xl overflow-visible' : 'border-b border-dashed border-border'}`}
                >
                    {nowPlayingFrequency >= 3 && (
                        <>
                            <div
                                className="absolute inset-[2px] rounded-[10px] z-[-1]"
                                style={{ boxShadow: shadowStyle }}
                            />
                            <div className="absolute inset-0 rounded-xl overflow-hidden z-[-2]">
                                <div
                                    className="absolute left-[50%] top-[50%] w-[1000px] h-[1000px] ml-[-500px] mt-[-500px] origin-center"
                                    style={{
                                        backgroundImage: borderGradient,
                                        animation: `spin-slow ${Math.max(0.4, 4.5 - nowPlayingFrequency * 0.25)}s linear infinite`
                                    }}
                                />
                            </div>
                        </>
                    )}
                    <Link
                        href={`/listening/to/${encodeTrackParam(lastFmData.nowPlaying.artist)}/${encodeTrackParam(lastFmData.nowPlaying.name)}`}
                        className={`group relative z-10 flex items-center gap-4 transition-colors ${nowPlayingFrequency >= 3 ? 'bg-card p-4 rounded-[10px] hover:bg-muted/80' : 'py-4 hover:border-accent/50'}`}
                    >
                        {lastFmData.nowPlaying.image ? (
                            <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0">
                                <Image
                                    src={lastFmData.nowPlaying.image}
                                    alt={`${lastFmData.nowPlaying.name} album art`}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ) : (
                            <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center shrink-0">
                                <FiHeadphones className="w-5 h-5 text-muted-foreground" />
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                                <EqualizerBars className="h-3 scale-75 origin-left" />
                                <span className="text-xs font-medium text-accent uppercase tracking-wider">
                                    {nowPlayingSubtitle}
                                    {nowPlayingFrequency >= 3 && (
                                        <span className="ml-1.5 opacity-80 lowercase">x{nowPlayingFrequency}</span>
                                    )}
                                </span>
                            </div>
                            <p className="font-semibold truncate group-hover:text-accent transition-colors">
                                {lastFmData.nowPlaying.name}
                            </p>
                            <p className="text-sm text-muted-foreground truncate">
                                {lastFmData.nowPlaying.artist}
                                {lastFmData.nowPlaying.album && (
                                    <span className="text-muted-foreground/50"> · {lastFmData.nowPlaying.album}</span>
                                )}
                            </p>
                        </div>
                        <FiArrowUpRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-accent transition-colors shrink-0" />
                    </Link>
                </div>
            </section>
        </StreamFade>
    )
}

async function TopSignalsSection() {
    const lastFmData = await getScrobbles()

    // Top artists across the whole scrobble window — feeds the signal chart
    const artistCounts = lastFmData.recentlyPlayed.reduce((map, track) => {
        map.set(track.artist, (map.get(track.artist) ?? 0) + 1)
        return map
    }, new Map<string, number>())
    const topSignals = [...artistCounts.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([artist, count]) => ({ artist, count }))

    if (topSignals.length === 0) return null

    // Fetch artist images in parallel
    let artistImages: { artist: string; image: string | null }[] = []
    try {
        artistImages = await api.lastfm.getArtistImages({
            artists: topSignals.map((s) => s.artist)
        })
    } catch {
        // If artist image fetch fails, continue without images
    }

    const imageMap = new Map(artistImages.map((a) => [a.artist, a.image]))
    console.log(imageMap)
    const signalsWithImages = topSignals.map((s) => ({
        ...s,
        image: imageMap.get(s.artist) ?? null
    }))

    return (
        <StreamFade>
            <section className="mb-14">
                <div className="section-label mb-4">strongest signals</div>
                <TopSignals signals={signalsWithImages} />
            </section>
        </StreamFade>
    )
}

async function FlightRecorderSection() {
    const lastFmData = await getScrobbles()

    // Collapse consecutive repeats of the same track into one row with a ×N count
    const groupedTracks = lastFmData.recentlyPlayed.reduce(
        (acc, track) => {
            const key = `${track.name}:::${track.artist}`
            const last = acc[acc.length - 1]
            if (last && last.key === key) {
                last.count += 1
            } else {
                acc.push({ ...track, key, count: 1 })
            }
            return acc
        },
        [] as ((typeof lastFmData.recentlyPlayed)[0] & { key: string; count: number })[]
    )
    const displayTracks = groupedTracks.slice(0, 20)

    if (displayTracks.length === 0) {
        if (lastFmData.nowPlaying) return null
        return (
            <div className="text-center py-12">
                <FiHeadphones className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No recently played tracks found.</p>
            </div>
        )
    }

    return (
        <StreamFade>
            <section>
                <div className="section-label mb-4">flight recorder</div>
                <div>
                    {displayTracks.map((track, index) => (
                        <Link
                            key={`${track.name}-${index}`}
                            href={`/listening/to/${encodeTrackParam(track.artist)}/${encodeTrackParam(track.name)}`}
                            className="group flex items-center gap-3 py-2.5 border-b border-dashed border-border/50 last:border-b-0 hover:border-accent/30 transition-colors"
                        >
                            <span className="mono-label text-muted-foreground/30 w-5 text-right shrink-0 group-hover:text-accent/60 transition-colors">
                                {String(index + 1).padStart(2, '0')}
                            </span>
                            {track.image ? (
                                <div className="relative w-9 h-9 rounded overflow-hidden flex-shrink-0">
                                    <Image src={track.image} alt={track.name} fill className="object-cover" />
                                </div>
                            ) : (
                                <div className="w-9 h-9 rounded bg-muted flex items-center justify-center flex-shrink-0">
                                    <FiHeadphones className="w-3.5 h-3.5 text-muted-foreground" />
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-medium truncate group-hover:text-accent transition-colors">
                                        {track.name}
                                    </p>
                                    {track.count > 1 && (
                                        <span className="shrink-0 mono-label px-1.5 py-0.5 border border-accent/25 text-accent/70 rounded-sm">
                                            ×{track.count}
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
                            </div>
                            {track.date && (
                                <span className="text-xs text-muted-foreground/50 hidden sm:block">
                                    {(() => {
                                        try {
                                            const utcDate = parse(track.date, 'dd MMM yyyy, HH:mm', new Date())
                                            const localDate = new Date(
                                                utcDate.getTime() - utcDate.getTimezoneOffset() * 60000
                                            )
                                            return formatDistanceToNow(localDate, { addSuffix: true })
                                        } catch {
                                            return ''
                                        }
                                    })()}
                                </span>
                            )}
                        </Link>
                    ))}
                </div>
            </section>
        </StreamFade>
    )
}
