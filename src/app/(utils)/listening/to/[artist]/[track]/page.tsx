import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PageTransition } from '@/components/ui/page-transition'
import { api } from '@/trpc/server'
import { decodeTrackParam, encodeTrackParam } from '@/lib/lastfm'
import { FiArrowLeft, FiArrowUpRight, FiHeadphones, FiHeart, FiClock, FiUsers, FiDisc } from 'react-icons/fi'
import { SiLastdotfm } from 'react-icons/si'
import { FaSpotify, FaYoutube, FaApple } from 'react-icons/fa'
import Image from 'next/image'
import Link from 'next/link'

// ─── Static generation ──────────────────────────────────────────────────────

export const dynamicParams = true

export async function generateStaticParams() {
    try {
        const data = await api.lastfm.getRecentTracks()
        const seen = new Set<string>()
        const params: { artist: string; track: string }[] = []

        const allTracks = [...data.recentlyPlayed, ...(data.nowPlaying ? [data.nowPlaying] : [])]

        for (const t of allTracks) {
            const key = `${t.artist}|||${t.name}`
            if (!seen.has(key)) {
                seen.add(key)
                params.push({
                    artist: encodeTrackParam(t.artist),
                    track: encodeTrackParam(t.name),
                })
            }
        }

        return params
    } catch {
        return []
    }
}

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
                : undefined,
        },
        twitter: {
            card: 'summary',
            title: `Alen is Listening to ${track.name}`,
            description: desc,
            images: track.image ? [track.image] : undefined,
        },
        alternates: { canonical: `/listening/to/${artistParam}/${trackParam}` },
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
    const [track, lastFmData] = await Promise.all([
        api.lastfm.getTrackInfo({ artist: artistName, track: trackName }).catch(() => null),
        api.lastfm.getRecentTracks().catch(() => null),
    ])

    if (!track) notFound()

    // Check if this track is currently playing
    const isNowPlaying =
        lastFmData?.nowPlaying &&
        lastFmData.nowPlaying.artist.toLowerCase() === track.artist.toLowerCase() &&
        lastFmData.nowPlaying.name.toLowerCase() === track.name.toLowerCase()

    // Build search query for streaming links
    const searchQuery = encodeURIComponent(`${track.artist} ${track.name}`)

    return (
        <PageTransition>
            <div className="container max-w-2xl py-12 md:py-20">
                {/* Back link */}
                <Link
                    href="/listening"
                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-accent transition-colors mb-8"
                >
                    <FiArrowLeft className="w-3.5 h-3.5" />
                    Back to Listening
                </Link>

                {/* Album art */}
                {track.image ? (
                    <div
                        className="relative w-full max-w-[300px] aspect-square rounded-lg overflow-hidden mb-8"
                        style={{ rotate: '-0.5deg' }}
                    >
                        <Image
                            src={track.image}
                            alt={`${track.name} album art`}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                ) : (
                    <div
                        className="w-full max-w-[300px] aspect-square rounded-lg bg-muted flex items-center justify-center mb-8"
                        style={{ rotate: '-0.5deg' }}
                    >
                        <FiHeadphones className="w-12 h-12 text-muted-foreground/30" />
                    </div>
                )}

                {/* Title + artist */}
                <div className="mb-1">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{track.name}</h1>
                </div>
                <p className="text-lg text-muted-foreground mb-2">{track.artist}</p>

                {/* Now playing indicator */}
                {isNowPlaying && (
                    <div className="flex items-center gap-2 mb-4">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent animate-pulse-subtle" />
                        <span className="text-xs font-medium text-accent">Listening now</span>
                    </div>
                )}

                {/* Loved badge */}
                {track.userLoved && (
                    <div className="flex items-center gap-1.5 text-sm text-accent mb-6">
                        <FiHeart className="w-4 h-4 fill-current" />
                        <span className="font-medium">Loved</span>
                    </div>
                )}

                {/* Spacer when neither now-playing nor loved */}
                {!isNowPlaying && !track.userLoved && <div className="mb-4" />}

                {/* Stats */}
                <section className="mb-10">
                    <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider border-l-2 border-accent pl-3 mb-4">
                        Stats
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-6">
                        {track.duration != null && track.duration > 0 && (
                            <div>
                                <div className="flex items-center gap-1.5 mb-0.5">
                                    <FiClock className="w-3.5 h-3.5 text-muted-foreground/50" />
                                    <p className="text-2xl font-bold">{formatDuration(track.duration)}</p>
                                </div>
                                <p className="text-xs text-muted-foreground/60">duration</p>
                            </div>
                        )}
                        {track.userPlaycount != null && track.userPlaycount > 0 && (
                            <div>
                                <p className="text-2xl font-bold text-accent">{formatNumber(track.userPlaycount)}</p>
                                <p className="text-xs text-muted-foreground/60">my scrobbles</p>
                            </div>
                        )}
                        {track.playcount != null && track.playcount > 0 && (
                            <div>
                                <p className="text-2xl font-bold">{formatNumber(track.playcount)}</p>
                                <p className="text-xs text-muted-foreground/60">total scrobbles</p>
                            </div>
                        )}
                        {track.listeners != null && track.listeners > 0 && (
                            <div>
                                <div className="flex items-center gap-1.5 mb-0.5">
                                    <FiUsers className="w-3.5 h-3.5 text-muted-foreground/50" />
                                    <p className="text-2xl font-bold">{formatNumber(track.listeners)}</p>
                                </div>
                                <p className="text-xs text-muted-foreground/60">listeners</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Album */}
                {track.album && (
                    <section className="mb-10">
                        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider border-l-2 border-accent pl-3 mb-4">
                            Album
                        </h2>
                        <div className="flex items-center gap-3">
                            <FiDisc className="w-4 h-4 text-muted-foreground/50 shrink-0" />
                            {track.albumUrl ? (
                                <a
                                    href={track.albumUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-medium hover:text-accent transition-colors"
                                >
                                    {track.album}
                                    <FiArrowUpRight className="inline w-3.5 h-3.5 ml-1 opacity-50" />
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
                        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider border-l-2 border-accent pl-3 mb-4">
                            Tags
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {track.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="px-2.5 py-1 text-xs font-medium rounded-full bg-muted text-muted-foreground border border-dashed border-border"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </section>
                )}

                {/* Wiki / Description */}
                {track.wiki && (
                    <section className="mb-10">
                        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider border-l-2 border-accent pl-3 mb-4">
                            About
                        </h2>
                        <p className="text-sm text-muted-foreground leading-relaxed">{track.wiki}</p>
                    </section>
                )}

                {/* External links */}
                <section>
                    <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider border-l-2 border-accent pl-3 mb-4">
                        Links
                    </h2>
                    <div className="flex flex-col gap-2">
                        <a
                            href={track.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors"
                        >
                            <SiLastdotfm className="w-4 h-4" />
                            View on Last.fm
                            <FiArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                        {track.albumUrl && (
                            <a
                                href={track.albumUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors"
                            >
                                <FiDisc className="w-4 h-4" />
                                View album on Last.fm
                                <FiArrowUpRight className="w-3.5 h-3.5" />
                            </a>
                        )}
                        <a
                            href={`https://open.spotify.com/search/${searchQuery}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors"
                        >
                            <FaSpotify className="w-4 h-4" />
                            Search on Spotify
                            <FiArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                        <a
                            href={`https://music.youtube.com/search?q=${searchQuery}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors"
                        >
                            <FaYoutube className="w-4 h-4" />
                            Search on YouTube Music
                            <FiArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                        <a
                            href={`https://music.apple.com/us/search?term=${searchQuery}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors"
                        >
                            <FaApple className="w-4 h-4" />
                            Search on Apple Music
                            <FiArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                    </div>
                </section>
            </div>
        </PageTransition>
    )
}
