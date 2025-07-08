import { api } from '@/trpc/server'
import { PageTransition } from '@/components/ui/page-transition'
import { Metadata } from 'next'
import { LinkButton } from '@/components/ui/link-button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { FaSteam, FaXbox, FaClock, FaExternalLinkAlt, FaTrophy, FaGamepad, FaUser, FaStar } from 'react-icons/fa'
import { SiSteam } from 'react-icons/si'

export const metadata: Metadata = {
    title: 'Gaming | Alen Yohannan',
    description: 'My gaming activity, achievements, and stats across Steam and Xbox.',
}

const formatPlaytimeHours = (hours: number) => {
    if (hours < 1) {
        return `${Math.round(hours * 60)}m`
    }
    const fullHours = Math.floor(hours)
    const minutes = Math.round((hours - fullHours) * 60)
    if (minutes === 0) {
        return `${fullHours}h`
    }
    if (fullHours === 0) {
        return `${minutes}m`
    }
    return `${fullHours}h ${minutes}m`
}

const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num)
}

type SteamGame = {
    appid: number;
    name: string;
    playtime_2weeks_hours: number;
    playtime_forever_hours: number;
    img_logo_url: string;
}

type XboxGame = {
    name: string;
    titleId: string;
    currentGamerscore: number;
    maxGamerscore: number;
    currentAchievements: number;
    totalAchievements: number;
    lastPlayed?: string;
    image?: string;
}

