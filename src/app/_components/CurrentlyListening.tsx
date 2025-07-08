'use client'

import { api } from '@/trpc/react'
import { FaMusic, FaHeadphones, FaExternalLinkAlt } from 'react-icons/fa'
import Link from 'next/link'
import Image from 'next/image'
import { useRef, useEffect, useState } from 'react'

const MarqueeText = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const textRef = useRef<HTMLDivElement>(null)
    const [shouldMarquee, setShouldMarquee] = useState(false)

    useEffect(() => {
        const checkOverflow = () => {
            if (containerRef.current && textRef.current) {
                const containerWidth = containerRef.current.offsetWidth
                const textWidth = textRef.current.scrollWidth
                setShouldMarquee(textWidth > containerWidth)
            }
        }

        checkOverflow()
        window.addEventListener('resize', checkOverflow)
        return () => window.removeEventListener('resize', checkOverflow)
    }, [children])

    return (
        <div ref={containerRef} className="overflow-hidden">
            <div 
                ref={textRef}
                className={`${shouldMarquee ? 'animate-marquee-loop' : ''} ${className}`}
                style={shouldMarquee ? { whiteSpace: 'nowrap' } : {}}
            >
                {children}
                {shouldMarquee && (
                    <>
                        <span className="mx-8">•</span>
                        {children}
                    </>
                )}
            </div>
        </div>
    )
}

export const CurrentlyListening = () => {
    const { data: lastFmData, isLoading, error } = api.lastfm.getRecentTracks.useQuery()

    if (isLoading) {
        return (
            <section className="space-y-4">
                <h2 className="text-2xl font-bold tracking-tight">Currently Listening</h2>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-green-50/50 to-blue-50/50 dark:from-green-950/20 dark:to-blue-950/20 border border-green-200/30 dark:border-green-800/30 animate-pulse">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600"></div>
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                    </div>
                </div>
            </section>
        )
    }

    if (error || !lastFmData || (lastFmData.recentlyPlayed.length === 0 && !lastFmData.nowPlaying)) {
        return null
    }

    const currentTrack = lastFmData.nowPlaying || lastFmData.recentlyPlayed[0]
    const isNowPlaying = !!lastFmData.nowPlaying

    return (
            <div className="group">
                <Link 
                    href="/listening" 
                    className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-green-50/50 to-blue-50/50 dark:from-green-950/20 dark:to-blue-950/20 border border-green-200/30 dark:border-green-800/30 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300 hover:scale-[1.02]"
                >
                    {currentTrack.image ? (
                        <div className={`relative w-16 h-16 rounded-full overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300 ${isNowPlaying ? 'animate-spin-slow' : ''}`}>
                            <Image
                                src={currentTrack.image}
                                alt={`${currentTrack.name} album art`}
                                fill
                                className="object-cover"
                            />
                            {/* Vinyl record effect */}
                            <div className="absolute inset-0 rounded-full border-2 border-black/10 dark:border-white/10">
                                <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-black/20 dark:bg-white/20 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                            </div>
                        </div>
                    ) : (
                        <div className={`w-16 h-16 rounded-full bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 ${isNowPlaying ? 'animate-spin-slow' : 'group-hover:scale-105'}`}>
                            <FaHeadphones className="text-xl text-green-600/70" />
                            {/* Vinyl record effect for placeholder */}
                            <div className="absolute inset-0 rounded-full border-2 border-green-600/20">
                                <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-green-600/30 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                            </div>
                        </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <FaMusic className="w-3 h-3 text-green-600 flex-shrink-0" />
                            <span className="text-sm font-medium text-green-700 dark:text-green-400">
                                {isNowPlaying ? 'Now playing' : 'Recently played'}
                            </span>
                        </div>
                        <div className="hidden md:block">
                            <p className="font-semibold text-foreground truncate group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">
                                {currentTrack.name}
                            </p>
                            <p className="text-sm text-muted-foreground truncate">
                                {currentTrack.artist}
                            </p>
                        </div>
                        <div className="md:hidden">
                            <MarqueeText className="font-semibold text-foreground group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">
                                {currentTrack.name}
                            </MarqueeText>
                            <MarqueeText className="text-sm text-muted-foreground">
                                {currentTrack.artist}
                            </MarqueeText>
                        </div>
                    </div>
                    
                    <div className="items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden group-hover:flex">
                        <FaExternalLinkAlt className="w-3 h-3 text-muted-foreground" />
                        <span className="hidden md:block">View more</span>
                    </div>
                </Link>
            </div>
    )
}   