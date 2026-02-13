import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from '../trpc'

// Last.fm API constants
const API_KEY = process.env.LASTFM_API_KEY ?? ''
const USER_NAME = process.env.LASTFM_USERNAME ?? ''
const TRACK_LIMIT = 8

// Track interface for TypeScript
interface Track {
    name: string
    artist: string
    album?: string
    image?: string
    url: string
    date?: string
    nowPlaying?: boolean
}

export const lastFmRouter = createTRPCRouter({
    getTrackInfo: publicProcedure
        .input(
            z.object({
                artist: z.string().min(1),
                track: z.string().min(1),
            })
        )
        .query(async ({ input }) => {
            try {
                const params = new URLSearchParams({
                    method: 'track.getInfo',
                    artist: input.artist,
                    track: input.track,
                    api_key: API_KEY,
                    autocorrect: '1',
                    format: 'json',
                })

                if (USER_NAME) params.set('username', USER_NAME)

                const response = await fetch(`https://ws.audioscrobbler.com/2.0/?${params}`, {
                    next: { revalidate: 3600 },
                })

                if (!response.ok) {
                    throw new Error('Failed to fetch track info from Last.fm')
                }

                const data = await response.json()

                if (!data.track) {
                    return null
                }

                const t = data.track
                const images: string[] = (t.album?.image ?? [])
                    .map((i: any) => i['#text'])
                    .filter(Boolean)
                const image = images[images.length - 1] ?? null

                return {
                    name: t.name as string,
                    artist: (t.artist?.name ?? input.artist) as string,
                    album: (t.album?.title ?? null) as string | null,
                    albumUrl: (t.album?.url ?? null) as string | null,
                    duration: t.duration ? Number(t.duration) : null,
                    listeners: t.listeners ? Number(t.listeners) : null,
                    playcount: t.playcount ? Number(t.playcount) : null,
                    userPlaycount: t.userplaycount != null ? Number(t.userplaycount) : null,
                    userLoved: t.userloved === '1',
                    url: t.url as string,
                    image,
                    tags: ((t.toptags?.tag ?? []) as any[]).map((tag: any) => tag.name as string).slice(0, 6),
                    wiki: t.wiki?.summary
                        ? (t.wiki.summary as string).replace(/<a\b[^>]*>.*?<\/a>/gi, '').trim() || null
                        : null,
                }
            } catch (error) {
                console.error('Error fetching track info:', error)
                throw new Error('Failed to fetch track info')
            }
        }),

    getRecentTracks: publicProcedure
        .input(
            z
                .object({
                    limit: z.number().min(1).max(50).optional().default(TRACK_LIMIT),
                    username: z.string().optional().default(USER_NAME)
                })
                .optional()
        )
        .query(async ({ input }) => {
            try {
                const response = await fetch(
                    `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${input?.username || USER_NAME}&api_key=${API_KEY}&limit=${input?.limit || TRACK_LIMIT}&format=json`
                )

                if (!response.ok) {
                    throw new Error('Failed to fetch Last.fm data')
                }

                const data = await response.json()

                if (!data.recenttracks || !data.recenttracks.track) {
                    throw new Error('Invalid Last.fm data format')
                }

                const tracks: Track[] = data.recenttracks.track.map((track: any) => {
                    return {
                        name: track.name,
                        artist: track.artist['#text'],
                        album: track.album['#text'],
                        image: track.image[2]['#text'] || null, // Medium size image
                        url: track.url,
                        nowPlaying: track['@attr'] && track['@attr'].nowplaying === 'true',
                        date: track.date ? track.date['#text'] : null
                    }
                })

                const nowPlaying = tracks.find((track) => track.nowPlaying)
                const recentlyPlayed = tracks.filter((track) => !track.nowPlaying)

                return {
                    nowPlaying,
                    recentlyPlayed,
                    username: input?.username || USER_NAME
                }
            } catch (error) {
                console.error('Error fetching Last.fm data:', error)
                throw new Error('Failed to fetch Last.fm data')
            }
        })
})
