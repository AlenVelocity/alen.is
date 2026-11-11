import { cache } from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { FiHeadphones } from 'react-icons/fi'
import { api } from '@/trpc/server'
import { decodeTrackParam, encodeTrackParam } from '@/lib/lastfm'
import { calculateFrequency, getStreakInfo, RING_FROM } from '@/lib/streak'
import { Persona } from '@/components/persona'
import { PageTransition } from '@/components/ui/page-transition'
import { RepeatRing } from '@/components/ui/repeat-ring'
import { BeamImage } from '@/components/ui/beam-image'
import { EqualizerBars } from '../../../_components/top-signals'

type Props = { params: Promise<{ artist: string; track: string }> }

/** The same window /listening lists from, so any track it links to can be found again here */
const getRecent = cache(() => api.lastfm.getRecentTracks({ limit: 200 }).catch(() => null))

/** A path segment as it was built by encodeTrackParam, percent-encoding undone */
function slugOf(param: string): string {
    try {
        return decodeURIComponent(param).toLowerCase()
    } catch {
        return param.toLowerCase()
    }
}

/**
 * The track a URL points at. Shared by the metadata and the page through
 * React cache(), so Last.fm is asked once per request.
 *
 * The URL scheme writes spaces as hyphens, and reading it back turns every
 * hyphen into a space, including the ones the name really had ("Memories of
 * You -Reload-" comes back as "memories of you  reload "). When Last.fm does
 * not know that name, the real one is looked up among the recent scrobbles,
 * which is where every link on /listening comes from.
 */
const getTrack = cache(async (artistParam: string, trackParam: string) => {
    const lookup = (artist: string, track: string) => api.lastfm.getTrackInfo({ artist, track }).catch(() => null)

    const direct = await lookup(decodeTrackParam(artistParam), decodeTrackParam(trackParam))
    if (direct) return direct

    const recent = await getRecent()
    const scrobble = [recent?.nowPlaying, ...(recent?.recentlyPlayed ?? [])].find(
        (t) =>
            t && encodeTrackParam(t.artist) === slugOf(artistParam) && encodeTrackParam(t.name) === slugOf(trackParam)
    )
    return scrobble ? lookup(scrobble.artist, scrobble.name) : null
})

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { artist: artistParam, track: trackParam } = await params

    const track = await getTrack(artistParam, trackParam)
    // The page itself sends an unknown track to /lost
    if (!track) return { title: 'Lost' }

    const description = `${track.name} by ${track.artist}${track.album ? `, from ${track.album}` : ''}.`
    const cover = track.album ? `Cover of ${track.album}` : `Cover art for ${track.name}`

    return {
        // The root template puts "Alen is" in front, so the tab reads as the URL does
        title: `listening to ${track.name}`,
        description,
        openGraph: {
            title: `Alen is listening to ${track.name}`,
            description,
            images: track.image ? [{ url: track.image, width: 300, height: 300, alt: cover }] : undefined
        },
        twitter: {
            card: 'summary',
            title: `Alen is listening to ${track.name}`,
            description,
            images: track.image ? [track.image] : undefined
        },
        alternates: { canonical: `/listening/to/${artistParam}/${trackParam}` }
    }
}

