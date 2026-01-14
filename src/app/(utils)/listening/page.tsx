import { Metadata } from 'next'
import { PageTransition } from '@/components/ui/page-transition'
import { api } from '@/trpc/server'
import { FiHeadphones, FiExternalLink } from 'react-icons/fi'
import { FaSpotify } from 'react-icons/fa'
import Image from 'next/image'
import { LinkButton } from '@/components/ui/link-button'
import { SumikaDialog } from './sumika-dialog'
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
    const lastFmData = await api.lastfm.getRecentTracks()

    return (
        <PageTransition>
            <div className="container max-w-2xl py-12 md:py-20">
                    {/* Header */}
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">Listening</h1>

                    {/* Currently Playing */}
                    {lastFmData.nowPlaying && (
                    <section className="mb-12">
                        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
                            Now Playing
                            </h2>
                        <a
                            href={lastFmData.nowPlaying.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:bg-muted/50 hover:border-foreground/20 transition-all duration-300"
                        >
                                {lastFmData.nowPlaying.image ? (
                                <div className="relative w-16 h-16 rounded-lg overflow-hidden animate-spin-slow">
                                        <Image
                                            src={lastFmData.nowPlaying.image}
                                            alt={`${lastFmData.nowPlaying.name} album art`}
                                            fill
                                        className="object-cover"
                                        />
                                    </div>
                                ) : (
                                <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                                    <FiHeadphones className="w-6 h-6 text-muted-foreground" />
                                    </div>
                                )}
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold truncate group-hover:text-foreground transition-colors">
                                    {lastFmData.nowPlaying.name}
                                </p>
                                <p className="text-muted-foreground truncate">{lastFmData.nowPlaying.artist}</p>
                                    {lastFmData.nowPlaying.album && (
                                    <p className="text-sm text-muted-foreground/70 truncate">{lastFmData.nowPlaying.album}</p>
                                    )}
                            </div>
                            <FiExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
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
                        {' '}(if you know, you know).
                            </p>
                </section>

                {/* Spotify */}
                <section className="mb-12">
                    <h2 className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
                        <FaSpotify className="text-[#1DB954]" />
                        Recommendations
                        </h2>
                    <div className="rounded-xl overflow-hidden border border-border">
                            <iframe
                                src="https://open.spotify.com/embed/playlist/7qX8YIOXFWCX4mXgryZrDa?utm_source=generator&theme=0"
                                width="100%"
                                height="152"
                                frameBorder="0"
                                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                loading="lazy"
                            />
                    </div>
                </section>

                    {/* Recently Played */}
                    {lastFmData.recentlyPlayed.length > 0 && (
                    <section>
                        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
                            Recently Played
                        </h2>
                        <div className="space-y-2">
                                {lastFmData.recentlyPlayed.map((track, index) => (
                                    <a
                                        key={`${track.name}-${index}`}
                                        href={track.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    className="group flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                                    >
                                        {track.image ? (
                                        <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0">
                                            <Image src={track.image} alt={track.name} fill className="object-cover" />
                                            </div>
                                        ) : (
                                        <div className="w-10 h-10 rounded bg-muted flex items-center justify-center flex-shrink-0">
                                            <FiHeadphones className="w-4 h-4 text-muted-foreground" />
                                            </div>
                                        )}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate group-hover:text-foreground transition-colors">
                                                {track.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
                                        </div>
                                        {track.date && (
                                        <span className="text-xs text-muted-foreground hidden sm:block">
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
                                    </a>
                                ))}
                        </div>
                    </section>
                    )}

                    {/* Empty State */}
                    {lastFmData.recentlyPlayed.length === 0 && !lastFmData.nowPlaying && (
                        <div className="text-center py-12">
                        <FiHeadphones className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">No recently played tracks found.</p>
                        </div>
                    )}
            </div>
        </PageTransition>
    )
}
