import { Metadata } from 'next'
import { PageTransition } from '@/components/ui/page-transition'
import { api } from '@/trpc/server'
import { FiArrowUpRight } from 'react-icons/fi'
import { GiGamepad } from 'react-icons/gi'
import { FaSteam } from 'react-icons/fa'
import Image from 'next/image'

export const metadata: Metadata = {
    title: 'Playing',
    description: 'What I play',
    openGraph: {
        title: 'Alen is Playing',
        description: 'What I play',
    },
    alternates: { canonical: '/playing' },
}

export default async function Playing() {
    const [recentData, ownedData] = await Promise.all([
        api.gaming.getRecentlyPlayed(),
        api.gaming.getOwnedGames(),
    ])

    const recentGames = recentData.steam
    const ownedGames = ownedData.steam
    const hasData = recentGames || ownedGames

    return (
        <PageTransition>
            <div className="container max-w-2xl py-12 md:py-20">
                {/* Header */}
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">Playing</h1>

                {/* About */}
                <section className="mb-12 space-y-4 text-muted-foreground leading-relaxed">
                    <p>
                        Big fan of story-driven games and JRPGs. Persona changed my brain chemistry. Currently working
                        through the Final Fantasy backlog.
                    </p>
                </section>

                {/* Recently Played */}
                {recentGames && recentGames.length > 0 && (
                    <section className="mb-12">
                        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider border-l-2 border-accent pl-3 mb-4">
                            Recently Played
                        </h2>
                        <div>
                            {recentGames.map((game) => (
                                <a
                                    key={game.appid}
                                    href={`https://store.steampowered.com/app/${game.appid}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-center gap-4 py-3 border-b border-dashed border-border hover:border-accent/50 transition-colors"
                                >
                                    <div className="relative w-24 h-11 rounded overflow-hidden flex-shrink-0">
                                        <Image
                                            src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/header.jpg`}
                                            alt={game.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold truncate group-hover:text-accent transition-colors">
                                            {game.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {game.playtime_2weeks_hours > 0 && (
                                                <span>{game.playtime_2weeks_hours} hrs this week</span>
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
                                </a>
                            ))}
                        </div>
                    </section>
                )}

                {/* Library */}
                {ownedGames && ownedGames.games.length > 0 && (
                    <section className="mb-12">
                        <h2 className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider border-l-2 border-accent pl-3 mb-4">
                            <FaSteam />
                            Library
                            <span className="text-muted-foreground/50 normal-case">
                                — {ownedGames.total_games} games
                            </span>
                        </h2>
                        <div>
                            {ownedGames.games
                                .filter((game) => game.playtime_forever > 0)
                                .map((game) => (
                                    <a
                                        key={game.appid}
                                        href={`https://store.steampowered.com/app/${game.appid}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
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
                                    </a>
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
