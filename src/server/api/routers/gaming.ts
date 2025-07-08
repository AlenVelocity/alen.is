import { createTRPCRouter, publicProcedure } from '@/server/api/trpc'
import { z } from 'zod'

// Steam API configuration
const STEAM_API_KEY = process.env.STEAM_API_KEY
const STEAM_ID_64 = process.env.STEAM_ID_64

// Xbox API configuration (OpenXBL)
const OXBL_API_KEY = process.env.OXBL_API_KEY
const XBOX_GAMERTAG = process.env.XBOX_GAMERTAG

// Steam API schemas
const steamGameSchema = z.object({
    appid: z.number(),
    name: z.string(),
    playtime_2weeks: z.number().optional(),
    playtime_forever: z.number(),
    img_icon_url: z.string().optional(),
    img_logo_url: z.string().optional(),
})

const steamOwnedGameSchema = z.object({
    appid: z.number(),
    name: z.string(),
    playtime_forever: z.number(),
    img_icon_url: z.string().optional(),
    img_logo_url: z.string().optional(),
    has_community_visible_stats: z.boolean().optional(),
})

const steamAchievementSchema = z.object({
    apiname: z.string(),
    achieved: z.number(),
    unlocktime: z.number(),
    name: z.string().optional(),
    description: z.string().optional(),
})

const steamPlayerStatsSchema = z.object({
    steamID: z.string(),
    gameName: z.string(),
    achievements: z.array(steamAchievementSchema).optional(),
    success: z.boolean(),
})

// Xbox API schemas (for unofficial API)
const xboxGameSchema = z.object({
    name: z.string(),
    titleId: z.string(),
    currentGamerscore: z.number(),
    maxGamerscore: z.number(),
    currentAchievements: z.number(),
    totalAchievements: z.number(),
    lastPlayed: z.string().optional(),
    image: z.string().optional(),
})

const xboxProfileSchema = z.object({
    gamertag: z.string(),
    gamerscore: z.number(),
    accountTier: z.string(),
    xboxOneRep: z.string(),
    preferredColor: z.string(),
    location: z.string().optional(),
    bio: z.string().optional(),
    tenure: z.string().optional(),
})

