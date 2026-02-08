import { z } from 'zod'

// ─── Slugify ─────────────────────────────────────────────────────────────────

export function slugify(name: string): string {
    return name
        .toLowerCase()
        .replace(/[™®©]/g, '') // strip trademark symbols
        .replace(/['']/g, '') // strip smart quotes
        .replace(/[^a-z0-9]+/g, '-') // replace non-alphanumeric with hyphens
        .replace(/-+/g, '-') // collapse multiple hyphens
        .replace(/^-|-$/g, '') // trim leading/trailing hyphens
}

// ─── Unified game type ──────────────────────────────────────────────────────

export type GamePlatform = 'steam' | 'xbox'

export interface GameEntry {
    id: string // appid (steam) or titleId (xbox)
    name: string
    slug: string
    platform: GamePlatform
    playtime_forever_hours: number // 0 for xbox (not available)
    image: string
    achievements?: {
        current: number
        total: number
    }
    lastPlayed?: string
}

// ─── Steam API ──────────────────────────────────────────────────────────────

const STEAM_API_KEY = process.env.STEAM_API_KEY
const STEAM_ID_64 = process.env.STEAM_ID_64

export interface SteamOwnedGame {
    appid: number
    name: string
    playtime_forever: number
    playtime_forever_hours: number
    img_icon_url?: string
}

export async function fetchOwnedGames(): Promise<SteamOwnedGame[]> {
    if (!STEAM_API_KEY || !STEAM_ID_64) return []

    try {
        const url = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${STEAM_API_KEY}&steamid=${STEAM_ID_64}&format=json&include_appinfo=true&include_played_free_games=true`
        const response = await fetch(url, { next: { revalidate: 3600 } })
        if (!response.ok) return []

        const data = await response.json()
        const games = data.response?.games || []

        return games
            .map((game: { appid: number; name: string; playtime_forever: number; img_icon_url?: string }) => ({
                appid: game.appid,
                name: game.name,
                playtime_forever: game.playtime_forever,
                playtime_forever_hours: Math.round((game.playtime_forever / 60) * 10) / 10,
                img_icon_url: game.img_icon_url,
            }))
            .sort((a: SteamOwnedGame, b: SteamOwnedGame) => b.playtime_forever - a.playtime_forever)
    } catch {
        return []
    }
}

// ─── Xbox API ───────────────────────────────────────────────────────────────

const OXBL_API_KEY = process.env.OXBL_API_KEY
const XBOX_XUID = process.env.XBOX_XUID

export interface XboxGame {
    titleId: string
    name: string
    currentGamerscore: number
    maxGamerscore: number
    currentAchievements: number
    totalAchievements: number
    lastPlayed?: string
    image?: string
}

export async function fetchXboxGames(): Promise<XboxGame[]> {
    if (!OXBL_API_KEY || !XBOX_XUID) return []

    try {
        const headers = {
            'X-Authorization': OXBL_API_KEY,
            'Content-Type': 'application/json',
            'Accept-Language': 'en-US',
        }

        const response = await fetch(`https://xbl.io/api/v2/achievements/player/${XBOX_XUID}`, {
            headers,
            next: { revalidate: 3600 },
        })
        if (!response.ok) return []

        const data = await response.json()
        const titles = data.titles || []

        return titles.map((game: any) => ({
            titleId: String(game.titleId),
            name: game.name || 'Unknown',
            currentGamerscore: game.currentGamerscore || 0,
            maxGamerscore: game.maxGamerscore || 0,
            currentAchievements: game.achievement?.currentAchievements || 0,
            totalAchievements: game.achievement?.totalAchievements || 0,
            lastPlayed: game.titleHistory?.lastTimePlayed || undefined,
            image: game.displayImage || undefined,
        }))
    } catch {
        return []
    }
}

export interface XboxAchievement {
    id: string
    name: string
    description: string
    isUnlocked: boolean
    unlockedDate?: string
    gamerscore: number
    icon?: string
}

export async function fetchXboxGameAchievements(titleId: string): Promise<XboxAchievement[]> {
    if (!OXBL_API_KEY || !XBOX_XUID) return []

    try {
        const headers = {
            'X-Authorization': OXBL_API_KEY,
            'Content-Type': 'application/json',
            'Accept-Language': 'en-US',
        }

        const response = await fetch(
            `https://xbl.io/api/v2/achievements/title/${titleId}`,
            { headers, next: { revalidate: 3600 } }
        )
        if (!response.ok) return []

        const data = await response.json()
        const achievements = data.achievements || []

        return achievements.map((a: any) => ({
            id: String(a.id),
            name: a.name || 'Unknown',
            description: a.description || a.lockedDescription || '',
            isUnlocked: a.progressState === 'Achieved',
            unlockedDate: a.progression?.timeUnlocked || undefined,
            gamerscore: a.rewards?.find((r: any) => r.type === 'Gamerscore')?.value
                ? Number(a.rewards.find((r: any) => r.type === 'Gamerscore')?.value)
                : 0,
            icon: a.mediaAssets?.[0]?.url || undefined,
        }))
    } catch {
        return []
    }
}

