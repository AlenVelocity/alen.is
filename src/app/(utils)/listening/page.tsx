import { Metadata } from 'next'
import { PageTransition } from '@/components/ui/page-transition'
import { api } from '@/trpc/server'
import { FaHeadphones, FaSpotify, FaExternalLinkAlt } from 'react-icons/fa'
import Image from 'next/image'
import { LinkButton } from '@/components/ui/link-button'
import { SumikaDialog } from './sumika-dialog'
import { formatDistanceToNow, parse } from 'date-fns'

const MusicVisualizer = () => {
    return (
        <div className="flex items-center gap-1 ml-3 group">
            <div className="w-1 h-4 bg-gradient-to-t from-green-500 to-green-400 rounded-full animate-music-bar-1 group-hover:from-green-400 group-hover:to-green-300 transition-colors duration-300"></div>
            <div className="w-1 h-4 bg-gradient-to-t from-green-500 to-green-400 rounded-full animate-music-bar-2 group-hover:from-green-400 group-hover:to-green-300 transition-colors duration-300"></div>
            <div className="w-1 h-4 bg-gradient-to-t from-green-500 to-green-400 rounded-full animate-music-bar-3 group-hover:from-green-400 group-hover:to-green-300 transition-colors duration-300"></div>
            <div className="w-1 h-4 bg-gradient-to-t from-green-500 to-green-400 rounded-full animate-music-bar-4 group-hover:from-green-400 group-hover:to-green-300 transition-colors duration-300"></div>
        </div>
    )
}