export default async function PlayingPage() {
    const [gamingOverview, ownedGames, xboxData] = await Promise.all([
        api.gaming.getGamingOverview(),
        api.gaming.getOwnedGames(),
        api.gaming.getXboxData()
    ])

    const steamGames = gamingOverview.steam?.recentGames as SteamGame[] | null
    const steamOwnedGames = ownedGames.steam
    const xbox = xboxData.xbox

    return (
        <PageTransition>
            <div className="container mx-auto max-w-4xl px-4 py-8">
                {/* Header Section */}
                <div className="mb-12">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight mb-2">
                                Gaming Dashboard
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400">
                                My gaming activity, achievements, and stats across Steam and Xbox platforms.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Overview Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg shadow-slate-200/10 dark:shadow-slate-950/10 border border-slate-200/50 dark:border-slate-800/50 transition-all duration-300 hover:scale-102 hover:shadow-xl">
                        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <h3 className="text-sm font-medium text-slate-900 dark:text-white">Steam Games</h3>
                            <SiSteam className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                        </div>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">{formatNumber(gamingOverview.steam?.totalGames || 0)}</div>
                        <p className="text-xs text-slate-600 dark:text-slate-400">Total owned games</p>
                    </div>
                    
                    <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg shadow-slate-200/10 dark:shadow-slate-950/10 border border-slate-200/50 dark:border-slate-800/50 transition-all duration-300 hover:scale-102 hover:shadow-xl">
                        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <h3 className="text-sm font-medium text-slate-900 dark:text-white">Xbox Gamerscore</h3>
                            <FaXbox className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                        </div>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">{formatNumber(xbox?.profile?.gamerscore || 0)}</div>
                        <p className="text-xs text-slate-600 dark:text-slate-400">Total gamerscore</p>
                    </div>
                    
                    <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg shadow-slate-200/10 dark:shadow-slate-950/10 border border-slate-200/50 dark:border-slate-800/50 transition-all duration-300 hover:scale-102 hover:shadow-xl">
                        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <h3 className="text-sm font-medium text-slate-900 dark:text-white">Recent Activity</h3>
                            <FaGamepad className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                        </div>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">{(steamGames?.length || 0) + (xbox?.recentGames?.length || 0)}</div>
                        <p className="text-xs text-slate-600 dark:text-slate-400">Games played recently</p>
                    </div>
                </div>

                <Tabs defaultValue="steam" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="steam" className="flex items-center gap-2">
                            <SiSteam className="w-4 h-4" />
                            Steam
                        </TabsTrigger>
                        <TabsTrigger value="xbox" className="flex items-center gap-2">
                            <FaXbox className="w-4 h-4" />
                            Xbox
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="steam" className="space-y-6">
                        {/* Recent Steam Games */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-600 text-white">
                                    <FaClock className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Recently Played</h2>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">Games I've been playing lately</p>
                                </div>
                            </div>
                            
                            {steamGames && steamGames.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {steamGames.map((game: SteamGame) => (
                                        <div key={game.appid} className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-2xl shadow-lg shadow-slate-200/10 dark:shadow-slate-950/10 border border-slate-200/50 dark:border-slate-800/50 transition-all duration-300 hover:scale-102 hover:shadow-xl overflow-hidden">
                                            <div className="p-0">
                                                <div className="aspect-video relative overflow-hidden">
                                                    <img 
                                                        src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/header.jpg`}
                                                        alt={game.name} 
                                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                                                    />
                                                    <div className="absolute top-2 right-2">
                                                        <div className="bg-black/50 text-white border-none px-2 py-1 rounded-md text-xs flex items-center gap-1">
                                                            <FaClock className="w-3 h-3" />
                                                            {formatPlaytimeHours(game.playtime_2weeks_hours)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                <h3 className="font-bold text-lg mb-2 line-clamp-2 text-slate-900 dark:text-white">{game.name}</h3>
                                                <div className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                                                    <div className="flex items-center justify-between">
                                                        <span>Last 2 weeks:</span>
                                                        <span className="font-medium">{formatPlaytimeHours(game.playtime_2weeks_hours)}</span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span>Total playtime:</span>
                                                        <span className="font-medium">{formatPlaytimeHours(game.playtime_forever_hours)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-4 pt-0">
                                                <LinkButton 
                                                    href={`https://store.steampowered.com/app/${game.appid}`}
                                                    target="_blank"
                                                    className="w-full flex items-center justify-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200/50 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700"
                                                >
                                                    <FaExternalLinkAlt className="w-3 h-3" />
                                                    View on Steam Store
                                                </LinkButton>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg shadow-slate-200/10 dark:shadow-slate-950/10 border border-slate-200/50 dark:border-slate-800/50 text-center">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                            <SiSteam className="w-8 h-8 text-slate-500 dark:text-slate-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold mb-2 text-slate-900 dark:text-white">No recent Steam activity</h3>
                                            <p className="text-slate-600 dark:text-slate-400">
                                                Either I haven't played anything recently, or the Steam API is down.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </section>

                        {/* Top Played Games */}
                        {steamOwnedGames && steamOwnedGames.games && (
                            <section className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-600 text-white">
                                        <FaTrophy className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Most Played</h2>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">My most played Steam games of all time</p>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {steamOwnedGames.games.slice(0, 6).map((game: any) => (
                                        <div key={game.appid} className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-2xl p-4 shadow-lg shadow-slate-200/10 dark:shadow-slate-950/10 border border-slate-200/50 dark:border-slate-800/50 transition-all duration-300 hover:scale-102 hover:shadow-xl flex items-center">
                                            <img 
                                                src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/capsule_184x69.jpg`}
                                                alt={game.name} 
                                                className="w-16 h-16 rounded-lg mr-4 object-cover"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = `https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/header.jpg`;
                                                }}
                                            />
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-sm mb-1 line-clamp-2 text-slate-900 dark:text-white">{game.name}</h3>
                                                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                                    <FaClock className="w-3 h-3" />
                                                    {formatPlaytimeHours(game.playtime_forever_hours)} played
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </TabsContent>

                    <TabsContent value="xbox" className="space-y-6">
                        {xbox ? (
                            <>
                                {/* Xbox Profile */}
                                <section className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-600 text-white">
                                            <FaUser className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Xbox Profile</h2>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">My Xbox Live profile and stats</p>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg shadow-slate-200/10 dark:shadow-slate-950/10 border border-slate-200/50 dark:border-slate-800/50 transition-all duration-300 hover:scale-102 hover:shadow-xl">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-16 h-16 rounded-full bg-green-600 flex items-center justify-center text-white text-2xl font-bold">
                                                {xbox.profile.gamertag.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{xbox.profile.gamertag}</h3>
                                                <p className="text-sm text-slate-600 dark:text-slate-400">{xbox.profile.accountTier}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-green-600">{formatNumber(xbox.profile.gamerscore)}</div>
                                                <p className="text-xs text-slate-600 dark:text-slate-400">Gamerscore</p>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-slate-900 dark:text-white">{xbox.profile.xboxOneRep}</div>
                                                <p className="text-xs text-slate-600 dark:text-slate-400">Reputation</p>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-slate-900 dark:text-white">{xbox.profile.tenure || 'N/A'}</div>
                                                <p className="text-xs text-slate-600 dark:text-slate-400">Tenure</p>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-slate-900 dark:text-white">{xbox.profile.location || 'N/A'}</div>
                                                <p className="text-xs text-slate-600 dark:text-slate-400">Location</p>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Xbox Recent Games */}
                                {xbox.recentGames && xbox.recentGames.length > 0 && (
                                    <section className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-orange-600 text-white">
                                                <FaGamepad className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Recent Xbox Games</h2>
                                                <p className="text-sm text-slate-600 dark:text-slate-400">Games I've been playing on Xbox</p>
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                            {xbox.recentGames.map((game: XboxGame) => (
                                                <div key={game.titleId} className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-2xl shadow-lg shadow-slate-200/10 dark:shadow-slate-950/10 border border-slate-200/50 dark:border-slate-800/50 transition-all duration-300 hover:scale-102 hover:shadow-xl overflow-hidden">
                                                    <div className="p-0">
                                                        <div className="aspect-video relative overflow-hidden bg-slate-100 dark:bg-slate-800">
                                                            {game.image ? (
                                                                <img 
                                                                    src={game.image} 
                                                                    alt={game.name} 
                                                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center">
                                                                    <FaXbox className="w-12 h-12 text-slate-500 dark:text-slate-400" />
                                                                </div>
                                                            )}
                                                            <div className="absolute top-2 right-2">
                                                                <div className="bg-black/50 text-white border-none px-2 py-1 rounded-md text-xs flex items-center gap-1">
                                                                    <FaTrophy className="w-3 h-3" />
                                                                    {game.currentGamerscore}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="p-4">
                                                        <h3 className="font-bold text-lg mb-2 line-clamp-2 text-slate-900 dark:text-white">{game.name}</h3>
                                                        <div className="space-y-2">
                                                            <div className="flex items-center justify-between text-sm">
                                                                <span className="text-slate-600 dark:text-slate-400">Achievements:</span>
                                                                <span className="font-medium text-slate-900 dark:text-white">{game.currentAchievements}/{game.totalAchievements}</span>
                                                            </div>
                                                            <Progress 
                                                                value={game.totalAchievements > 0 ? (game.currentAchievements / game.totalAchievements) * 100 : 0} 
                                                                className="h-2" 
                                                            />
                                                            <div className="flex items-center justify-between text-sm">
                                                                <span className="text-slate-600 dark:text-slate-400">Gamerscore:</span>
                                                                <span className="font-medium text-slate-900 dark:text-white">{game.currentGamerscore}/{game.maxGamerscore}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}
                            </>
                        ) : (
                            <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg shadow-slate-200/10 dark:shadow-slate-950/10 border border-slate-200/50 dark:border-slate-800/50 text-center">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                        <FaXbox className="w-8 h-8 text-slate-500 dark:text-slate-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-2 text-slate-900 dark:text-white">Xbox integration not configured</h3>
                                        <p className="text-slate-600 dark:text-slate-400">
                                            Set up your OpenXBL API credentials to see your gaming activity.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </PageTransition>
    )
} 