// ─── Unified game fetching ──────────────────────────────────────────────────

export async function fetchAllGames(): Promise<GameEntry[]> {
    const [steamGames, xboxGames] = await Promise.all([fetchOwnedGames(), fetchXboxGames()])

    const steam: GameEntry[] = steamGames.map((g) => ({
        id: String(g.appid),
        name: g.name,
        slug: slugify(g.name),
        platform: 'steam' as const,
        playtime_forever_hours: g.playtime_forever_hours,
        image: `https://cdn.cloudflare.steamstatic.com/steam/apps/${g.appid}/header.jpg`,
    }))

    const xbox: GameEntry[] = xboxGames.map((g) => ({
        id: g.titleId,
        name: g.name,
        slug: slugify(g.name),
        platform: 'xbox' as const,
        playtime_forever_hours: 0,
        image: g.image || '',
        achievements: { current: g.currentAchievements, total: g.totalAchievements },
        lastPlayed: g.lastPlayed,
    }))

    // Deduplicate — if a game exists on both platforms, prefer Steam (has playtime data)
    const seen = new Set<string>()
    const all: GameEntry[] = []
    for (const game of [...steam, ...xbox]) {
        if (!seen.has(game.slug)) {
            seen.add(game.slug)
            all.push(game)
        }
    }

    return all
}

// ─── Steam Store API (public, no key needed) ────────────────────────────────

const steamStoreDetailsSchema = z.object({
    success: z.boolean(),
    data: z
        .object({
            name: z.string(),
            steam_appid: z.number(),
            short_description: z.string().optional(),
            header_image: z.string().optional(),
            release_date: z
                .object({
                    coming_soon: z.boolean(),
                    date: z.string(),
                })
                .optional(),
            genres: z
                .array(
                    z.object({
                        id: z.string(),
                        description: z.string(),
                    })
                )
                .optional(),
            screenshots: z
                .array(
                    z.object({
                        id: z.number(),
                        path_thumbnail: z.string(),
                        path_full: z.string(),
                    })
                )
                .optional(),
            developers: z.array(z.string()).optional(),
            publishers: z.array(z.string()).optional(),
        })
        .optional(),
})

export interface SteamGameDetails {
    name: string
    appid: number
    shortDescription: string | null
    headerImage: string | null
    releaseDate: string | null
    genres: string[]
    screenshots: { thumbnail: string; full: string }[]
    developers: string[]
    publishers: string[]
}

export async function fetchGameDetails(appid: number): Promise<SteamGameDetails | null> {
    try {
        const url = `https://store.steampowered.com/api/appdetails?appids=${appid}`
        const response = await fetch(url, { next: { revalidate: 86400 } }) // cache 24hrs
        if (!response.ok) return null

        const data = await response.json()
        const parsed = steamStoreDetailsSchema.parse(data[String(appid)])

        if (!parsed.success || !parsed.data) return null

        return {
            name: parsed.data.name,
            appid: parsed.data.steam_appid,
            shortDescription: parsed.data.short_description || null,
            headerImage: parsed.data.header_image || null,
            releaseDate: parsed.data.release_date?.date || null,
            genres: parsed.data.genres?.map((g) => g.description) || [],
            screenshots: (parsed.data.screenshots || []).slice(0, 4).map((s) => ({
                thumbnail: s.path_thumbnail,
                full: s.path_full,
            })),
            developers: parsed.data.developers || [],
            publishers: parsed.data.publishers || [],
        }
    } catch {
        return null
    }
}

// ─── Slug resolution ────────────────────────────────────────────────────────

export async function resolveSlug(slug: string): Promise<GameEntry | null> {
    const games = await fetchAllGames()
    return games.find((g) => g.slug === slug) || null
}

// Keep backwards compat
export async function resolveSlugToAppId(
    slug: string
): Promise<{ appid: number; name: string; playtime_forever_hours: number } | null> {
    const game = await resolveSlug(slug)
    if (!game) return null
    return { appid: Number(game.id), name: game.name, playtime_forever_hours: game.playtime_forever_hours }
}