const FloatingNote = ({ delay }: { delay: number }) => (
    <div 
        className="absolute text-green-400/20 text-sm animate-float"
        style={{ 
            animationDelay: `${delay}s`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`
        }}
    >
        ♪
    </div>
)

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
            <div className="container mx-auto max-w-4xl px-4 py-8 relative">
                {/* Floating musical notes background */}
                <div className="fixed inset-0 pointer-events-none overflow-hidden">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <FloatingNote key={i} delay={i * 0.5} />
                    ))}
                </div>

                <div className="space-y-12">
                    {/* Header */}
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Listening
                        </h1>
                    </div>

                    {/* Currently Playing */}
                    {lastFmData.nowPlaying && (
                        <div>
                            <h2 className="flex items-center justify-center text-xl font-semibold mb-6 group cursor-default">
                                <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                                    I'm currently listening to
                                </span>
                                <MusicVisualizer />
                            </h2>
                            
                            <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl bg-gradient-to-r from-green-50/50 to-blue-50/50 dark:from-green-950/20 dark:to-blue-950/20 border border-green-200/30 dark:border-green-800/30 backdrop-blur-sm transition-all duration-500 hover:shadow-lg hover:shadow-green-500/10 group">
                                {lastFmData.nowPlaying.image ? (
                                    <div className="relative w-24 h-24 rounded-xl overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                                        <Image
                                            src={lastFmData.nowPlaying.image}
                                            alt={`${lastFmData.nowPlaying.name} album art`}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                                            <div className="absolute bottom-2 left-2 right-2">
                                                <a
                                                    href={lastFmData.nowPlaying.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-white text-xs flex items-center gap-1 hover:text-green-400 transition-colors"
                                                >
                                                    <FaExternalLinkAlt className="w-3 h-3" />
                                                    Last.fm
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 flex items-center justify-center">
                                        <FaHeadphones className="text-2xl text-green-600/70" />
                                    </div>
                                )}
                                
                                <div className="text-center sm:text-left space-y-1">
                                    <h3 className="font-semibold text-lg leading-snug">{lastFmData.nowPlaying.name}</h3>
                                    <p className="text-muted-foreground font-medium">{lastFmData.nowPlaying.artist}</p>
                                    {lastFmData.nowPlaying.album && (
                                        <p className="text-sm text-muted-foreground/80">
                                            {lastFmData.nowPlaying.album}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* About Section */}
                    <div className="space-y-6">
                        <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
                            <p className="hover:text-foreground transition-colors duration-300">
                                I usually only listen to Video Game OSTs (especially from the Persona series) and Japanese
                                Rock. I'm open to suggestions.
                            </p>
                            <p className="hover:text-foreground transition-colors duration-300">
                                There was a time where I went through <SumikaDialog />.
                            </p>
                            <p className="hover:text-foreground transition-colors duration-300">
                                Then{' '}
                                <LinkButton
                                    href="https://open.spotify.com/track/29OHAngqPMvOrDPfl3s9x7?si=ae88719df17c4c95"
                                    target="_blank"
                                    className="text-base font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-blue-500 hover:to-purple-500 transition-all duration-300"
                                >
                                    I faced out, I held out, I reached out to the truth of my life, seeking to seize the
                                    whole moment to break away.
                                </LinkButton>
                            </p>
                        </div>
                    </div>

                    {/* Spotify Playlist */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                            <FaSpotify className="text-green-500" />
                            <span className="bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
                                My recommendations
                            </span>
                        </h2>
                        <div className="rounded-2xl overflow-hidden shadow-xl transition-all duration-500 hover:shadow-2xl hover:shadow-green-500/10 group">
                            <iframe
                                style={{ borderRadius: '16px' }}
                                src="https://open.spotify.com/embed/playlist/7qX8YIOXFWCX4mXgryZrDa?utm_source=generator&theme=0"
                                width="100%"
                                height="152"
                                frameBorder="0"
                                allowFullScreen
                                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                loading="lazy"
                                className="transition-transform duration-500 group-hover:scale-[1.02]"
                            />
                        </div>
                    </div>

                    {/* Recently Played */}
                    {lastFmData.recentlyPlayed.length > 0 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Recently Played</h2>
                            <div className="space-y-3">
                                {lastFmData.recentlyPlayed.map((track, index) => (
                                    <a
                                        key={`${track.name}-${index}`}
                                        href={track.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-all duration-300 border border-transparent hover:border-slate-200/50 dark:hover:border-slate-700/50 group hover:shadow-lg hover:shadow-slate-200/20 dark:hover:shadow-slate-950/20 hover:scale-[1.01]"
                                        style={{ animationDelay: `${0.1 * index}s` }}
                                    >
                                        {track.image ? (
                                            <div className="relative w-14 h-14 rounded-lg overflow-hidden shadow-md group-hover:shadow-lg transition-all duration-300">
                                                <Image
                                                    src={track.image}
                                                    alt={`${track.name} album art`}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                                                <FaHeadphones className="text-xl text-slate-400" />
                                            </div>
                                        )}
                                        
                                        <div className="flex-1 min-w-0 space-y-1">
                                            <h3 className="font-medium truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                                                {track.name}
                                            </h3>
                                            <p className="text-muted-foreground truncate text-sm">{track.artist}</p>
                                        </div>
                                        
                                        {track.date && (
                                            <span className="text-xs text-muted-foreground hidden sm:block opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                                                {(() => {
                                                    try {
                                                        const utcDate = parse(track.date, 'dd MMM yyyy, HH:mm', new Date())
                                                        const localDate = new Date(utcDate.getTime() - utcDate.getTimezoneOffset() * 60000)
                                                        return formatDistanceToNow(localDate, { addSuffix: true })
                                                    } catch (error) {
                                                        console.error('Date parsing error:', track.date)
                                                        return 'Invalid date'
                                                    }
                                                })()}
                                            </span>
                                        )}
                                        
                                        <FaExternalLinkAlt className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:text-blue-500" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Empty State */}
                    {lastFmData.recentlyPlayed.length === 0 && !lastFmData.nowPlaying && (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center mx-auto mb-4">
                                <FaHeadphones className="text-2xl text-slate-400" />
                            </div>
                            <p className="text-muted-foreground">No recently played tracks found.</p>
                        </div>
                    )}
                </div>
            </div>
        </PageTransition>
    )
}
