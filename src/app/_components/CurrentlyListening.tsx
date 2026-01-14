'use client'

import { api } from '@/trpc/react'
import { FiMusic, FiHeadphones, FiExternalLink } from 'react-icons/fi'
import Link from 'next/link'
import Image from 'next/image'

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

    return (
        <Link 
            href="/listening" 
            className="group flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:bg-muted/50 hover:border-foreground/20 transition-all duration-300"
        >
            {currentTrack.image ? (
                <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                    <Image
                        src={currentTrack.image}
                        alt={`${currentTrack.name} album art`}
                        fill
                        className="object-cover"
                    />
                </div>
            ) : (
                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                    <FiHeadphones className="w-5 h-5 text-muted-foreground" />
                </div>
            )}
            
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                    <FiMusic className="w-3 h-3 text-accent" />
                    <span className="text-xs font-medium text-accent">
                        {isNowPlaying ? 'Now playing' : 'Recently played'}
                    </span>
                </div>
                <p className="font-medium truncate group-hover:text-foreground transition-colors">
                    {currentTrack.name}
                </p>
                <p className="text-sm text-muted-foreground truncate">
                    {currentTrack.artist}
                </p>
            </div>
            
            <FiExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
    )
}
