import { Metadata } from 'next'
import { PageTransition } from '@/components/ui/page-transition'
import { api } from '@/trpc/server'
import { FaHeadphones } from 'react-icons/fa'
import Image from 'next/image'
import { LinkButton } from '@/components/ui/link-button'
import { SumikaDialog } from './sumika-dialog'
import { formatDistanceToNow, parse } from 'date-fns'

const MusicVisualizer = () => {
    return (
        <div className="flex items-center gap-0.5 ml-2">
            <div className="w-1 h-3 bg-green-500 animate-music-bar-1"></div>
            <div className="w-1 h-3 bg-green-500 animate-music-bar-2"></div>
            <div className="w-1 h-3 bg-green-500 animate-music-bar-3"></div>
            <div className="w-1 h-3 bg-green-500 animate-music-bar-4"></div>
        </div>
    )
}

export const metadata: Metadata = {
    title: 'Alen is Listening',
    description: 'My music listening history',
    openGraph: {
        title: 'Alen is Listening',
        description: 'My music listening history',
        images: [
            '/og.jpg',
            {
                url: '/sumika-wrapped.png',
                width: 250,
                height: 250,
                alt: "Alen's Year of Sumika Listening Statistics"
            }
        ]
    },
    alternates: {
        canonical: '/listening'
    }
}

export default async function Listening() {
    const lastFmData = await api.lastfm.getRecentTracks()

    return (
        <PageTransition>
            <div className="container py-12">
                <div className="flex flex-col items-center justify-center min-h-[70vh]">
                    <div className="w-full max-w-3xl">
                        <h1 className="text-2xl font-semibold mb-4">Listening</h1>
                        {lastFmData.nowPlaying && (
                            <>
                                <h2 className="flex items-center text-xl font-semibold mb-4 space-x-2">
                                    <span>I&apos;m currently listening to</span>
                                    <MusicVisualizer />
                                </h2>
                                <div className="flex items-center mb-8">
                                    {lastFmData.nowPlaying.image ? (
                                        <div className="relative w-24 h-24 mr-4 rounded overflow-hidden shadow-md group">
                                            <Image
                                                src={lastFmData.nowPlaying.image}
                                                alt={`${lastFmData.nowPlaying.name} album art`}
                                                fill
                                                className="object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <a
                                                    href={lastFmData.nowPlaying.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-center text-white hover:text-green-400 transition-colors"
                                                >
                                                    View on Last.fm
                                                </a>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="w-24 h-24 mr-4 rounded bg-neutral-800 flex items-center justify-center"></div>
                                    )}
                                    <div>
                                        <h3 className="font-medium">{lastFmData.nowPlaying.name}</h3>
                                        <p className="text-muted-foreground">{lastFmData.nowPlaying.artist}</p>
                                        {lastFmData.nowPlaying.album && (
                                            <p className="text-sm text-muted-foreground mt-1">
                                                {lastFmData.nowPlaying.album}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}

                        <p className="text-muted-foreground mb-3 text-base">
                            I usually only listen to Video Game OSTs (especially from the Persona series) and Japanese
                            Rock. I&apos;m open to suggestions.
                        </p>
                        <p className="text-muted-foreground mb-3 text-base">
                            There was a time where I went through <SumikaDialog />.
                        </p>
                        <p className="text-muted-foreground mb-8 text-base">
                            Then{' '}
                            <LinkButton
                                href="https://open.spotify.com/track/29OHAngqPMvOrDPfl3s9x7?si=ae88719df17c4c95"
                                target="_blank"
                                className="text-base"
                            >
                                I faced out, I held out, I reached out to the truth of my life, seeking to seize the
                                whole moment to break away.
                            </LinkButton>
                        </p>

                        <div className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">My recommendations</h2>
                            <iframe
                                style={{ borderRadius: '12px' }}
                                src="https://open.spotify.com/embed/playlist/7qX8YIOXFWCX4mXgryZrDa?utm_source=generator&theme=0"
                                width="100%"
                                height="152"
                                frameBorder="0"
                                allowFullScreen
                                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                loading="lazy"
                            />
                        </div>

                        {lastFmData.recentlyPlayed.length > 0 && (
                            <div>
                                <h2 className="flex items-center text-xl font-semibold mb-4">Recently Played</h2>
                                <div className="space-y-4">
                                    {lastFmData.recentlyPlayed.map((track, index) => (
                                        <a
                                            key={`${track.name}-${index}`}
                                            href={track.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center p-4 rounded-lg hover:bg-foreground/5 transition-colors border border-transparent hover:border-foreground/10"
                                        >
                                            {track.image ? (
                                                <div className="relative w-16 h-16 mr-4 rounded overflow-hidden shadow-sm">
                                                    <Image
                                                        src={track.image}
                                                        alt={`${track.name} album art`}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-16 h-16 mr-4 rounded bg-neutral-800 flex items-center justify-center">
                                                    <FaHeadphones className="text-xl text-neutral-500" />
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium truncate">{track.name}</h3>
                                                <p className="text-muted-foreground truncate">{track.artist}</p>
                                            </div>
                                            {track.date && (
                                                <span className="text-xs text-muted-foreground ml-2 hidden sm:block">
                                                    {(() => {
                                                        try {
                                                            // Parse the UTC date string
                                                            const utcDate = parse(
                                                                track.date,
                                                                'dd MMM yyyy, HH:mm',
                                                                new Date()
                                                            )
                                                            // Convert UTC to local time
                                                            const localDate = new Date(
                                                                utcDate.getTime() - utcDate.getTimezoneOffset() * 60000
                                                            )
                                                            return formatDistanceToNow(localDate, { addSuffix: true })
                                                        } catch (error) {
                                                            console.error('Date parsing error:', track.date)
                                                            return 'Invalid date'
                                                        }
                                                    })()}
                                                </span>
                                            )}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        {lastFmData.recentlyPlayed.length === 0 && !lastFmData.nowPlaying && (
                            <div className="p-6 text-center bg-foreground/5 rounded-lg">
                                <p className="text-muted-foreground">No recently played tracks found.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PageTransition>
    )
}
