import { Metadata } from 'next'
import { PageTransition } from '@/components/ui/page-transition'
import { api } from '@/trpc/server'
import { FiArrowUpRight, FiClock } from 'react-icons/fi'
import { GiGamepad } from 'react-icons/gi'
import { FaSteam, FaXbox } from 'react-icons/fa'
import Image from 'next/image'
import Link from 'next/link'
import { slugify, fetchXboxGames } from '@/lib/steam'

export const metadata: Metadata = {
    title: 'Playing',
    description: 'What I play',
    openGraph: {
        title: 'Alen is Playing',
        description: 'What I play',
    },
    alternates: { canonical: '/playing' },
}

function PlatformIcon({ platform }: { platform: 'steam' | 'xbox' }) {
    return platform === 'steam' ? (
        <FaSteam className="w-3 h-3 text-muted-foreground/40 shrink-0" />
    ) : (
        <FaXbox className="w-3 h-3 text-muted-foreground/40 shrink-0" />
    )
}

export default async function Playing() {
    const [recentData, ownedData, xboxGames] = await Promise.all([
        api.gaming.getRecentlyPlayed(),
        api.gaming.getOwnedGames(),
        fetchXboxGames(),
    ])

    const recentGames = recentData.steam
    const ownedGames = ownedData.steam
    const hasData = recentGames || ownedGames || xboxGames.length > 0

    // Calculate total playtime across all Steam games
    const totalHours = ownedGames
        ? Math.round(ownedGames.games.reduce((sum, g) => sum + g.playtime_forever_hours, 0))
        : 0

    // Get recently played appids to exclude from Steam library list
    const recentAppIds = new Set(recentGames?.map((g) => g.appid) || [])

    // Build Xbox game entries (exclude games that are also on Steam)
    const steamSlugs = new Set(ownedGames?.games.map((g) => slugify(g.name)) || [])
    const xboxOnly = xboxGames.filter((g) => !steamSlugs.has(slugify(g.name)))

    return (
        <PageTransition>
            <div className="container max-w-2xl py-12 md:py-20">
                {/* Header */}
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">Playing</h1>

                {/* Stats line */}
                {(ownedGames || xboxGames.length > 0) && (
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8">
                        {ownedGames && (
                            <span className="flex items-center gap-1.5">
                                <FaSteam className="w-3.5 h-3.5" />
                                {ownedGames.total_games} games
                            </span>
                        )}
                        {xboxGames.length > 0 && (
                            <span className="flex items-center gap-1.5">
                                <FaXbox className="w-3.5 h-3.5" />
                                {xboxGames.length} games
                            </span>
                        )}
                        {totalHours > 0 && (
                            <>
                                <span className="text-muted-foreground/30">·</span>
                                <span className="flex items-center gap-1.5">
                                    <FiClock className="w-3.5 h-3.5" />
                                    {totalHours.toLocaleString()} hrs on Steam
                                </span>
                            </>
                        )}
                    </div>
                )}

                {/* About */}
                <section className="mb-12 space-y-4 text-muted-foreground leading-relaxed">
                    <p>
                        Big fan of story-driven games and JRPGs. Persona changed my brain chemistry. Currently working
                        through the Final Fantasy backlog.
                    </p>
                </section>

                {/* Recently Played (Steam) */}
                {recentGames && recentGames.length > 0 && (
                    <section className="mb-12">
                        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider border-l-2 border-accent pl-3 mb-4">
                            Recently Played
                        </h2>
                        <div>
                            {recentGames.map((game) => (
                                <Link
                                    key={game.appid}
                                    href={`/playing/${slugify(game.name)}`}
                                    className="group flex items-center gap-4 py-3 border-b border-dashed border-border hover:border-accent/50 transition-colors"
                                >
                                    <div className="relative w-28 h-[52px] rounded-md overflow-hidden flex-shrink-0">
                                        <Image
                                            src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/header.jpg`}
                                            alt={game.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5">
                                            <p className="font-semibold truncate group-hover:text-accent transition-colors">
                                                {game.name}
                                            </p>
                                            <PlatformIcon platform="steam" />
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            {game.playtime_2weeks_hours > 0 && (
                                                <span className="text-accent">{game.playtime_2weeks_hours} hrs this week</span>
                                            )}
                                            {game.playtime_2weeks_hours > 0 && game.playtime_forever_hours > 0 && (
                                                <span className="text-muted-foreground/50"> · </span>
                                            )}
                                            {game.playtime_forever_hours > 0 && (
                                                <span>{game.playtime_forever_hours} hrs total</span>
                                            )}
                                        </p>
                                    </div>
                                    <FiArrowUpRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-accent transition-colors shrink-0" />
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* Steam Library */}
                {ownedGames && ownedGames.games.length > 0 && (
                    <section className="mb-12">
                        <h2 className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider border-l-2 border-accent pl-3 mb-4">
                            <FaSteam />
                            Steam Library
                        </h2>
                        <div>
                            {ownedGames.games
                                .filter((game) => game.playtime_forever > 0 && !recentAppIds.has(game.appid))
                                .map((game) => (
                                    <Link
                                        key={game.appid}
                                        href={`/playing/${slugify(game.name)}`}
                                        className="group flex items-center gap-3 py-2 border-b border-dashed border-border/50 last:border-b-0 hover:border-accent/30 transition-colors"
                                    >
                                        <div className="relative w-16 h-7 rounded overflow-hidden flex-shrink-0">
                                            <Image
                                                src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/header.jpg`}
                                                alt={game.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <p className="flex-1 min-w-0 text-sm font-medium truncate group-hover:text-accent transition-colors">
                                            {game.name}
                                        </p>
                                        <span className="text-xs text-muted-foreground/50 shrink-0 hidden sm:inline">
                                            {game.playtime_forever_hours} hrs
                                        </span>
                                    </Link>
                                ))}
                        </div>

                        {/* Unplayed count */}
                        {(() => {
                            const unplayed = ownedGames.games.filter((g) => g.playtime_forever === 0).length
                            if (unplayed === 0) return null
                            return (
                                <p className="text-xs text-muted-foreground/40 mt-3 italic">
                                    + {unplayed} unplayed games (the backlog is real)
                                </p>
                            )
                        })()}
                    </section>
                )}

                {/* Xbox Library */}
                {xboxOnly.length > 0 && (
                    <section className="mb-12">
                        <h2 className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider border-l-2 border-accent pl-3 mb-4">
                            <FaXbox />
                            Xbox Library
                        </h2>
                        <div>
                            {xboxOnly.map((game) => (
                                <Link
                                    key={game.titleId}
                                    href={`/playing/${slugify(game.name)}`}
                                    className="group flex items-center gap-3 py-2 border-b border-dashed border-border/50 last:border-b-0 hover:border-accent/30 transition-colors"
                                >
                                    {game.image ? (
                                        <div className="relative w-7 h-7 rounded overflow-hidden flex-shrink-0">
                                            <Image src={game.image} alt={game.name} fill className="object-cover" />
                                        </div>
                                    ) : (
                                        <div className="w-7 h-7 rounded bg-muted flex items-center justify-center flex-shrink-0">
                                            <FaXbox className="w-3 h-3 text-muted-foreground" />
                                        </div>
                                    )}
                                    <p className="flex-1 min-w-0 text-sm font-medium truncate group-hover:text-accent transition-colors">
                                        {game.name}
                                    </p>
                                    {game.totalAchievements > 0 && (
                                        <span className="text-xs text-muted-foreground/50 shrink-0 hidden sm:inline">
                                            {game.currentAchievements}/{game.totalAchievements} achievements
                                        </span>
                                    )}
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* Empty State */}
                {!hasData && (
                    <div className="text-center py-12">
                        <GiGamepad className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No gaming data available right now.</p>
                    </div>
                )}
            </div>
        </PageTransition>
    )
}
