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
        images: [{ url: '/api/og?is=playing', width: 1200, height: 630, alt: 'alen is playing' }]
    },
    alternates: { canonical: '/playing' }
}

function PlatformIcon({ platform }: { platform: 'steam' | 'xbox' }) {
    return platform === 'steam' ? (
        <FaSteam className="w-3 h-3 text-muted-foreground/40 shrink-0" />
    ) : (
        <FaXbox className="w-3 h-3 text-muted-foreground/40 shrink-0" />
    )
}

/** Playful severity readout for the unplayed-games ratio */
function backlogStatus(ratio: number) {
    if (ratio < 0.15) return { label: 'under control', tone: 'text-accent' }
    if (ratio < 0.35) return { label: 'manageable', tone: 'text-accent' }
    if (ratio < 0.55) return { label: 'concerning', tone: 'text-yellow-500' }
    if (ratio < 0.75) return { label: 'critical', tone: 'text-orange-500' }
    return { label: 'beyond salvation', tone: 'text-destructive' }
}

export default async function Playing() {
    const showReviews = process.env.SHOW_REVIEWS === 'true'
    const [recentData, ownedData, xboxGames, reviewsData] = await Promise.all([
        api.gaming.getRecentlyPlayed(),
        api.gaming.getOwnedGames(),
        fetchXboxGames(),
        showReviews ? api.reviews.getReviewsByType({ type: 'GAME' }) : Promise.resolve([])
    ])

    const recentGames = recentData.steam
    const ownedGames = ownedData.steam
    const hasData = recentGames || ownedGames || xboxGames.length > 0

    // Total Steam playtime plus some sobering unit conversions for the HUD
    const totalHours = ownedGames
        ? Math.round(ownedGames.games.reduce((sum, g) => sum + g.playtime_forever_hours, 0))
        : 0
    const totalDays = Math.round(totalHours / 24)
    const yearPct = ((totalHours / (24 * 365)) * 100).toFixed(1)

    // Get recently played appids to exclude from Steam library list
    const recentAppIds = new Set(recentGames?.map((g) => g.appid) || [])

    // Build Xbox game entries (exclude games that are also on Steam)
    const steamSlugs = new Set(ownedGames?.games.map((g) => slugify(g.name)) || [])
    const xboxOnly = xboxGames.filter((g) => !steamSlugs.has(slugify(g.name)))

    // Steam library rows, ranked by hours — bar widths are relative to the top game
    const libraryGames = ownedGames
        ? ownedGames.games.filter((game) => game.playtime_forever > 0 && !recentAppIds.has(game.appid))
        : []
    const maxLibraryHours = Math.max(...libraryGames.map((g) => g.playtime_forever_hours), 1)

    // Backlog meter
    const unplayed = ownedGames ? ownedGames.games.filter((g) => g.playtime_forever === 0).length : 0
    const backlogRatio = ownedGames && ownedGames.total_games > 0 ? unplayed / ownedGames.total_games : 0
    const backlog = backlogStatus(backlogRatio)

    return (
        <PageTransition>
            <div className="container max-w-2xl py-12 md:py-20">
                {/* Header */}
                <p
                    className="mono-label text-muted-foreground/50 mb-4 animate-fade-in-up opacity-0 stagger-1"
                    style={{ animationFillMode: 'forwards' }}
                >
                    // human simulation logs
                </p>
                <h1
                    className="text-display text-4xl md:text-5xl mb-6 animate-fade-in-up opacity-0 stagger-2"
                    style={{ animationFillMode: 'forwards' }}
                >
                    <span className="inline-block animate-glitch-shift">Playing</span>
                </h1>

                {/* Stats HUD */}
                {(ownedGames || xboxGames.length > 0) && (
                    <div
                        className="flex flex-wrap items-center gap-1.5 mb-10 animate-fade-in-up opacity-0 stagger-3"
                        style={{ animationFillMode: 'forwards' }}
                    >
                        {ownedGames && (
                            <span className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm border border-border/50 font-mono-ui text-xs text-muted-foreground hover:border-accent/40 hover:text-foreground transition-colors">
                                <FaSteam className="w-3.5 h-3.5 text-accent/70" />
                                {ownedGames.total_games} games
                            </span>
                        )}
                        {xboxGames.length > 0 && (
                            <span className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm border border-border/50 font-mono-ui text-xs text-muted-foreground hover:border-accent/40 hover:text-foreground transition-colors">
                                <FaXbox className="w-3.5 h-3.5 text-accent/70" />
                                {xboxGames.length} games
                            </span>
                        )}
                        {totalHours > 0 && (
                            <span
                                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm border border-border/50 font-mono-ui text-xs text-muted-foreground hover:border-accent/40 hover:text-foreground transition-colors"
                                title={`that's ${yearPct}% of a whole year`}
                            >
                                <FiClock className="w-3.5 h-3.5 text-accent/70" />
                                {totalHours.toLocaleString()} hrs logged ≈ {totalDays} days
                            </span>
                        )}
                    </div>
                )}

                {/* About */}
                <section
                    className="mb-12 space-y-4 text-muted-foreground leading-relaxed animate-fade-in-up opacity-0 stagger-4"
                    style={{ animationFillMode: 'forwards' }}
                >
                    <p>Big fan of story-driven games and JRPGs. Persona changed my brain chemistry.</p>
                </section>

                {/* My Reviews */}
                {showReviews &&
                    (() => {
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
                    <section
                        className="mb-12 animate-fade-in-up opacity-0 stagger-5"
                        style={{ animationFillMode: 'forwards' }}
                    >
                        <div className="section-label mb-4">active missions</div>
                        <div>
                            {recentGames.map((game) => (
                                <Link
                                    key={game.appid}
                                    href={`/playing/${slugify(game.name)}`}
                                    className="group flex items-center gap-4 p-3 -mx-3 rounded-lg hover:bg-muted/40 transition-all duration-300"
                                >
                                    <div className="relative w-28 h-[52px] rounded overflow-hidden flex-shrink-0 shadow-sm transition-all duration-300 ring-1 ring-border/50 group-hover:ring-accent/40 group-hover:shadow-[0_0_16px_hsl(var(--accent)/0.15)] scanline-hover">
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
                                        <p className="text-xs text-muted-foreground/80 font-mono-ui">
                                            {game.playtime_2weeks_hours > 0 && (
                                                <span className="text-accent font-medium">
                                                    {game.playtime_2weeks_hours} hrs this week
                                                </span>
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

                {/* Steam Library — ranked, with relative playtime bars */}
                {libraryGames.length > 0 && (
                    <section
                        className="mb-12 animate-fade-in-up opacity-0 stagger-6"
                        style={{ animationFillMode: 'forwards' }}
                    >
                        <div className="section-label mb-4">steam archive</div>
                        <div>
                            {libraryGames.map((game, i) => (
                                <Link
                                    key={game.appid}
                                    href={`/playing/${slugify(game.name)}`}
                                    className="group relative flex items-center gap-3 p-2.5 -mx-2.5 rounded overflow-hidden hover:bg-muted/30 transition-colors"
                                >
                                    {/* Relative playtime bar behind the row */}
                                    <div
                                        className="absolute inset-y-0 left-0 bg-accent/[0.06] group-hover:bg-accent/10 transition-colors animate-bar-grow"
                                        style={{
                                            width: `${Math.max((game.playtime_forever_hours / maxLibraryHours) * 100, 2)}%`,
                                            animationDelay: `${Math.min(i * 0.05, 0.6)}s`
                                        }}
                                        aria-hidden="true"
                                    />
                                    <span
                                        className={`relative mono-label w-5 text-right shrink-0 transition-colors ${
                                            i < 3
                                                ? 'text-accent/70 [text-shadow:var(--glow-accent)]'
                                                : 'text-muted-foreground/30 group-hover:text-accent/60'
                                        }`}
                                    >
                                        {String(i + 1).padStart(2, '0')}
                                    </span>
                                    <div className="relative w-16 h-7 rounded overflow-hidden flex-shrink-0 ring-1 ring-border/50 group-hover:ring-accent/30 transition-all">
                                        <Image
                                            src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/header.jpg`}
                                            alt={game.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                    <p className="relative flex-1 min-w-0 text-sm font-medium truncate group-hover:text-accent group-hover:translate-x-0.5 transition-all duration-300">
                                        {game.name}
                                    </p>
                                    <div className="relative flex items-center gap-3 shrink-0">
                                        <span className="font-mono-ui text-xs text-muted-foreground/60 hidden sm:inline">
                                            {game.playtime_forever_hours} hrs
                                        </span>
                                        <FiArrowUpRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-accent opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Backlog severity meter */}
                        {unplayed > 0 && ownedGames && (
                            <div className="mt-6 p-3 border border-dashed border-border/60 rounded-sm">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="mono-label text-muted-foreground/60">
                                        backlog: {unplayed} unplayed games
                                    </span>
                                    <span className={`mono-label ${backlog.tone}`}>status: {backlog.label}</span>
                                </div>
                                <div className="h-1.5 bg-muted/60 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-accent via-yellow-500 to-destructive rounded-full animate-bar-grow"
                                        style={{ width: `${Math.round(backlogRatio * 100)}%`, animationDelay: '0.3s' }}
                                    />
                                </div>
                                <p className="text-[0.65rem] font-mono-ui text-muted-foreground/40 mt-2">
                                    {Math.round(backlogRatio * 100)}% of the library remains unexplored. the backlog is
                                    real.
                                </p>
                            </div>
                        )}
                    </section>
                )}

                {/* Xbox Library */}
                {xboxOnly.length > 0 && (
                    <section className="mb-12">
                        <div className="section-label mb-4">xbox archive</div>
                        <div>
                            {xboxOnly.map((game) => (
                                <Link
                                    key={game.titleId}
                                    href={`/playing/${slugify(game.name)}`}
                                    className="group flex items-center gap-3 p-2.5 -mx-2.5 rounded hover:bg-muted/30 transition-colors"
                                >
                                    {game.image ? (
                                        <div className="relative w-8 h-8 rounded overflow-hidden flex-shrink-0 ring-1 ring-border/50 group-hover:ring-accent/30 transition-all">
                                            <Image
                                                src={game.image}
                                                alt={game.name}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
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
