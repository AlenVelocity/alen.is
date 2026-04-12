'use client'

import { api } from '@/trpc/react'
import { FiMusic, FiHeadphones, FiExternalLink } from 'react-icons/fi'
import Link from 'next/link'
import Image from 'next/image'
import { calculateFrequency, getStreakInfo } from '@/lib/streak'

export const CurrentlyListening = () => {
    const { data: lastFmData, isLoading, error } = api.lastfm.getRecentTracks.useQuery()

    if (isLoading) {
        return (
            <div className="p-4 rounded-xl border border-border bg-card animate-pulse">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-muted" />
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded w-32" />
                        <div className="h-3 bg-muted rounded w-24" />
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

    // Using constant page theme colors for the spinning effect
    const themeGradient = 'conic-gradient(from 0deg, transparent 0%, transparent 40%, hsl(var(--accent)) 60%, hsl(var(--foreground)) 80%, transparent 100%)'
    const themeShadow = '0 0 12px hsl(var(--accent) / 0.15)'

    return (
        <div className={`relative ${nowPlayingFrequency >= 3 ? 'p-[1px] rounded-xl overflow-visible shadow-sm' : ''}`}>
            {nowPlayingFrequency >= 3 && (
                <>
                    <div
                        className="absolute inset-[1px] rounded-[11px] z-[-1]"
                        style={{ boxShadow: themeShadow }}
                    />
                    <div className="absolute inset-0 rounded-xl overflow-hidden z-[-2]">
                        <div
                            className="absolute left-[50%] top-[50%] w-[1000px] h-[1000px] ml-[-500px] mt-[-500px] origin-center opacity-40 mix-blend-normal"
                            style={{
                                backgroundImage: themeGradient,
                                animation: `spin-slow 4s linear infinite`
                            }}
                        />
                    </div>
                </>
            )}
            <Link 
                href="/listening" 
                className={`group relative z-10 flex items-center gap-4 p-4 transition-all duration-300 ${nowPlayingFrequency >= 3 ? 'bg-card rounded-[11px] hover:bg-muted/80' : 'rounded-xl border border-border bg-card paper-shadow hover:bg-muted/50 hover:border-foreground/20'}`}
            >
                {currentTrack.image ? (
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
                        <Image
                            src={currentTrack.image}
                            alt={`${currentTrack.name} album art`}
                            fill
                            className="object-cover"
                        />
                    </div>
                ) : (
                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
                        <FiHeadphones className="w-5 h-5 text-muted-foreground" />
                    </div>
                )}
                
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                        <FiMusic className="w-3 h-3 text-accent" />
                        <span className="text-xs font-medium text-accent">
                            {subtitle}
                            {nowPlayingFrequency >= 3 && (
                                <span className="ml-1.5 opacity-80 lowercase">x{nowPlayingFrequency}</span>
                            )}
                        </span>
                    </div>
                    <p className="font-medium truncate group-hover:text-foreground transition-colors">
                        {currentTrack.name}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                        {currentTrack.artist}
                    </p>
                </div>
                
                <FiExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </Link>
        </div>
    )
}   
