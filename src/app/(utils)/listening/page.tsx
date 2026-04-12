import { Metadata } from 'next'
import { PageTransition } from '@/components/ui/page-transition'
import { api } from '@/trpc/server'
import { FiHeadphones, FiArrowUpRight } from 'react-icons/fi'
import { FaSpotify } from 'react-icons/fa'
import Image from 'next/image'
import Link from 'next/link'
import { LinkButton } from '@/components/ui/link-button'
import { CollapsibleSection } from '@/components/ui/collapsible-section'
import { SumikaDialog } from './sumika-dialog'
import { encodeTrackParam } from '@/lib/lastfm'
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

export default async function Listening() {
    const [lastFmData, songReviews] = await Promise.all([
        api.lastfm.getRecentTracks({ limit: 200 }),
        api.reviews.getReviewsByType({ type: 'SONG' }),
    ])

    const groupedTracks = lastFmData.recentlyPlayed.reduce((acc, track) => {
        const key = `${track.name}:::${track.artist}`
        const last = acc[acc.length - 1]
        if (last && last.key === key) {
            last.count += 1
        } else {
            acc.push({ ...track, key, count: 1 })
        }
        return acc
    }, [] as (typeof lastFmData.recentlyPlayed[0] & { key: string, count: number })[])

    const displayTracks = groupedTracks.slice(0, 20)

    let nowPlayingFrequency = 1
    if (lastFmData.nowPlaying) {
        for (const track of lastFmData.recentlyPlayed) {
            if (track.name === lastFmData.nowPlaying.name && track.artist === lastFmData.nowPlaying.artist) {
                nowPlayingFrequency++
            } else {
                break
            }
        }
    }

    let nowPlayingSubtitle = "Live"
    if (nowPlayingFrequency >= 50) nowPlayingSubtitle = "I'm in love"
    else if (nowPlayingFrequency >= 25) nowPlayingSubtitle = "Addicted"
    else if (nowPlayingFrequency >= 20) nowPlayingSubtitle = "Unhealthy"
    else if (nowPlayingFrequency >= 15) nowPlayingSubtitle = "Obsessed"
    else if (nowPlayingFrequency >= 10) nowPlayingSubtitle = "Can't Get Enough"
    else if (nowPlayingFrequency >= 7) nowPlayingSubtitle = "Heavy Rotation"
    else if (nowPlayingFrequency >= 5) nowPlayingSubtitle = "Running It Back"
    else if (nowPlayingFrequency >= 3) nowPlayingSubtitle = "On Repeat"

    let borderGradient = 'conic-gradient(from 0deg, #ff0000, #ff8000, #ffff00, #00ff00, #0000ff, #8000ff, #ff0000)'
    let shadowStyle = undefined
    if (nowPlayingFrequency >= 50) {
        borderGradient = 'conic-gradient(from 0deg, #090014, #ff007f, #330066, #00f0ff, #090014)'
        shadowStyle = '0 0 40px rgba(255, 0, 127, 0.4)'
    } else if (nowPlayingFrequency >= 25) {
        borderGradient = 'conic-gradient(from 0deg, #ff0055, #ff00ff, #00ffff, #ff00ff, #ff0055)'
        shadowStyle = '0 0 30px rgba(255, 0, 255, 0.3)'
    } else if (nowPlayingFrequency >= 20) {
        borderGradient = 'conic-gradient(from 0deg, #ff6a00, #ffb300, #ffeb3b, #ffb300, #ff6a00)'
        shadowStyle = '0 0 20px rgba(255, 179, 0, 0.3)'
    } else if (nowPlayingFrequency >= 3) {
        shadowStyle = '0 0 15px rgba(0, 255, 0, 0.15)'
    }


    return (
        <PageTransition>
            <div className="container max-w-2xl py-12 md:py-20">
                {/* Header */}
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">Listening</h1>

                {/* Currently Playing */}
                {lastFmData.nowPlaying && (
                    <section className="mb-12">
                        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider border-l-2 border-accent pl-3 mb-4">
                            Now Playing
                        </h2>
                        <div className={`relative ${nowPlayingFrequency >= 3 ? 'p-[2px] rounded-xl overflow-visible' : 'border-b border-dashed border-border'}`}>
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
                                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent animate-pulse-subtle" />
                                        <span className="text-xs font-medium text-accent uppercase tracking-wider">
                                            {nowPlayingSubtitle}
                                            {nowPlayingFrequency >= 3 && <span className="ml-1.5 opacity-80 lowercase">x{nowPlayingFrequency}</span>}
                                        </span>
                                    </div>
                                    <p className="font-semibold truncate group-hover:text-accent transition-colors">
                                        {lastFmData.nowPlaying.name}
                                    </p>
                                    <p className="text-sm text-muted-foreground truncate">
                                        {lastFmData.nowPlaying.artist}
                                        {lastFmData.nowPlaying.album && <span className="text-muted-foreground/50"> · {lastFmData.nowPlaying.album}</span>}
                                    </p>
                                </div>
                                <FiArrowUpRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-accent transition-colors shrink-0" />
                            </Link>
                        </div>
                    </section>
                )}

                {/* About */}
                <section className="mb-12 space-y-4 text-muted-foreground leading-relaxed">
                    <p>
                        Mostly video game OSTs (Persona is elite) and Japanese rock. Always down for recommendations though.
                    </p>
                    <p>There was a year where <SumikaDialog /> was basically my entire personality.</p>
                    <p>
                        Now I've{' '}
                        <LinkButton
                            href="https://open.spotify.com/track/29OHAngqPMvOrDPfl3s9x7?si=ae88719df17c4c95"
                            target="_blank"
                        >
                            reached out to the truth
                        </LinkButton>
                        {' '}(iykyk)
                    </p>
                </section>

                {/* My Reviews */}
                {songReviews && songReviews.length > 0 && (
                    <CollapsibleSection title="My Reviews">
                        <div>
                            {songReviews.map((review) => (
                                <div
                                    key={review.id}
                                    className="group flex items-start gap-3 py-2.5 border-b border-dashed border-border/50 last:border-b-0 hover:border-accent/30 transition-colors"
                                >
                                    {review.image ? (
                                        <div className="relative w-9 h-9 rounded overflow-hidden flex-shrink-0">
                                            <Image src={review.image} alt={review.name} fill className="object-cover" />
                                        </div>
                                    ) : (
                                        <div className="w-9 h-9 rounded bg-muted flex items-center justify-center flex-shrink-0">
                                            <FiHeadphones className="w-3.5 h-3.5 text-muted-foreground" />
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <p className="text-sm font-medium truncate">{review.name}</p>
                                            {review.rating && (
                                                <span className="shrink-0 inline-flex items-center px-1.5 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-[10px] font-semibold text-accent">
                                                    {review.rating}/10
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground line-clamp-2">{review.content}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CollapsibleSection>
                )}

                {/* Apple Music */}
                <section className="mb-12">
                    <h2 className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider border-l-2 border-accent pl-3 mb-4">
                        <FiHeadphones className="text-[#FA243C]" />
                        My Current Playlist
                    </h2>
                    <div className="flex justify-center rounded-xl overflow-hidden border border-border">
                        <iframe
                            allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write"
                            frameBorder="0"
                            height="450"
                            style={{ width: '100%', maxWidth: '660px', overflow: 'hidden', borderRadius: '10px' }}
                            sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
                            src="https://embed.music.apple.com/in/playlist/writers-room/pl.u-gxblgd1Tb9VXoJA"
                        />
                    </div>
                </section>

                {/* Recently Played */}
                {displayTracks.length > 0 && (
                    <section>
                        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider border-l-2 border-accent pl-3 mb-4">
                            Recently Played
                        </h2>
                        <div>
                            {displayTracks.map((track, index) => (
                                <Link
                                    key={`${track.name}-${index}`}
                                    href={`/listening/to/${encodeTrackParam(track.artist)}/${encodeTrackParam(track.name)}`}
                                    className="group flex items-center gap-3 py-2.5 border-b border-dashed border-border/50 last:border-b-0 hover:border-accent/30 transition-colors"
                                >
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
                                                <span className="shrink-0 text-xs text-muted-foreground/60 font-medium">
                                                    x{track.count}
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
                                                    const localDate = new Date(utcDate.getTime() - utcDate.getTimezoneOffset() * 60000)
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
                )}

                {/* Empty State */}
                {displayTracks.length === 0 && !lastFmData.nowPlaying && (
                    <div className="text-center py-12">
                        <FiHeadphones className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No recently played tracks found.</p>
                    </div>
                )}
            </div>
        </PageTransition>
    )
}
