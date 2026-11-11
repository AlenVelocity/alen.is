import { Suspense, cache } from 'react'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { FiHeadphones } from 'react-icons/fi'
import { formatDistanceToNowStrict, parse } from 'date-fns'
import { api } from '@/trpc/server'
import { constructMetadata } from '@/lib/metadata'
import { encodeTrackParam } from '@/lib/lastfm'
import { calculateFrequency, getStreakInfo, RING_FROM } from '@/lib/streak'
import { Persona } from '@/components/persona'
import { PageTransition } from '@/components/ui/page-transition'
import { PageHeader } from '@/components/ui/page-header'
import { StreamFade } from '@/components/ui/stream-fade'
import { RepeatRing } from '@/components/ui/repeat-ring'
import { BeamImage } from '@/components/ui/beam-image'
import { EmptyState } from '@/components/ui/empty-state'
import { LinkButton } from '@/components/ui/link-button'
import { SkeletonBar, SkeletonLine, SkeletonTile, ScrobbleRowsSkeleton } from '@/components/ui/signal-skeleton'
import { SumikaDialog } from './sumika-dialog'
import { TopSignals, EqualizerBars } from './_components/top-signals'

export const metadata: Metadata = constructMetadata({
    title: 'Listening',
    description:
        "What I'm playing right now and what I played before it, from Last.fm. Mostly video game soundtracks and Japanese rock.",
    slug: 'listening',
    ogTitle: 'Alen is Listening'
})

/** How far back the page looks. Also the number in the "most played" label */
const SCROBBLE_WINDOW = 200
/** Artists in the "most played" chart */
const TOP_ARTISTS = 6
/** Rows in the recent list, after repeats are folded together */
const RECENT_ROWS = 20

const TRUTH_URL = 'https://open.spotify.com/track/29OHAngqPMvOrDPfl3s9x7?si=ae88719df17c4c95'

/**
 * One Last.fm round trip per request, shared by every section below through
 * React cache(): each Suspense boundary awaits the same promise, so the static
 * parts of the page go out at once and the scrobble sections arrive together.
 * Resolves to null when Last.fm does not answer, so one section can say so
 * and the rest of the page still renders.
 */
const getScrobbles = cache(async () => {
    try {
        return await api.lastfm.getRecentTracks({ limit: SCROBBLE_WINDOW })
    } catch {
        return null
    }
})

export default function Listening() {
    return (
        <PageTransition>
            <div className="container max-w-3xl py-10 md:py-14">
                <PageHeader
                    eyebrow="what's on loop"
                    title="Listening"
                    banTitle="Noise"
                    titleExtra={
                        <Suspense fallback={null}>
                            <LiveEqualizer />
                        </Suspense>
                    }
                >
                    <p className="text-[0.9rem] text-muted-foreground">
                        <Persona
                            alen="Everything I play gets scrobbled to Last.fm and ends up here."
                            ban="Everything I play gets written down. I've got nothing to hide and I'm not turning it down."
                        />
                    </p>
                </PageHeader>

                <Suspense fallback={<NowPlayingSkeleton />}>
                    <NowPlayingSection />
                </Suspense>

                <section className="mb-14 space-y-4 text-muted-foreground leading-relaxed">
                    <p>
                        <Persona
                            alen="Mostly video game OSTs (Persona is elite) and Japanese rock. Always down for recommendations though."
                            ban="He takes recommendations. I don't. It's video game soundtracks and Japanese rock here, and nothing beats Persona's."
                        />
                    </p>
                    <p>
                        <Persona
                            alen={
                                <>
                                    There was a year where <SumikaDialog>only listening to sumika</SumikaDialog> was
                                    basically my whole personality.
                                </>
                            }
                            ban={
                                <>
                                    I played sumika for 76,178 minutes in one year and{' '}
                                    <SumikaDialog>kept the receipt</SumikaDialog>.
                                </>
                            }
                        />
                    </p>
                    <p>
                        <Persona
                            alen={
                                <>
                                    Now I&apos;ve{' '}
                                    <LinkButton href={TRUTH_URL} target="_blank">
                                        reached out to the truth
                                    </LinkButton>{' '}
                                    (iykyk)
                                </>
                            }
                            ban={
                                <>
                                    After that I{' '}
                                    <LinkButton href={TRUTH_URL} target="_blank">
                                        reached out to the truth
                                    </LinkButton>
                                    . I&apos;m not explaining that.
                                </>
                            }
                        />
                    </p>
                </section>

                <Suspense fallback={<MostPlayedSkeleton />}>
                    <MostPlayedSection />
                </Suspense>

                <Suspense fallback={<RecentScrobblesSkeleton />}>
                    <RecentScrobblesSection />
                </Suspense>

                {/* A playlist, last, at the player's compact height */}
                <section className="mt-14">
                    <div className="section-label mb-4">a playlist</div>
                    <div className="rounded overflow-hidden border border-border">
                        <iframe
                            allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write"
                            frameBorder="0"
                            height="175"
                            loading="lazy"
                            style={{ width: '100%', overflow: 'hidden' }}
                            sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
                            src="https://embed.music.apple.com/in/playlist/writers-room/pl.u-gxblgd1Tb9VXoJA"
                            title="Apple Music playlist: writers room"
                        />
                    </div>
                </section>
            </div>
        </PageTransition>
    )
}

