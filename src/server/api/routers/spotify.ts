import { publicProcedure, createTRPCRouter } from '../trpc'
import axios from 'axios'

export const spotifyRouter = createTRPCRouter({
    getListeningHistory: publicProcedure.query(async () => {
        try {
            const response = await axios.get('https://api.spotify.com/v1/me/player/recently-played', {
                headers: {
                    Authorization: `Bearer `
                }
            })

            return response.data.items.map((item: any) => ({
                id: item.track.id,
                name: item.track.name,
                artist: item.track.artists[0].name,
                album: item.track.album.name,
                albumArt: item.track.album.images[0].url,
                playedAt: item.played_at
            }))
        } catch (error) {
            console.error('Error fetching Spotify history:', error)
            throw new Error('Failed to fetch Spotify listening history')
        }
    })
})
