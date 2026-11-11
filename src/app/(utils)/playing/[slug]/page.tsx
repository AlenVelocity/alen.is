import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PageTransition } from '@/components/ui/page-transition'
import { api } from '@/trpc/server'
import { resolveSlug, formatHours } from '@/lib/steam'
import { FiStar } from 'react-icons/fi'
import { AchievementList } from '../_components/achievement-list'
import Link from 'next/link'
import { BeamImage } from '@/components/ui/beam-image'
import { Persona } from '@/components/persona'

// ─── Metadata ────────────────────────────────────────────────────────────────

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    const game = await resolveSlug(slug)
    // An unknown game ends up on /lost, and the tab reads "Alen is Lost" on the way
    if (!game) return { title: 'Lost' }

    const desc =
        game.playtime_forever_hours > 0
            ? `${formatHours(game.playtime_forever_hours)} in ${game.name}, and the achievements I've unlocked.`
            : `My achievements in ${game.name}.`

    return {
        title: `Playing ${game.name}`,
        description: desc,
        openGraph: {
            title: `Alen is Playing ${game.name}`,
            description: desc,
            images: game.image ? [{ url: game.image, width: 460, height: 215, alt: game.name }] : undefined
        },
        twitter: {
            card: 'summary_large_image',
            title: `Alen is Playing ${game.name}`,
            description: desc,
            images: game.image ? [game.image] : undefined
        },
        alternates: { canonical: `/playing/${slug}` }
    }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * How far through the achievements a game is, in words. Mirrors backlogStatus
 * on /playing: Alen reads it as a status, Ban as a verdict on the game.
 */