/** Section labels, shared by each section and the skeleton that holds its place */
const MOST_PLAYED_LABEL = `most played, last ${SCROBBLE_WINDOW} scrobbles`
const recentLabel = <Persona alen="recent scrobbles" ban="played before" />

/** Percent-encoded on top of the slug, so a "/" or "?" in a name stays inside its path segment */
function trackHref(track: { artist: string; name: string }) {
    const segment = (value: string) => encodeURIComponent(encodeTrackParam(value))
    return `/listening/to/${segment(track.artist)}/${segment(track.name)}`
}

/** "4 days ago" from Last.fm's "dd MMM yyyy, HH:mm" UTC stamp. Empty while a track is still playing */
function scrobbledAgo(date: string | null | undefined): string {
    if (!date) return ''
    try {
        const utcDate = parse(date, 'dd MMM yyyy, HH:mm', new Date())
        const localDate = new Date(utcDate.getTime() - utcDate.getTimezoneOffset() * 60000)
        return formatDistanceToNowStrict(localDate, { addSuffix: true })
    } catch {
        return ''
    }
}

/**
 * Skeletons. Each is built from the same boxes as the section that replaces
 * it (same grid, same line heights, same number of rows), so nothing below it
 * moves when Last.fm answers.
 */

function NowPlayingSkeleton() {
    return (
        <section className="mb-14" aria-hidden="true">
            {/* Whether this is "now playing" or "last played" is not known yet */}
            <div className="section-label mb-4">
                <SkeletonBar width="5rem" height="0.5rem" />
            </div>
            <div className="flex items-center gap-4 py-4 border-b border-dashed border-border">
                <SkeletonTile className="w-14 h-14" />
                <div className="flex-1 min-w-0">
                    <SkeletonLine className="mono-label mb-0.5" width="5rem" />
                    <SkeletonLine className="font-semibold" width="55%" />
                    <SkeletonLine className="text-sm" width="40%" />
                </div>
            </div>
        </section>
    )
}

function MostPlayedSkeleton() {
    return (
        <section className="mb-14" aria-hidden="true">
            <div className="section-label mb-4">{MOST_PLAYED_LABEL}</div>
            <div>
                {[...Array(TOP_ARTISTS)].map((_, i) => (
                    <div key={i} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 py-2.5">
                        <SkeletonTile className="w-8 h-8" />
                        <div className="min-w-0">
                            <SkeletonLine className="text-sm mb-1" width={`${30 + ((i * 13) % 30)}%`} />
                            <div className="h-1 bg-muted/60 rounded-sm" />
                        </div>
                        <SkeletonLine className="mono-label" width="1.5rem" />
                    </div>
                ))}
            </div>
        </section>
    )
}

