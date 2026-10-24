import { Metadata } from 'next'
import { PageTransition } from '@/components/ui/page-transition'
import { DecodeText } from '@/components/ui/decode-text'
import { api } from '@/trpc/server'
import { GiGamepad } from 'react-icons/gi'
import { FaXbox } from 'react-icons/fa'
import Image from 'next/image'
import Link from 'next/link'
import { slugify, fetchXboxGames, fetchGameDetails, formatHours } from '@/lib/steam'
import { CollapsibleSection } from '@/components/ui/collapsible-section'
import { GamePortrait } from './_components/game-portrait'

import { constructMetadata } from '@/lib/metadata'

export const metadata: Metadata = constructMetadata({
    title: 'Playing',
    description: 'What I play',
    slug: 'playing',
    ogTitle: 'Alen is Playing'
})

const steamHeader = (appid: number) => `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/header.jpg`
const steamPortrait = (appid: number) =>
    `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/library_600x900.jpg`

/** Shared tile chrome: a library capsule whose ring turns green when hovered */
const tileClassName =
    'relative aspect-[2/3] rounded overflow-hidden ring-1 ring-border/50 bg-muted/30 transition-shadow duration-200 group-hover:ring-accent/60 scanline-hover'

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
    // to a name tile client-side instead of making 60+ store requests.
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

    // Get recently played appids to exclude from Steam library list
    const recentAppIds = new Set(recentGames?.map((g) => g.appid) || [])

    // Xbox entries, minus anything also owned on Steam, most recently played first
    const steamSlugs = new Set(ownedGames?.games.map((g) => slugify(g.name)) || [])
    const playedAt = (iso?: string) => (iso ? Date.parse(iso) || 0 : 0)
    const xboxOnly = xboxGames
        .filter((g) => !steamSlugs.has(slugify(g.name)))
        .sort((a, b) => playedAt(b.lastPlayed) - playedAt(a.lastPlayed))

    // Steam library, ranked by hours
    const libraryGames = ownedGames
        ? ownedGames.games.filter((game) => game.playtime_forever > 0 && !recentAppIds.has(game.appid))
        : []

    // Backlog meter
    const unplayed = ownedGames ? ownedGames.games.filter((g) => g.playtime_forever === 0).length : 0
    const backlogRatio = ownedGames && ownedGames.total_games > 0 ? unplayed / ownedGames.total_games : 0
    const backlog = backlogStatus(backlogRatio)

    return (
        <PageTransition>
            <div className="container max-w-2xl py-12 md:py-20">
                {/* Header */}
                <p className="mono-label text-muted-foreground/50 mb-4">// human simulation logs</p>
                <h1 className="text-display text-4xl md:text-5xl mb-6">
                    <DecodeText text="Playing" onMount />
                </h1>

                {/* The numbers, as a sentence */}
                {(ownedGames || xboxGames.length > 0) && (
                    <p className="font-mono-ui text-xs text-muted-foreground tabular-nums mb-10">
                        {ownedGames && `${ownedGames.total_games} games on Steam`}
                        {ownedGames && xboxGames.length > 0 && ', '}
                        {xboxGames.length > 0 && `${xboxGames.length} on Xbox`}
                        {totalHours > 0 && `. ${totalHours.toLocaleString()} hours, which is ${totalDays} days.`}
                    </p>
                )}

                {/* About */}
                <section className="mb-12 space-y-4 text-muted-foreground leading-relaxed">
                    <p>Big fan of story-driven games and JRPGs. Persona changed my brain chemistry.</p>
                </section>

                {/* My Reviews */}
                {showReviews &&
                    (() => {
                        const gameReviews = reviewsData
                        if (!gameReviews || gameReviews.length === 0) return null
                        return (
                            <div>
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

                {/* Recently Played (Steam): the library's front shelf */}
                {recentGames && recentGames.length > 0 && (
                    <section className="mb-14">
                        <div className="flex items-baseline justify-between gap-4 mb-4">
                            <div className="section-label">recently played</div>
                            <span className="mono-label text-muted-foreground/40 shrink-0">steam · past 2 weeks</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                            {recentGames.map((game, i) => (
                                <Link key={game.appid} href={`/playing/${slugify(game.name)}`} className="group block">
                                    <div className={tileClassName}>
                                        <GamePortrait
                                            portraitSrc={steamPortrait(game.appid)}
                                            headerSrc={recentCovers[i] ?? steamHeader(game.appid)}
                                            name={game.name}
                                            sizes="(min-width: 640px) 160px, 50vw"
                                        />
                                    </div>
                                    <p className="mt-2 text-sm font-medium truncate group-hover:text-accent transition-colors">
                                        {game.name}
                                    </p>
                                    {game.playtime_2weeks_hours > 0 && (
                                        <p className="mono-label text-accent tabular-nums truncate">
                                            {formatHours(game.playtime_2weeks_hours)} recently
                                        </p>
                                    )}
                                    {game.playtime_forever_hours > 0 && (
                                        <p className="mono-label text-muted-foreground/50 tabular-nums truncate">
                                            {formatHours(game.playtime_forever_hours)} total
                                        </p>
                                    )}
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* Steam Library, ranked by hours */}
                {libraryGames.length > 0 && (
                    <section className="mb-14">
                        <div className="flex items-baseline justify-between gap-4 mb-4">
                            <div className="section-label">steam library</div>
                            <span className="mono-label text-muted-foreground/40 shrink-0">ranked by hours</span>
                        </div>
                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5 sm:gap-3">
                            {libraryGames.map((game) => (
                                <Link key={game.appid} href={`/playing/${slugify(game.name)}`} className="group block">
                                    <div className={tileClassName}>
                                        <GamePortrait
                                            portraitSrc={steamPortrait(game.appid)}
                                            headerSrc={steamHeader(game.appid)}
                                            name={game.name}
                                            sizes="(min-width: 640px) 128px, 33vw"
                                        />
                                    </div>
                                    <p className="mt-1.5 text-xs font-medium truncate group-hover:text-accent transition-colors">
                                        {game.name}
                                    </p>
                                    <p className="mono-label text-muted-foreground/50 tabular-nums">
                                        {formatHours(game.playtime_forever_hours)}
                                    </p>
                                </Link>
                            ))}
                        </div>

                        {/* Backlog severity meter */}
                        {unplayed > 0 && ownedGames && (
                            <div className="mt-8 p-3 border border-dashed border-border/60 rounded-sm">
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
                    <section className="mb-12">
                        <div className="flex items-baseline justify-between gap-4 mb-4">
                            <div className="section-label">xbox library</div>
                            <span className="mono-label text-muted-foreground/40 shrink-0">by last played</span>
                        </div>
                        <div>
                            {xboxOnly.map((game) => (
                                <Link
                                    key={game.titleId}
                                    href={`/playing/${slugify(game.name)}`}
                                    className="group flex items-center gap-3 py-2.5 border-b border-dashed border-border/40 last:border-b-0"
                                >
                                    {game.image ? (
                                        <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0 ring-1 ring-border/50">
                                            <Image
                                                src={game.image}
                                                alt={game.name}
                                                fill
                                                sizes="40px"
                                                className="object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-10 h-10 rounded border border-border/50 bg-muted/30 flex items-center justify-center flex-shrink-0">
                                            <FaXbox className="w-3.5 h-3.5 text-muted-foreground/50" />
                                        </div>
                                    )}
                                    <p className="flex-1 min-w-0 text-sm font-medium truncate group-hover:text-accent transition-colors duration-200">
                                        {game.name}
                                    </p>
                                    {game.maxGamerscore > 0 && (
                                        <span className="font-mono-ui text-xs tabular-nums text-muted-foreground/60 shrink-0">
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