function completionStatus(pct: number) {
    if (pct >= 100) return { alen: 'fully cleared', ban: 'beaten', tone: 'text-accent' }
    if (pct >= 75) return { alen: 'mopping up', ban: 'almost beaten', tone: 'text-accent' }
    if (pct >= 40) return { alen: 'making progress', ban: 'working on it', tone: 'text-yellow-500' }
    if (pct >= 10) return { alen: 'barely scratched', ban: 'barely touched', tone: 'text-orange-500' }
    return { alen: 'untouched', ban: 'not yet', tone: 'text-muted-foreground' }
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function GamePage({ params }: Props) {
    const { slug } = await params
    const game = await resolveSlug(slug)
    if (!game) notFound()

    const isSteam = game.platform === 'steam'
    const appid = isSteam ? Number(game.id) : null

    const showReviews = process.env.SHOW_REVIEWS === 'true'
    // Fetch platform-specific data in parallel
    const [achievementsData, recentData, xboxAchievementsData, reviewData] = await Promise.all([
        appid ? api.gaming.getGameAchievements({ appid }).catch(() => ({ steam: null })) : { steam: null },
        isSteam ? api.gaming.getRecentlyPlayed() : { steam: null },
        !isSteam ? api.gaming.getXboxGameAchievements({ titleId: game.id }).catch(() => ({ xbox: [] })) : { xbox: [] },
        showReviews
            ? api.reviews.getReview({ entityId: game.id.toString(), type: 'GAME' }).catch(() => null)
            : Promise.resolve(null)
    ])

    const achievements = achievementsData.steam
    const recentGame = recentData.steam?.find((g) => g.appid === appid)
    const recentHours = recentGame?.playtime_2weeks_hours || 0

    // Detailed Xbox achievement list
    const xboxDetailedAchievements = xboxAchievementsData.xbox || []
    const hasDetailedXbox = !isSteam && xboxDetailedAchievements.length > 0

    // Override xboxAchievements using detailed array if available
    const xboxAchievements = hasDetailedXbox
        ? {
              current: xboxDetailedAchievements.filter((a) => a.isUnlocked).length,
              total: xboxDetailedAchievements.length
          }
        : !isSteam && game.achievements
          ? game.achievements
          : null

    const completionPct =
        achievements && achievements.totalAchievements > 0
            ? Math.round((achievements.unlockedAchievements / achievements.totalAchievements) * 100)
            : xboxAchievements && xboxAchievements.total > 0
              ? Math.round((xboxAchievements.current / xboxAchievements.total) * 100)
              : null

    const completion = completionPct !== null ? completionStatus(completionPct) : null

    // Steam reports playtime, Xbox does not. A Steam game with none gets words, not "0 min"
    const neverPlayed = isSteam && game.playtime_forever_hours <= 0
    const stats = [
        isSteam && !neverPlayed ? `${formatHours(game.playtime_forever_hours)} total` : null,
        recentHours > 0 ? `${formatHours(recentHours)} in the past 2 weeks` : null,
        completionPct !== null ? `${completionPct}% of achievements unlocked` : null
    ].filter((s): s is string => s !== null)

    // The ten most recent unlocks, newest first
    const unlockedSteam = achievements
        ? achievements.achievements
              .filter((a) => a.achieved === 1)
              .sort((a, b) => b.unlocktime - a.unlocktime)
              .slice(0, 10)
        : []

    const unlockedXbox = hasDetailedXbox
        ? xboxDetailedAchievements
              .filter((a) => a.isUnlocked)
              .sort((a, b) => {
                  if (!a.unlockedDate || !b.unlockedDate) return 0
                  return new Date(b.unlockedDate).getTime() - new Date(a.unlockedDate).getTime()
              })
              .slice(0, 10)
        : []

    return (
        <PageTransition>
            <div className="container max-w-3xl py-10 md:py-14">
                {/* Back link */}
                <Link
                    href="/playing"
                    className="inline-block mono-label text-muted-foreground/50 hover:text-accent transition-colors duration-150 mb-8"
                >
                    <Persona alen="back to playing" ban="back to wins" />
                </Link>

                {/* Header art, on its own. The name is the heading under it, so the picture needs no scrim and no alt */}
                {game.image && (
                    <div className="relative w-full aspect-[460/215] rounded ban:rounded-none overflow-hidden ring-1 ring-border/40 mb-8">
                        <BeamImage
                            src={game.image}
                            alt=""
                            sizes="(min-width: 768px) 768px, 100vw"
                            className="object-cover"
                            priority
                        />
                    </div>
                )}

                {/* Same order as PageHeader: where it is from, what it is, the numbers */}
                <div className="mb-12">
                    <p className="mono-label text-muted-foreground/50 mb-3">
                        <Persona
                            alen={`// on ${isSteam ? 'steam' : 'xbox'}`}
                            ban={`On ${isSteam ? 'Steam' : 'Xbox'}.`}
                        />
                    </p>
                    {/* The display face sits on the span, not the h1: Ban's h1 face is a
                        blackletter, and a game's name (often all capitals) cannot be read in one */}
                    <h1 className="text-3xl md:text-4xl mb-3 break-words">
                        <span className="text-display block">{game.name}</span>
                    </h1>
                    {(neverPlayed || stats.length > 0) && (
                        <p className="font-mono-ui text-xs text-muted-foreground tabular-nums">
                            {neverPlayed && <Persona alen="Not played yet. " ban="Haven't got to it. " />}
                            {stats.length > 0 && `${stats.join('. ')}.`}
                        </p>
                    )}
                </div>

                {/* Review */}
                {showReviews && reviewData && (
                    <section className="mb-12">
                        <div className="section-label mb-3">
                            <Persona alen="my review" ban="his review" />
                        </div>
                        <div className="p-4 rounded-sm border border-dashed border-border/60 flex flex-col gap-2">
                            {reviewData.rating && (
                                <div className="flex items-center gap-1.5 text-accent font-mono-ui text-sm">
                                    <FiStar className="fill-current w-3.5 h-3.5" />
                                    {reviewData.rating}
                                    <span className="text-muted-foreground/50">/10</span>
                                </div>
                            )}
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                                {reviewData.content}
                            </p>
                        </div>
                    </section>
                )}

                {/* Achievements */}
                {achievements && achievements.totalAchievements > 0 && (
                    <AchievementList
                        unlocked={achievements.unlockedAchievements}
                        total={achievements.totalAchievements}
                        pct={completionPct ?? 0}
                        status={completion}
                        items={unlockedSteam.map((a) => ({
                            id: a.apiname,
                            name: a.name ?? '',
                            description: a.description,
                            icon: a.icon,
                            date: a.unlockDate ?? undefined
                        }))}
                    />
                )}
                {xboxAchievements && xboxAchievements.total > 0 && !achievements && (
                    <AchievementList
                        unlocked={xboxAchievements.current}
                        total={xboxAchievements.total}
                        pct={completionPct ?? 0}
                        status={completion}
                        items={unlockedXbox.map((a) => ({
                            id: a.id,
                            name: a.name,
                            description: a.description,
                            icon: a.icon,
                            date: a.unlockedDate,
                            score: a.gamerscore
                        }))}
                    />
                )}

                {/* Store link */}
                {isSteam && appid && (
                    <a
                        href={`https://store.steampowered.com/app/${appid}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 mono-label text-muted-foreground/60 hover:text-accent transition-colors duration-150"
                    >
                        view on steam
                        <span className="text-muted-foreground/40" aria-hidden="true">
                            ↗
                        </span>
                    </a>
                )}
            </div>
        </PageTransition>
    )
}
