import { Metadata } from 'next'
import { PageTransition } from '@/components/ui/page-transition'
import { api } from '@/trpc/server'
import { FiArrowUpRight, FiClock } from 'react-icons/fi'
import { GiGamepad } from 'react-icons/gi'
import { FaSteam, FaXbox } from 'react-icons/fa'
import Image from 'next/image'
import Link from 'next/link'
import { slugify, fetchXboxGames } from '@/lib/steam'
import { CollapsibleSection } from '@/components/ui/collapsible-section'

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
    const showReviews = process.env.SHOW_REVIEWS === 'true'
    const [recentData, ownedData, xboxGames, reviewsData] = await Promise.all([
        api.gaming.getRecentlyPlayed(),
        api.gaming.getOwnedGames(),
        fetchXboxGames(),
        showReviews ? api.reviews.getReviewsByType({ type: 'GAME' }) : Promise.resolve([]),
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
                    <div className="flex flex-wrap items-center gap-3 mb-10">
                        {ownedGames && (
                            <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/40 border border-border/40 text-sm font-medium hover:bg-muted transition-colors shadow-sm">
                                <FaSteam className="w-4 h-4 text-muted-foreground" />
                                {ownedGames.total_games} games
                            </span>
                        )}
                        {xboxGames.length > 0 && (
                            <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/40 border border-border/40 text-sm font-medium hover:bg-muted transition-colors shadow-sm">
                                <FaXbox className="w-4 h-4 text-muted-foreground" />
                                {xboxGames.length} games
                            </span>
                        )}
                        {totalHours > 0 && (
                            <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/40 border border-border/40 text-sm font-medium hover:bg-muted transition-colors shadow-sm">
                                <FiClock className="w-4 h-4 text-muted-foreground" />
                                {totalHours.toLocaleString()} hrs on Steam
                            </span>
                        )}
                    </div>
                )}

                {/* About */}
                <section className="mb-12 space-y-4 text-muted-foreground leading-relaxed">
                    <p>
                        Big fan of story-driven games and JRPGs. Persona changed my brain chemistry.
                    </p>
                </section>

                {/* My Reviews */}
                {showReviews && (() => {
                    const gameReviews = reviewsData
                    if (!gameReviews || gameReviews.length === 0) return null
                    return (
                        <CollapsibleSection title="My Reviews">
                            <div>
                                {gameReviews.map((review) => (
                                    <div
                                        key={review.id}
                                        className="group flex items-start gap-4 p-3 -mx-3 rounded-xl hover:bg-muted/40 transition-all"
                                    >
                                        {review.image ? (
                                            <div className="relative w-28 h-[52px] rounded-md overflow-hidden flex-shrink-0 shadow-sm ring-1 ring-border/50">
                                                <Image
                                                    src={review.image}
                                                    alt={review.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-28 h-[52px] rounded-md bg-muted flex items-center justify-center flex-shrink-0 border border-border/50">
                                                <GiGamepad className="w-5 h-5 text-muted-foreground/40" />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <p className="font-semibold truncate">{review.name}</p>
                                                {review.rating && (
                                                    <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-xs font-semibold text-accent">
                                                        {review.rating}/10
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                                                {review.content}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CollapsibleSection>
                    )
                })()}

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
                                    className="group flex items-center gap-4 p-3 -mx-3 rounded-xl hover:bg-muted/40 transition-all hover:scale-[1.01]"
                                >
                                    <div className="relative w-28 h-[52px] rounded-md overflow-hidden flex-shrink-0 shadow-sm group-hover:shadow-md transition-all ring-1 ring-border/50 group-hover:ring-accent/30">
                                        <Image
                                            src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/header.jpg`}
                                            alt={game.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <p className="font-semibold truncate group-hover:text-accent transition-colors">
                                                {game.name}
                                            </p>
                                            <PlatformIcon platform="steam" />
                                        </div>
                                        <p className="text-xs text-muted-foreground/80">
                                            {game.playtime_2weeks_hours > 0 && (
                                                <span className="text-accent font-medium">{game.playtime_2weeks_hours} hrs this week</span>
                                            )}
                                            {game.playtime_2weeks_hours > 0 && game.playtime_forever_hours > 0 && (
                                                <span className="text-muted-foreground/30 mx-1.5">•</span>
                                            )}
                                            {game.playtime_forever_hours > 0 && (
                                                <span>{game.playtime_forever_hours} hrs total</span>
                                            )}
                                        </p>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 -translate-x-3 group-hover:translate-x-0 transition-all shrink-0">
                                        <FiArrowUpRight className="w-4 h-4 text-accent" />
                                    </div>
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
                                        className="group flex items-center gap-3 p-2.5 -mx-2.5 rounded-lg hover:bg-muted/40 transition-all"
                                    >
                                        <div className="relative w-16 h-7 rounded overflow-hidden flex-shrink-0 ring-1 ring-border/50 group-hover:ring-accent/30 transition-all">
                                            <Image
                                                src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/header.jpg`}
                                                alt={game.name}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>
                                        <p className="flex-1 min-w-0 text-sm font-medium truncate group-hover:text-accent group-hover:translate-x-0.5 transition-all duration-300">
                                            {game.name}
                                        </p>
                                        <div className="flex items-center gap-3 shrink-0">
                                            <span className="text-xs text-muted-foreground/60 hidden sm:inline">
                                                {game.playtime_forever_hours} hrs
                                            </span>
                                            <FiArrowUpRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-accent opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                                        </div>
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
                                    className="group flex items-center gap-3 p-2.5 -mx-2.5 rounded-lg hover:bg-muted/40 transition-all"
                                >
                                    {game.image ? (
                                        <div className="relative w-8 h-8 rounded overflow-hidden flex-shrink-0 ring-1 ring-border/50 group-hover:ring-accent/30 transition-all">
                                            <Image src={game.image} alt={game.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                    ) : (
                                        <div className="w-8 h-8 rounded border border-border/50 bg-muted/30 flex items-center justify-center flex-shrink-0 group-hover:border-accent/30 transition-colors">
                                            <FaXbox className="w-3.5 h-3.5 text-muted-foreground/50 group-hover:text-accent/70 transition-colors" />
                                        </div>
                                    )}
                                    <p className="flex-1 min-w-0 text-sm font-medium truncate group-hover:text-accent group-hover:translate-x-0.5 transition-all duration-300">
                                        {game.name}
                                    </p>
                                    <FiArrowUpRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-accent opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all shrink-0" />
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
