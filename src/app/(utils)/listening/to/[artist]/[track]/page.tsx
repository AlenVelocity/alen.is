import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PageTransition } from '@/components/ui/page-transition'
import { RepeatRing } from '@/components/ui/repeat-ring'
import { api } from '@/trpc/server'
import { decodeTrackParam, encodeTrackParam } from '@/lib/lastfm'
import { calculateFrequency, getStreakInfo } from '@/lib/streak'
import { FiArrowLeft, FiHeadphones, FiHeart, FiDisc, FiStar } from 'react-icons/fi'
import { SiLastdotfm } from 'react-icons/si'
import { FaSpotify, FaYoutube, FaApple } from 'react-icons/fa'
import Image from 'next/image'
import Link from 'next/link'
import { EqualizerBars } from '../../../_components/top-signals'
import { BeamImage } from '@/components/ui/beam-image'

// ─── Metadata ───────────────────────────────────────────────────────────────

type Props = { params: Promise<{ artist: string; track: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { artist: artistParam, track: trackParam } = await params
    const artistName = decodeTrackParam(artistParam)
    const trackName = decodeTrackParam(trackParam)

    const track = await api.lastfm.getTrackInfo({ artist: artistName, track: trackName }).catch(() => null)
    if (!track) return { title: 'Track Not Found' }

    const desc = `${track.artist} · ${track.album ?? 'Single'}`

    return {
        title: `Listening to ${track.name}`,
        description: desc,
        openGraph: {
            title: `Alen is Listening to ${track.name}`,
            description: desc,
            images: track.image
                ? [{ url: track.image, width: 300, height: 300, alt: `${track.name} album art` }]
                : undefined
        },
        twitter: {
            card: 'summary',
            title: `Alen is Listening to ${track.name}`,
            description: desc,
            images: track.image ? [track.image] : undefined
        },
        alternates: { canonical: `/listening/to/${artistParam}/${trackParam}` }
    }
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatDuration(ms: number): string {
    if (ms <= 0) return '—'
    const totalSeconds = Math.round(ms / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

function formatNumber(n: number): string {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
    return n.toLocaleString()
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default async function TrackPage({ params }: Props) {
    const { artist: artistParam, track: trackParam } = await params
    const artistName = decodeTrackParam(artistParam)
    const trackName = decodeTrackParam(trackParam)

    // Fetch track info and recent tracks in parallel
    const [track, lastFmData, reviewData] = await Promise.all([
        api.lastfm.getTrackInfo({ artist: artistName, track: trackName }).catch(() => null),
        api.lastfm.getRecentTracks().catch(() => null),
        api.reviews
            .getReview({
                entityId: `${artistName.replace(/\s+/g, '-').toLowerCase()}-${trackName.replace(/\s+/g, '-').toLowerCase()}`,
                type: 'SONG'
            })
            .catch(() => null)
    ])

    if (!track) notFound()

    // Check if this track is currently playing
    const isNowPlaying = !!(
        lastFmData?.nowPlaying &&
        lastFmData.nowPlaying.artist.toLowerCase() === track.artist.toLowerCase() &&
        lastFmData.nowPlaying.name.toLowerCase() === track.name.toLowerCase()
    )

    // Calculate streak
    const nowPlayingFrequency = lastFmData ? calculateFrequency(track, lastFmData.recentlyPlayed) : 1
    const { subtitle, borderGradient, shadowStyle } = getStreakInfo(nowPlayingFrequency, isNowPlaying, 'large')
    const onStreak = isNowPlaying && nowPlayingFrequency >= 3

    const stats = [
        track.duration != null && track.duration > 0 ? `${formatDuration(track.duration)} long` : null,
        track.userPlaycount != null && track.userPlaycount > 0
            ? `scrobbled ${formatNumber(track.userPlaycount)} times`
            : null
    ].filter((s): s is string => s !== null)

    // Build search query for streaming links
    const searchQuery = encodeURIComponent(`${track.artist} ${track.name}`)

    const linkRow =
        'flex items-center gap-2.5 py-2.5 border-b border-dashed border-border/40 last:border-b-0 mono-label text-muted-foreground/60 hover:text-accent transition-colors'
    const leaves = (
        <span className="ml-auto text-muted-foreground/40" aria-hidden="true">
            ↗
        </span>
    )

    return (
        <PageTransition>
            <div className="container max-w-2xl py-12 md:py-20">
                {/* Back link */}
                <Link
                    href="/listening"
                    className="inline-flex items-center gap-1.5 mono-label text-muted-foreground/50 hover:text-accent transition-colors mb-10"
                >
                    <FiArrowLeft className="w-3 h-3" />
                    back to listening
                </Link>

                {/* Album art, with the spinning ring once it's on repeat, same as the now-playing card on /listening */}
                <RepeatRing
                    frequency={onStreak ? nowPlayingFrequency : 0}
                    gradient={borderGradient}
                    shadow={shadowStyle}
                    className="mb-8 w-full max-w-[300px]"
                >
                    {track.image ? (
                        <div className="relative w-full aspect-square overflow-hidden shadow-xl rounded">
                            <BeamImage
                                src={track.image}
                                alt={`${track.name} album art`}
                                sizes="300px"
                                className="object-cover"
                                priority
                            />
                        </div>
                    ) : (
                        <div className="w-full aspect-square bg-muted flex items-center justify-center shadow-xl rounded">
                            <FiHeadphones className="w-12 h-12 text-muted-foreground/30" />
                        </div>
                    )}
                </RepeatRing>

                {/* Title + artist */}
                <p className="mono-label text-muted-foreground/50 mb-4">// last.fm scrobble</p>
                <h1 className="text-display text-3xl md:text-4xl mb-1 break-words">{track.name}</h1>
                <p className="text-lg text-muted-foreground mb-4">{track.artist}</p>

                {/* Now playing + loved badges */}
                {(isNowPlaying || track.userLoved) && (
                    <div className="flex flex-wrap items-center gap-3 mb-8">
                        {isNowPlaying && (
                            <div className="flex items-center gap-2">
                                <EqualizerBars className="h-3 scale-75 origin-left" />
                                <span className="mono-label text-accent">
                                    {subtitle}
                                    {nowPlayingFrequency >= 3 && (
                                        <span className="ml-1.5 opacity-80">×{nowPlayingFrequency}</span>
                                    )}
                                </span>
                            </div>
                        )}
                        {track.userLoved && (
                            <span className="inline-flex items-center gap-1.5 mono-label border border-accent/30 text-accent px-1.5 py-0.5 rounded-sm">
                                <FiHeart className="w-3 h-3 fill-current" />
                                loved
                            </span>
                        )}
                    </div>
                )}

                {/* The numbers, as a sentence */}
                {stats.length > 0 && (
                    <p className="font-mono-ui text-xs text-muted-foreground tabular-nums mb-12">{stats.join(', ')}.</p>
                )}

                {/* Review */}
                {reviewData && (
                    <section className="mb-12">
                        <div className="section-label mb-3">alen&apos;s review</div>
                        <div className="p-4 rounded-sm border border-dashed border-border/60 flex flex-col gap-2">
                            {reviewData.rating && (
                                <div className="flex items-center gap-1.5 text-accent font-mono-ui text-sm">
                                    <FiStar className="fill-current w-3.5 h-3.5" />
                                    {reviewData.rating}
                                    <span className="text-muted-foreground/50">/10</span>
                                </div>
                            )}
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                                {reviewData.content}
                            </p>
                        </div>
                    </section>
                )}

                {/* Album */}
                {track.album && (
                    <section className="mb-10">
                        <div className="section-label mb-3">album</div>
                        <div className="flex items-center gap-2.5 text-sm">
                            <FiDisc className="w-4 h-4 text-muted-foreground/50 shrink-0" />
                            {track.albumUrl ? (
                                <a
                                    href={track.albumUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-medium hover:text-accent transition-colors"
                                >
                                    {track.album}
                                    <span className="ml-1 text-muted-foreground/40" aria-hidden="true">
                                        ↗
                                    </span>
                                </a>
                            ) : (
                                <span className="font-medium">{track.album}</span>
                            )}
                        </div>
                    </section>
                )}

                {/* Tags */}
                {track.tags.length > 0 && (
                    <section className="mb-10">
                        <div className="section-label mb-3">tags</div>
                        <p className="mono-label text-muted-foreground/60">{track.tags.join(' · ')}</p>
                    </section>
                )}

                {/* Wiki / Description */}
                {track.wiki && (
                    <section className="mb-10">
                        <div className="section-label mb-3">about</div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{track.wiki}</p>
                    </section>
                )}

                {/* External links */}
                <section>
                    <div className="section-label mb-3">links</div>
                    <div>
                        <a href={track.url} target="_blank" rel="noopener noreferrer" className={linkRow}>
                            <SiLastdotfm className="w-3.5 h-3.5 shrink-0" />
                            view on last.fm
                            {leaves}
                        </a>
                        {track.albumUrl && (
                            <a href={track.albumUrl} target="_blank" rel="noopener noreferrer" className={linkRow}>
                                <FiDisc className="w-3.5 h-3.5 shrink-0" />
                                view album on last.fm
                                {leaves}
                            </a>
                        )}
                        <a
                            href={`https://open.spotify.com/search/${searchQuery}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={linkRow}
                        >
                            <FaSpotify className="w-3.5 h-3.5 shrink-0" />
                            search on spotify
                            {leaves}
                        </a>
                        <a
                            href={`https://music.youtube.com/search?q=${searchQuery}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={linkRow}
                        >
                            <FaYoutube className="w-3.5 h-3.5 shrink-0" />
                            search on youtube music
                            {leaves}
                        </a>
                        <a
                            href={`https://music.apple.com/us/search?term=${searchQuery}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={linkRow}
                        >
                            <FaApple className="w-3.5 h-3.5 shrink-0" />
                            search on apple music
                            {leaves}
                        </a>
                    </div>
                </section>
            </div>
        </PageTransition>
    )
}