function formatDuration(ms: number): string {
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

/** "once", "twice", "57 times" */
function formatPlays(n: number): string {
    if (n === 1) return 'once'
    if (n === 2) return 'twice'
    return `${formatNumber(n)} times`
}

export default async function TrackPage({ params }: Props) {
    const { artist: artistParam, track: trackParam } = await params
    const artistName = decodeTrackParam(artistParam)
    const trackName = decodeTrackParam(trackParam)

    const [track, lastFmData, reviewData] = await Promise.all([
        getTrack(artistParam, trackParam),
        getRecent(),
        api.reviews
            .getReview({
                entityId: `${artistName.replace(/\s+/g, '-').toLowerCase()}-${trackName.replace(/\s+/g, '-').toLowerCase()}`,
                type: 'SONG'
            })
            .catch(() => null)
    ])

    if (!track) notFound()

    const isNowPlaying = !!(
        lastFmData?.nowPlaying &&
        lastFmData.nowPlaying.artist.toLowerCase() === track.artist.toLowerCase() &&
        lastFmData.nowPlaying.name.toLowerCase() === track.name.toLowerCase()
    )

    // A streak only counts while the track is the one playing
    const frequency = isNowPlaying && lastFmData ? calculateFrequency(track, lastFmData.recentlyPlayed) : 1
    const { subtitle, banSubtitle, borderGradient, shadowStyle } = getStreakInfo(frequency, isNowPlaying, 'large')

    const duration = track.duration != null && track.duration > 0 ? formatDuration(track.duration) : null
    const plays = track.userPlaycount != null && track.userPlaycount > 0 ? track.userPlaycount : null

    // The numbers as a sentence, once in each voice
    const alenStats = [
        duration && `${duration} long`,
        plays && `scrobbled ${formatPlays(plays)}`,
        track.userLoved && 'loved'
    ].filter((part): part is string => !!part)
    const banStats = [
        duration && `${duration} long.`,
        plays && `I've played it ${formatPlays(plays)}.`,
        track.userLoved && 'The heart was his doing.'
    ].filter((part): part is string => !!part)

    // The eyebrow finishes the sentence the URL starts, and only claims what Last.fm backs up
    const eyebrow = isNowPlaying ? (
        <Persona alen="// i'm listening to" ban="I'm playing" />
    ) : plays ? (
        <Persona alen="// i've listened to" ban="I've played" />
    ) : track.userPlaycount === 0 ? (
        <Persona alen="// never played this one" ban="Not one of mine" />
    ) : (
        <Persona alen="// a track on last.fm" ban="A track on Last.fm" />
    )

    const searchQuery = encodeURIComponent(`${track.artist} ${track.name}`)
    const cover = track.album ? `Cover of ${track.album}` : `Cover art for ${track.name}`

    const links = [
        { label: 'open on last.fm', href: track.url },
        { label: 'search spotify', href: `https://open.spotify.com/search/${searchQuery}` },
        { label: 'search youtube music', href: `https://music.youtube.com/search?q=${searchQuery}` },
        { label: 'search apple music', href: `https://music.apple.com/us/search?term=${searchQuery}` }
    ]

    return (
        <PageTransition>
            <div className="container max-w-3xl py-10 md:py-14">
                <Link
                    href="/listening"
                    className="inline-block mono-label text-muted-foreground/50 hover:text-accent transition-colors mb-10"
                >
                    <Persona alen="back to listening" ban="back to the noise" />
                </Link>

                {/* The cover, with the spinning ring while it is on repeat, same as the card on /listening */}
                <RepeatRing
                    frequency={frequency}
                    gradient={borderGradient}
                    shadow={shadowStyle}
                    className="mb-8 w-full max-w-[300px]"
                >
                    {track.image ? (
                        <div className="relative w-full aspect-square overflow-hidden rounded">
                            <BeamImage src={track.image} alt={cover} sizes="300px" className="object-cover" priority />
                        </div>
                    ) : (
                        <div className="w-full aspect-square bg-muted flex items-center justify-center rounded">
                            <FiHeadphones className="w-12 h-12 text-muted-foreground/30" />
                        </div>
                    )}
                </RepeatRing>

                <p className="mono-label text-muted-foreground/50 mb-4">{eyebrow}</p>
                <h1 className="text-display text-3xl md:text-4xl mb-1 break-words">{track.name}</h1>
                <p className="text-lg text-muted-foreground mb-4">{track.artist}</p>

                {/* Live, so it takes the signal colour */}
                {isNowPlaying && (
                    <div className="flex items-center gap-2 mb-4">
                        <EqualizerBars className="h-3 scale-75 origin-left" />
                        <span className="mono-label text-signal">
                            <Persona alen={subtitle} ban={banSubtitle} />
                            {frequency >= RING_FROM && <span className="ml-1.5 opacity-80">×{frequency}</span>}
                        </span>
                    </div>
                )}

                {alenStats.length > 0 && (
                    <p className="font-mono-ui text-xs text-muted-foreground tabular-nums">
                        <Persona alen={`${alenStats.join(', ')}.`} ban={banStats.join(' ')} />
                    </p>
                )}

                <div className="mt-12 space-y-10">
                    {reviewData && (
                        <section>
                            <div className="section-label mb-3">
                                <Persona alen="my review" ban="his review" />
                            </div>
                            <div className="p-4 rounded-sm border border-dashed border-border/60 space-y-2">
                                {reviewData.rating && (
                                    <p className="font-mono-ui text-sm tabular-nums">
                                        {reviewData.rating}
                                        <span className="text-muted-foreground/50">/10</span>
                                    </p>
                                )}
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                                    {reviewData.content}
                                </p>
                            </div>
                        </section>
                    )}

                    {track.album && (
                        <section>
                            <div className="section-label mb-3">album</div>
                            {track.albumUrl ? (
                                <a
                                    href={track.albumUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm font-medium hover:text-accent transition-colors"
                                >
                                    {track.album}
                                    <span className="ml-1 text-muted-foreground/40" aria-hidden="true">
                                        ↗
                                    </span>
                                </a>
                            ) : (
                                <p className="text-sm font-medium">{track.album}</p>
                            )}
                        </section>
                    )}

                    {track.tags.length > 0 && (
                        <section>
                            <div className="section-label mb-3">tags</div>
                            <p className="mono-label text-muted-foreground/60">{track.tags.join(' · ')}</p>
                        </section>
                    )}

                    {/* Last.fm's wiki summary, so the label says whose words they are */}
                    {track.wiki && (
                        <section>
                            <div className="section-label mb-3">last.fm says</div>
                            <p className="text-sm text-muted-foreground leading-relaxed">{track.wiki}</p>
                        </section>
                    )}

                    <section>
                        <div className="section-label mb-3">elsewhere</div>
                        <ul>
                            {links.map((link) => (
                                <li
                                    key={link.label}
                                    className="border-b border-dashed border-border/40 last:border-b-0"
                                >
                                    <a
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between py-2.5 mono-label text-muted-foreground/60 hover:text-accent transition-colors"
                                    >
                                        {link.label}
                                        <span className="text-muted-foreground/40" aria-hidden="true">
                                            ↗
                                        </span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>
            </div>
        </PageTransition>
    )
}