function RecentScrobblesSkeleton() {
    return (
        <section aria-hidden="true">
            <div className="section-label mb-4">{recentLabel}</div>
            <ScrobbleRowsSkeleton rows={RECENT_ROWS} />
        </section>
    )
}

/** Streamed sections. Each awaits the same getScrobbles() promise. */

/** The equalizer beside the title. It is a live indicator, so it is only there while something plays */
async function LiveEqualizer() {
    const scrobbles = await getScrobbles()
    return scrobbles?.nowPlaying ? <EqualizerBars /> : null
}

/**
 * The top slot always holds a track, so the page keeps its shape: the one
 * playing now, or failing that the last one played. Only a playing track gets
 * the equalizer, the signal colour and the ring.
 */
async function NowPlayingSection() {
    const scrobbles = await getScrobbles()
    const track = scrobbles?.nowPlaying ?? scrobbles?.recentlyPlayed[0]
    if (!scrobbles || !track) return null

    const isLive = !!scrobbles.nowPlaying
    const frequency = isLive ? calculateFrequency(track, scrobbles.recentlyPlayed) : 1
    const { subtitle, banSubtitle, borderGradient, shadowStyle } = getStreakInfo(frequency, isLive, 'large')
    const onRepeat = frequency >= RING_FROM
    const ago = scrobbledAgo(track.date)

    return (
        <StreamFade>
            <section className="mb-14">
                <div className="section-label mb-4">
                    {isLive ? <Persona alen="now playing" ban="playing now" /> : 'last played'}
                </div>
                <RepeatRing
                    frequency={frequency}
                    gradient={borderGradient}
                    shadow={shadowStyle}
                    className={onRepeat ? '' : 'border-b border-dashed border-border'}
                >
                    <Link
                        href={trackHref(track)}
                        className={`group relative z-10 flex items-center gap-4 ${onRepeat ? 'bg-card p-4 rounded' : 'py-4'}`}
                    >
                        {track.image ? (
                            <div className="relative w-14 h-14 rounded overflow-hidden shrink-0">
                                <BeamImage
                                    src={track.image}
                                    alt={track.album ? `Cover of ${track.album}` : `Cover art for ${track.name}`}
                                    sizes="56px"
                                    className="object-cover"
                                />
                            </div>
                        ) : (
                            <div className="w-14 h-14 rounded bg-muted flex items-center justify-center shrink-0">
                                <FiHeadphones className="w-5 h-5 text-muted-foreground" />
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            {isLive ? (
                                <div className="flex items-center gap-2 mb-0.5">
                                    <EqualizerBars className="h-3 scale-75 origin-left" />
                                    <span className="mono-label text-signal">
                                        <Persona alen={subtitle} ban={banSubtitle} />
                                        {onRepeat && <span className="ml-1.5 opacity-80">×{frequency}</span>}
                                    </span>
                                </div>
                            ) : (
                                <p className="mono-label text-muted-foreground/60 mb-0.5">
                                    {ago || <Persona alen={subtitle} ban={banSubtitle} />}
                                </p>
                            )}
                            <p className="font-semibold truncate group-hover:text-accent transition-colors">
                                {track.name}
                            </p>
                            <p className="text-sm text-muted-foreground truncate">
                                {track.artist}
                                {track.album && <span className="text-muted-foreground/50"> · {track.album}</span>}
                            </p>
                        </div>
                    </Link>
                </RepeatRing>
            </section>
        </StreamFade>
    )
}

async function MostPlayedSection() {
    const scrobbles = await getScrobbles()
    if (!scrobbles) return null

    // Plays per artist across the whole window
    const artistCounts = scrobbles.recentlyPlayed.reduce((map, track) => {
        map.set(track.artist, (map.get(track.artist) ?? 0) + 1)
        return map
    }, new Map<string, number>())
    const topArtists = [...artistCounts.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, TOP_ARTISTS)
        .map(([artist, count]) => ({ artist, count }))

    if (topArtists.length === 0) return null

    let artistImages: { artist: string; image: string | null }[] = []
    try {
        artistImages = await api.lastfm.getArtistImages({
            artists: topArtists.map((s) => s.artist)
        })
    } catch {
        // No pictures is fine: the rows fall back to the headphones tile
    }

    const imageMap = new Map(artistImages.map((a) => [a.artist, a.image]))
    const signals = topArtists.map((s) => ({
        ...s,
        image: imageMap.get(s.artist) ?? null
    }))

    return (
        <StreamFade>
            <section className="mb-14">
                <div className="section-label mb-4">{MOST_PLAYED_LABEL}</div>
                <TopSignals signals={signals} />
            </section>
        </StreamFade>
    )
}

async function RecentScrobblesSection() {
    const scrobbles = await getScrobbles()

    if (!scrobbles) {
        return (
            <StreamFade>
                <section>
                    <div className="section-label mb-4">{recentLabel}</div>
                    <EmptyState>
                        <Persona
                            alen="last.fm isn't answering right now."
                            ban="Last.fm isn't answering. I'm still playing, you just can't see it."
                        />
                    </EmptyState>
                </section>
            </StreamFade>
        )
    }

    // Fold consecutive repeats of the same track into one row with a ×N count
    const groupedTracks = scrobbles.recentlyPlayed.reduce(
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
        [] as ((typeof scrobbles.recentlyPlayed)[0] & { key: string; count: number })[]
    )
    const displayTracks = groupedTracks.slice(0, RECENT_ROWS)

    if (displayTracks.length === 0) {
        return (
            <StreamFade>
                <section>
                    <div className="section-label mb-4">{recentLabel}</div>
                    <EmptyState>
                        <Persona
                            alen="nothing scrobbled lately. tracks land here as i play them."
                            ban="Nothing played lately. I've been quiet. It won't last."
                        />
                    </EmptyState>
                </section>
            </StreamFade>
        )
    }

    return (
        <StreamFade>
            <section>
                <div className="section-label mb-4">{recentLabel}</div>
                <div>
                    {displayTracks.map((track, index) => (
                        <Link
                            key={`${track.key}-${index}`}
                            href={trackHref(track)}
                            className="group grid gap-x-8 md:grid-cols-[10rem_1fr] items-center py-2.5 border-b border-dashed border-border/50 last:border-b-0"
                        >
                            <span className="hidden md:block mono-label text-muted-foreground/40 tabular-nums">
                                {scrobbledAgo(track.date)}
                            </span>
                            <div className="flex items-center gap-3 min-w-0">
                                {/* Small and repeated, so a plain image, and decorative: the name is beside it */}
                                {track.image ? (
                                    <div className="relative w-9 h-9 rounded overflow-hidden shrink-0">
                                        <Image src={track.image} alt="" fill sizes="36px" className="object-cover" />
                                    </div>
                                ) : (
                                    <div className="w-9 h-9 rounded bg-muted flex items-center justify-center shrink-0">
                                        <FiHeadphones className="w-3.5 h-3.5 text-muted-foreground" />
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-medium truncate group-hover:text-accent transition-colors">
                                            {track.name}
                                        </p>
                                        {track.count > 1 && (
                                            <span className="shrink-0 mono-label text-muted-foreground/60 tabular-nums">
                                                ×{track.count}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
                                </div>
                                <span className="md:hidden mono-label text-muted-foreground/40 shrink-0 tabular-nums">
                                    {scrobbledAgo(track.date)}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </StreamFade>
    )
}
