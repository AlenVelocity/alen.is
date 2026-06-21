'use client'

import { api } from '@/trpc/react'
import { FiHeadphones, FiExternalLink } from 'react-icons/fi'
import Link from 'next/link'
import Image from 'next/image'
import { calculateFrequency, getStreakInfo } from '@/lib/streak'

export const CurrentlyListening = () => {
    const { data: lastFmData, isLoading, error } = api.lastfm.getRecentTracks.useQuery()

    if (isLoading) {
        return (
            <div className="border-l-2 border-accent/30 pl-4 py-2 animate-pulse">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-muted rounded-sm shrink-0" />
                    <div className="space-y-2 flex-1">
                        <div className="h-3 bg-muted rounded w-32" />
                        <div className="h-3 bg-muted rounded w-20" />
                    </div>
                </div>
            </div>
        )
    }

    if (error || !lastFmData || (lastFmData.recentlyPlayed.length === 0 && !lastFmData.nowPlaying)) {
        return null
    }

    const currentTrack = lastFmData.nowPlaying || lastFmData.recentlyPlayed[0]
    const isNowPlaying = !!lastFmData.nowPlaying
    const nowPlayingFrequency = calculateFrequency(currentTrack, lastFmData.recentlyPlayed)
    const { subtitle } = getStreakInfo(nowPlayingFrequency, isNowPlaying, 'small', true)

    const themeGradient = 'conic-gradient(from 0deg, transparent 0%, transparent 40%, hsl(var(--accent)) 60%, hsl(var(--foreground)) 80%, transparent 100%)'

    return (
        <div className={`relative ${nowPlayingFrequency >= 3 ? 'p-[1px] overflow-hidden' : ''}`}>
            {nowPlayingFrequency >= 3 && (
                <div className="absolute inset-0 overflow-hidden z-[-1]">
                    <div
                        className="absolute left-[50%] top-[50%] w-[800px] h-[800px] ml-[-400px] mt-[-400px] origin-center opacity-30"
                        style={{
                            backgroundImage: themeGradient,
                            animation: 'spin-slow 5s linear infinite'
                        }}
                    />
                </div>
            )}
            <Link
                href="/listening"
                className={`group relative z-10 flex items-center gap-4 p-4 transition-all duration-300 scanline-hover
                    ${nowPlayingFrequency >= 3
                        ? 'bg-card border-l-2 border-accent hover:bg-muted/60'
                        : 'border-l-2 border-border bg-card hover:border-accent/60 hover:bg-muted/40'
                    }`}
            >
                {/* Album art or fallback */}
                {currentTrack.image ? (
                    <div className="relative w-10 h-10 rounded-sm overflow-hidden shrink-0">
                        <Image
                            src={currentTrack.image}
                            alt={`${currentTrack.name} album art`}
                            fill
                            className="object-cover"
                        />
                    </div>
                ) : (
                    <div className="w-10 h-10 bg-muted flex items-center justify-center shrink-0 rounded-sm">
                        <FiHeadphones className="w-4 h-4 text-muted-foreground" />
                    </div>
                )}

                <div className="flex-1 min-w-0">
                    {/* Status label */}
                    <div className="flex items-center gap-2 mb-0.5">
                        {isNowPlaying && (
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent animate-pulse-dot shrink-0" />
                        )}
                        <span className="mono-label text-accent">
                            {subtitle}
                            {nowPlayingFrequency >= 3 && (
                                <span className="ml-1.5 opacity-70">×{nowPlayingFrequency}</span>
                            )}
                        </span>
                    </div>

                    {/* Track name */}
                    <p className="text-display text-sm font-display truncate group-hover:text-accent group-hover:animate-glitch-shift transition-colors duration-200" style={{ fontFamily: 'var(--font-syne), sans-serif' }}>
                        {currentTrack.name}
                    </p>

                    {/* Artist */}
                    <p className="mono-label text-muted-foreground truncate mt-0.5">
                        {currentTrack.artist}
                    </p>
                </div>

                <FiExternalLink className="w-3.5 h-3.5 text-muted-foreground/30 group-hover:text-accent shrink-0 transition-colors duration-200" />
            </Link>
        </div>
    )
}
