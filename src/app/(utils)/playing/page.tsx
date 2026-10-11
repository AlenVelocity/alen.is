import { Metadata } from 'next'
import { PageTransition } from '@/components/ui/page-transition'
import { api } from '@/trpc/server'
import { FiClock } from 'react-icons/fi'
import { GiGamepad } from 'react-icons/gi'
import { FaSteam, FaXbox } from 'react-icons/fa'
import Image from 'next/image'
import Link from 'next/link'
import { slugify, fetchXboxGames, fetchGameDetails, formatHours } from '@/lib/steam'
import { CollapsibleSection } from '@/components/ui/collapsible-section'
import { GameCover } from './_components/game-cover'

import { constructMetadata } from '@/lib/metadata'

export const metadata: Metadata = constructMetadata({
    title: 'Playing',
    description: 'What I play',
    slug: 'playing',
    ogTitle: 'Alen is Playing'
})

const steamHeader = (appid: number) => `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/header.jpg`

/** Playful severity readout for the unplayed-games ratio. The bar takes the same tone as the label. */
function backlogStatus(ratio: number) {
    if (ratio < 0.15) return { label: 'under control', tone: 'text-accent', bar: 'bg-accent' }
    if (ratio < 0.35) return { label: 'manageable', tone: 'text-accent', bar: 'bg-accent' }
    if (ratio < 0.55) return { label: 'concerning', tone: 'text-yellow-500', bar: 'bg-yellow-500' }
    if (ratio < 0.75) return { label: 'critical', tone: 'text-orange-500', bar: 'bg-orange-500' }
    return { label: 'beyond salvation', tone: 'text-destructive', bar: 'bg-destructive' }
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

    // The store API knows the real (hashed) header path for newer apps. Only the
    // handful of recently played games get this lookup; the archive falls back
    // to the library icon client-side instead of making 60+ store requests.
    const recentCovers = recentGames
        ? await Promise.all(
              recentGames.map((g) => fetchGameDetails(g.appid).then((d) => d?.headerImage ?? steamHeader(g.appid)))
          )
        : []

    // Total Steam playtime plus some sobering unit conversions for the HUD
    const totalHours = ownedGames
        ? Math.round(ownedGames.games.reduce((sum, g) => sum + g.playtime_forever_hours, 0))
        : 0
    const totalDays = Math.round(totalHours / 24)
    const yearPct = ((totalHours / (24 * 365)) * 100).toFixed(1)

    // Get recently played appids to exclude from Steam library list
    const recentAppIds = new Set(recentGames?.map((g) => g.appid) || [])

    // Xbox entries, minus anything also owned on Steam, most recently played first
    const steamSlugs = new Set(ownedGames?.games.map((g) => slugify(g.name)) || [])
    const playedAt = (iso?: string) => (iso ? Date.parse(iso) || 0 : 0)
    const xboxOnly = xboxGames
        .filter((g) => !steamSlugs.has(slugify(g.name)))
        .sort((a, b) => playedAt(b.lastPlayed) - playedAt(a.lastPlayed))

    // Steam library rows, ranked by hours. Bar widths use a square-root scale:
    // one 2,000-hour game would otherwise flatten every other bar to a sliver,
    // and the exact figure is printed on the row anyway.
    const libraryGames = ownedGames
        ? ownedGames.games.filter((game) => game.playtime_forever > 0 && !recentAppIds.has(game.appid))
        : []
    const maxLibraryHours = Math.max(...libraryGames.map((g) => g.playtime_forever_hours), 1)
    const barWidth = (hours: number) => Math.max(Math.sqrt(hours / maxLibraryHours) * 100, 1.5)

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
                    Playing
                </h1>

                {/* Stats HUD */}
                {(ownedGames || xboxGames.length > 0) && (
                    <div
                        className="flex flex-wrap items-center gap-1.5 mb-10 animate-fade-in-up opacity-0 stagger-3"
                        style={{ animationFillMode: 'forwards' }}
                    >
                        {ownedGames && (
                            <span className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm border border-border/50 font-mono-ui text-xs text-muted-foreground tabular-nums">
                                <FaSteam className="w-3.5 h-3.5 text-accent/70" />
                                {ownedGames.total_games} games
                            </span>
                        )}
                        {xboxGames.length > 0 && (
                            <span className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm border border-border/50 font-mono-ui text-xs text-muted-foreground tabular-nums">
                                <FaXbox className="w-3.5 h-3.5 text-accent/70" />
                                {xboxGames.length} games
                            </span>
                        )}
                        {totalHours > 0 && (
                            <span
                                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm border border-border/50 font-mono-ui text-xs text-muted-foreground tabular-nums"
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
                            <div
                                className="animate-fade-in-up opacity-0 stagger-5"
                                style={{ animationFillMode: 'forwards' }}
                            >
                                <CollapsibleSection title="My Reviews">
                                    <div>
                                        {gameReviews.map((review) => (
                                            <div
                                                key={review.id}
                                                className="group flex items-start gap-4 py-3 border-b border-dashed border-border/40 last:border-b-0"
                                            >
                                                {review.image ? (
                                                    <div className="relative w-28 h-[52px] rounded overflow-hidden flex-shrink-0 shadow-sm ring-1 ring-border/50">
                                                        <Image
                                                            src={review.image}
                                                            alt={review.name}
                                                            fill
                                                            sizes="112px"
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="w-28 h-[52px] rounded bg-muted flex items-center justify-center flex-shrink-0 border border-border/50">
                                                        <GiGamepad className="w-5 h-5 text-muted-foreground/40" />
                                                    </div>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-0.5">
                                                        <p className="font-semibold truncate">{review.name}</p>
                                                        {review.rating && (
                                                            <span className="shrink-0 mono-label border border-accent/30 text-accent px-1.5 py-0.5 rounded-sm">
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
                            </div>
                        )
                    })()}

                {/* Recently Played (Steam) */}
                {recentGames && recentGames.length > 0 && (
                    <section
                        className="mb-12 animate-fade-in-up opacity-0 stagger-5"
                        style={{ animationFillMode: 'forwards' }}
                    >
                        <div className="flex items-baseline justify-between gap-4 mb-4">
                            <div className="section-label">active missions</div>
                            <span className="mono-label text-muted-foreground/40 shrink-0">steam · past 2 weeks</span>
                        </div>
                        <div>
                            {recentGames.map((game, i) => (
                                <Link
                                    key={game.appid}
                                    href={`/playing/${slugify(game.name)}`}
                                    className="group flex items-center gap-4 p-3 -mx-3 rounded-lg hover:bg-muted/40 transition-colors duration-300"
                                >
                                    <div className="relative w-24 sm:w-28 aspect-[460/215] rounded overflow-hidden flex-shrink-0 shadow-sm transition-shadow duration-300 ring-1 ring-border/50 group-hover:ring-accent/40 group-hover:shadow-[0_0_16px_hsl(var(--accent)/0.15)] scanline-hover">
                                        <GameCover
                                            src={recentCovers[i] ?? steamHeader(game.appid)}
                                            fallbackSrc={game.img_icon_url}
                                            alt={game.name}
                                            sizes="112px"
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold truncate group-hover:text-accent transition-colors mb-0.5">
                                            {game.name}
                                        </p>
                                        <p className="flex flex-wrap gap-x-2 gap-y-0.5 text-xs text-muted-foreground/80 font-mono-ui tabular-nums">
                                            {game.playtime_2weeks_hours > 0 && (
                                                <span className="text-accent font-medium whitespace-nowrap">
                                                    {formatHours(game.playtime_2weeks_hours)} recently
                                                </span>
                                            )}
                                            {game.playtime_forever_hours > 0 && (
                                                <span className="whitespace-nowrap">
                                                    {formatHours(game.playtime_forever_hours)} total
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* Steam Library, ranked, with relative playtime bars */}
                {libraryGames.length > 0 && (
                    <section
                        className="mb-12 animate-fade-in-up opacity-0 stagger-6"
                        style={{ animationFillMode: 'forwards' }}
                    >
                        <div className="flex items-baseline justify-between gap-4 mb-4">
                            <div className="section-label">steam archive</div>
                            <span className="mono-label text-muted-foreground/40 shrink-0">ranked by hours</span>
                        </div>
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
                                            width: `${barWidth(game.playtime_forever_hours)}%`,
                                            // Offset by the section's own stagger-6 delay, or most of the growth
                                            // happens while the section is still invisible
                                            animationDelay: `${0.55 + Math.min(i * 0.05, 0.6)}s`
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
                                    <div className="relative w-16 h-7 rounded overflow-hidden flex-shrink-0 ring-1 ring-border/50 group-hover:ring-accent/30 transition-shadow">
                                        <GameCover
                                            src={steamHeader(game.appid)}
                                            fallbackSrc={game.img_icon_url}
                                            alt={game.name}
                                            sizes="64px"
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                    <p className="relative flex-1 min-w-0 text-sm font-medium truncate group-hover:text-accent group-hover:translate-x-0.5 transition-[color,transform] duration-300">
                                        {game.name}
                                    </p>
                                    <span className="relative font-mono-ui text-xs tabular-nums text-muted-foreground/60 group-hover:text-foreground/80 transition-colors shrink-0">
                                        {formatHours(game.playtime_forever_hours)}
                                    </span>
                                </Link>
                            ))}
                        </div>

                        {/* Backlog severity meter */}
                        {unplayed > 0 && ownedGames && (
                            <div className="mt-6 p-3 border border-dashed border-border/60 rounded-sm">
                                <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 mb-2">
                                    <span className="mono-label text-muted-foreground/60 tabular-nums">
                                        backlog: {unplayed} unplayed games
                                    </span>
                                    <span className={`mono-label ${backlog.tone}`}>status: {backlog.label}</span>
                                </div>
                                <div className="h-1.5 bg-muted/60 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full animate-bar-grow ${backlog.bar}`}
                                        style={{ width: `${Math.round(backlogRatio * 100)}%`, animationDelay: '0.85s' }}
                                    />
                                </div>
                                <p className="text-[0.65rem] font-mono-ui text-muted-foreground/40 mt-2 tabular-nums">
                                    {Math.round(backlogRatio * 100)}% of the library remains unexplored. the backlog is
                                    real.
                                </p>
                            </div>
                        )}
                    </section>
                )}

                {/* Xbox Library */}
                {xboxOnly.length > 0 && (
                    <section
                        className="mb-12 animate-fade-in-up opacity-0 stagger-6"
                        style={{ animationFillMode: 'forwards' }}
                    >
                        <div className="flex items-baseline justify-between gap-4 mb-4">
                            <div className="section-label">xbox archive</div>
                            <span className="mono-label text-muted-foreground/40 shrink-0">by last played</span>
                        </div>
                        <div>
                            {xboxOnly.map((game) => (
                                <Link
                                    key={game.titleId}
                                    href={`/playing/${slugify(game.name)}`}
                                    className="group flex items-center gap-3 p-2.5 -mx-2.5 rounded hover:bg-muted/30 transition-colors"
                                >
                                    {game.image ? (
                                        <div className="relative w-8 h-8 rounded overflow-hidden flex-shrink-0 ring-1 ring-border/50 group-hover:ring-accent/30 transition-shadow">
                                            <Image
                                                src={game.image}
                                                alt={game.name}
                                                fill
                                                sizes="32px"
                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-8 h-8 rounded border border-border/50 bg-muted/30 flex items-center justify-center flex-shrink-0 group-hover:border-accent/30 transition-colors">
                                            <FaXbox className="w-3.5 h-3.5 text-muted-foreground/50 group-hover:text-accent/70 transition-colors" />
                                        </div>
                                    )}
                                    <p className="flex-1 min-w-0 text-sm font-medium truncate group-hover:text-accent group-hover:translate-x-0.5 transition-[color,transform] duration-300">
                                        {game.name}
                                    </p>
                                    {game.maxGamerscore > 0 && (
                                        <span className="font-mono-ui text-xs tabular-nums text-muted-foreground/60 group-hover:text-foreground/80 transition-colors shrink-0">
                                            {game.currentGamerscore}
                                            <span className="text-muted-foreground/30">/{game.maxGamerscore} G</span>
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
                        <GiGamepad className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
                        <p className="mono-label text-muted-foreground/50">// no signal from the consoles</p>
                    </div>
                )}
            </div>
        </PageTransition>
    )
}