export const gamingRouter = createTRPCRouter({
    // Get recently played Steam games
    getRecentlyPlayed: publicProcedure.query(async () => {
        let steamData = null
        if (STEAM_API_KEY && STEAM_ID_64) {
            try {
                const url = `http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${STEAM_API_KEY}&steamid=${STEAM_ID_64}&format=json`
                const response = await fetch(url)
                if (!response.ok) {
                    throw new Error(`Steam API failed with status ${response.status}`)
                }
                const data = await response.json()
                const parsedData = z.object({
                    response: z.object({
                        total_count: z.number(),
                        games: z.array(steamGameSchema),
                    }),
                }).parse(data);
                
                steamData = parsedData.response.games.map(game => ({
                    ...game,
                    img_icon_url: game.img_icon_url 
                        ? `http://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`
                        : `https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/header.jpg`,
                    img_logo_url: game.img_logo_url 
                        ? `http://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_logo_url}.jpg`
                        : `https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/header.jpg`,
                    playtime_2weeks_hours: game.playtime_2weeks ? Math.round(game.playtime_2weeks / 60 * 10) / 10 : 0,
                    playtime_forever_hours: Math.round(game.playtime_forever / 60 * 10) / 10,
                })).sort((a, b) => (b.playtime_2weeks || 0) - (a.playtime_2weeks || 0));
            } catch (error) {
                console.error("Error fetching Steam recent games:", error)
            }
        }

        return { steam: steamData }
    }),

    // Get owned Steam games
    getOwnedGames: publicProcedure.query(async () => {
        let steamData = null
        if (STEAM_API_KEY && STEAM_ID_64) {
            try {
                const url = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${STEAM_API_KEY}&steamid=${STEAM_ID_64}&format=json&include_appinfo=true&include_played_free_games=true`
                const response = await fetch(url)
                if (!response.ok) {
                    throw new Error(`Steam API failed with status ${response.status}`)
                }
                const data = await response.json()
                const parsedData = z.object({
                    response: z.object({
                        game_count: z.number(),
                        games: z.array(steamOwnedGameSchema),
                    }),
                }).parse(data);
                
                steamData = {
                    total_games: parsedData.response.game_count,
                    games: parsedData.response.games.map(game => ({
                        ...game,
                        img_icon_url: game.img_icon_url 
                            ? `http://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`
                            : `https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/header.jpg`,
                        img_logo_url: game.img_logo_url 
                            ? `http://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_logo_url}.jpg`
                            : `https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/header.jpg`,
                        playtime_forever_hours: Math.round(game.playtime_forever / 60 * 10) / 10,
                    })).sort((a, b) => b.playtime_forever - a.playtime_forever)
                }
            } catch (error) {
                console.error("Error fetching Steam owned games:", error)
            }
        }

        return { steam: steamData }
    }),

    // Get Steam achievements for a specific game
    getGameAchievements: publicProcedure
        .input(z.object({ appid: z.number() }))
        .query(async ({ input }) => {
            let steamData = null
            if (STEAM_API_KEY && STEAM_ID_64) {
                try {
                    const url = `http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=${input.appid}&key=${STEAM_API_KEY}&steamid=${STEAM_ID_64}`
                    const response = await fetch(url)
                    if (!response.ok) {
                        throw new Error(`Steam API failed with status ${response.status}`)
                    }
                    const data = await response.json()
                    const parsedData = z.object({
                        playerstats: steamPlayerStatsSchema
                    }).parse(data);
                    
                    if (parsedData.playerstats.success && parsedData.playerstats.achievements) {
                        steamData = {
                            gameName: parsedData.playerstats.gameName,
                            achievements: parsedData.playerstats.achievements.map(achievement => ({
                                ...achievement,
                                unlockDate: achievement.unlocktime > 0 ? new Date(achievement.unlocktime * 1000).toISOString() : null
                            })),
                            totalAchievements: parsedData.playerstats.achievements.length,
                            unlockedAchievements: parsedData.playerstats.achievements.filter(a => a.achieved === 1).length
                        }
                    }
                } catch (error) {
                    console.error("Error fetching Steam achievements:", error)
                }
            }

            return { steam: steamData }
        }),

    // Get Xbox data (using OpenXBL API)
    getXboxData: publicProcedure.query(async () => {
        let xboxData = null
        if (OXBL_API_KEY && XBOX_GAMERTAG) {
            try {
                // Using OpenXBL API - you'll need to sign up at https://xbl.io/
                const headers = {
                    'X-Authorization': OXBL_API_KEY,
                    'Content-Type': 'application/json'
                }

                // Get profile
                const profileResponse = await fetch(`https://xbl.io/api/v2/profile/${XBOX_GAMERTAG}`, { headers })
                if (!profileResponse.ok) {
                    throw new Error(`Xbox profile API failed with status ${profileResponse.status}`)
                }
                const profileData = await profileResponse.json()
                
                // Get recent games
                const gamesResponse = await fetch(`https://xbl.io/api/v2/recent-activity/${XBOX_GAMERTAG}`, { headers })
                if (!gamesResponse.ok) {
                    throw new Error(`Xbox games API failed with status ${gamesResponse.status}`)
                }
                const gamesData = await gamesResponse.json()

                xboxData = {
                    profile: {
                        gamertag: profileData.gamertag,
                        gamerscore: profileData.gamerScore,
                        accountTier: profileData.accountTier,
                        xboxOneRep: profileData.xboxOneRep,
                        preferredColor: profileData.preferredColor,
                        location: profileData.location,
                        bio: profileData.bio,
                        tenure: profileData.tenure
                    },
                    recentGames: gamesData.titles?.map((game: any) => ({
                        name: game.name,
                        titleId: game.titleId,
                        currentGamerscore: game.currentGamerscore,
                        maxGamerscore: game.maxGamerscore,
                        currentAchievements: game.currentAchievements,
                        totalAchievements: game.totalAchievements,
                        lastPlayed: game.lastPlayed,
                        image: game.displayImage
                    })) || []
                }
            } catch (error) {
                console.error("Error fetching Xbox data:", error)
            }
        }

        return { xbox: xboxData }
    }),

    // Get comprehensive gaming overview
    getGamingOverview: publicProcedure.query(async () => {
        const [recentGames, ownedGames, xboxData] = await Promise.all([
            // Get recent Steam games
            STEAM_API_KEY && STEAM_ID_64 ? (async () => {
                try {
                    const url = `http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${STEAM_API_KEY}&steamid=${STEAM_ID_64}&format=json`
                    const response = await fetch(url)
                    if (!response.ok) return null
                    const data = await response.json()
                    return data.response?.games || []
                } catch { return null }
            })() : null,

            // Get owned Steam games count
            STEAM_API_KEY && STEAM_ID_64 ? (async () => {
                try {
                    const url = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${STEAM_API_KEY}&steamid=${STEAM_ID_64}&format=json`
                    const response = await fetch(url)
                    if (!response.ok) return null
                    const data = await response.json()
                    return data.response?.game_count || 0
                } catch { return null }
            })() : null,

            // Get Xbox data
            OXBL_API_KEY && XBOX_GAMERTAG ? (async () => {
                try {
                    const headers = { 'X-Authorization': OXBL_API_KEY }
                    const response = await fetch(`https://xbl.io/api/v2/profile/${XBOX_GAMERTAG}`, { headers })
                    if (!response.ok) return null
                    return await response.json()
                } catch { return null }
            })() : null
        ])

        return {
            steam: {
                recentGames: recentGames?.slice(0, 6).map((game: any) => ({
                    ...game,
                    img_logo_url: game.img_logo_url 
                        ? `http://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_logo_url}.jpg`
                        : `https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/header.jpg`,
                    playtime_2weeks_hours: game.playtime_2weeks ? Math.round(game.playtime_2weeks / 60 * 10) / 10 : 0,
                    playtime_forever_hours: Math.round(game.playtime_forever / 60 * 10) / 10,
                })) || null,
                totalGames: ownedGames
            },
            xbox: xboxData ? {
                profile: {
                    gamertag: xboxData.gamertag,
                    gamerscore: xboxData.gamerScore,
                    accountTier: xboxData.accountTier
                }
            } : null
        }
    }),
}) 