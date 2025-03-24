import { Metadata } from "next"
import { PageTransition } from "@/components/ui/page-transition"
import { api } from "@/trpc/server"
import { FaHeadphones, FaHistory, FaUserAlt } from "react-icons/fa"
import Image from "next/image"
import { MusicVisualizer } from "./music-visualizer"

export const metadata: Metadata = {
  title: "Alen is Listening",
  description: "My recent listening history"
}

export default async function Listening() {
  const lastFmData = await api.lastfm.getRecentTracks();
  
  return (
    <PageTransition>
      <div className="container py-12">
        <div className="flex flex-col items-center justify-center min-h-[70vh]">
          <div className="w-full max-w-3xl"> 
            {lastFmData.nowPlaying && (
              <div className="p-6 rounded-lg mb-8 border border-green-500/20">
                <h2 className="flex items-center text-xl font-semibold mb-4 space-x-2">
                    <MusicVisualizer />
                    <span>Now Playing</span>
                </h2>
                <div className="flex items-center">
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
                          className="text-white hover:text-green-400 transition-colors"
                        >
                          View on Last.fm
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="w-24 h-24 mr-4 rounded bg-neutral-800 flex items-center justify-center">
                      <FaHeadphones className="text-3xl text-neutral-500" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-medium">{lastFmData.nowPlaying.name}</h3>
                    <p className="text-muted-foreground">{lastFmData.nowPlaying.artist}</p>
                    {lastFmData.nowPlaying.album && (
                      <p className="text-sm text-muted-foreground mt-1">Album: {lastFmData.nowPlaying.album}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {lastFmData.recentlyPlayed.length > 0 && (
              <div>
                <h2 className="flex items-center text-xl font-semibold mb-4">
                  <FaHistory className="mr-2 text-muted-foreground" />
                  Recently Played
                </h2>
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
                          {track.date}
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