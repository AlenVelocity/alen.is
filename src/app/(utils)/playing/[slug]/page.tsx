import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PageTransition } from '@/components/ui/page-transition'
import { api } from '@/trpc/server'
import { resolveSlug, formatHours } from '@/lib/steam'
import { FiArrowLeft, FiArrowUpRight, FiStar, FiClock, FiAward } from 'react-icons/fi'
import { AchievementList } from '../_components/achievement-list'
import { FaSteam, FaXbox } from 'react-icons/fa'
import Image from 'next/image'
import Link from 'next/link'

// ─── Metadata ────────────────────────────────────────────────────────────────

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    const game = await resolveSlug(slug)
    if (!game) return { title: 'Game Not Found' }

    const desc =
        game.playtime_forever_hours > 0
            ? `${game.playtime_forever_hours} hours in ${game.name}`
            : `Alen's ${game.name} stats`

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

/** Playful severity readout for achievement completion, mirrors backlogStatus on /playing */
function completionStatus(pct: number) {
    if (pct >= 100) return { label: 'fully cleared', tone: 'text-accent' }
    if (pct >= 75) return { label: 'mopping up', tone: 'text-accent' }
    if (pct >= 40) return { label: 'making progress', tone: 'text-yellow-500' }
    if (pct >= 10) return { label: 'barely scratched', tone: 'text-orange-500' }
    return { label: 'untouched', tone: 'text-muted-foreground' }
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

    // Recent unlocks, ranked by unlock time — same treatment as the flight recorder on /listening
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
            <div className="container max-w-2xl py-12 md:py-20">
                {/* Back link */}
                <Link
                    href="/playing"
                    className="inline-flex items-center gap-1.5 mono-label text-muted-foreground/50 hover:text-accent transition-colors mb-10"
                >
                    <FiArrowLeft className="w-3 h-3" />
                    back to playing
                </Link>

                {/* Header image, corner-bracket framed like the gear page's setup shot */}
                {game.image ? (
                    <div
                        className="relative mb-4 p-2 rounded border border-border/50 bg-muted/10 shadow-sm animate-fade-in-up opacity-0 stagger-1"
                        style={{ animationFillMode: 'forwards' }}
                    >
                        <span className="absolute left-0 top-0 w-3 h-3 border-l border-t border-accent/40 -translate-x-px -translate-y-px" />
                        <span className="absolute right-0 top-0 w-3 h-3 border-r border-t border-accent/40 translate-x-px -translate-y-px" />
                        <span className="absolute left-0 bottom-0 w-3 h-3 border-l border-b border-accent/40 -translate-x-px translate-y-px" />
                        <span className="absolute right-0 bottom-0 w-3 h-3 border-r border-b border-accent/40 translate-x-px translate-y-px" />

                        <div className="relative w-full aspect-[460/215] rounded-md overflow-hidden ring-1 ring-border/40 shadow-inner group">
                            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent z-10" />
                            <Image
                                src={game.image}
                                alt={game.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                                priority
                            />
                            <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 z-20 flex items-end justify-between gap-4">
                                {/* Clamped: on a phone the banner is ~150px tall, and a long name would
                                    otherwise wrap up past the top edge and get cut off */}
                                <h1 className="text-display text-xl sm:text-2xl md:text-4xl drop-shadow-md min-w-0 line-clamp-2">
                                    {game.name}
                                </h1>
                                <span className="w-8 h-8 rounded-sm bg-background/80 backdrop-blur-md border border-border/50 flex items-center justify-center shrink-0">
                                    {isSteam ? (
                                        <FaSteam className="w-3.5 h-3.5 text-foreground/80" />
                                    ) : (
                                        <FaXbox className="w-3.5 h-3.5 text-foreground/80" />
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div
                        className="flex items-center gap-3 mb-4 animate-fade-in-up opacity-0 stagger-1"
                        style={{ animationFillMode: 'forwards' }}
                    >
                        <h1 className="text-display text-2xl md:text-4xl min-w-0 break-words">{game.name}</h1>
                        <span className="w-8 h-8 rounded-sm bg-muted/40 border border-border/50 flex items-center justify-center shrink-0">
                            {isSteam ? (
                                <FaSteam className="w-3.5 h-3.5 text-foreground/70" />
                            ) : (
                                <FaXbox className="w-3.5 h-3.5 text-foreground/70" />
                            )}
                        </span>
                    </div>
                )}

                <p
                    className="mono-label text-muted-foreground/50 mb-8 animate-fade-in-up opacity-0 stagger-2"
                    style={{ animationFillMode: 'forwards' }}
                >
                    // {isSteam ? 'steam' : 'xbox'} library entry
                </p>

                {/* Stats HUD */}
                {(isSteam || recentHours > 0 || completionPct !== null) && (
                    <div
                        className="flex flex-wrap items-center gap-1.5 mb-12 animate-fade-in-up opacity-0 stagger-3"
                        style={{ animationFillMode: 'forwards' }}
                    >
                        {isSteam && (
                            <span className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm border border-border/50 font-mono-ui text-xs text-muted-foreground">
                                <FiClock className="w-3.5 h-3.5 text-accent/70" />
                                {formatHours(game.playtime_forever_hours)} total
                            </span>
                        )}
                        {recentHours > 0 && (
                            <span className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm border border-accent/30 font-mono-ui text-xs text-accent">
                                <FiClock className="w-3.5 h-3.5" />
                                {formatHours(recentHours)} past 2 weeks
                            </span>
                        )}
                        {completionPct !== null && (
                            <span className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm border border-border/50 font-mono-ui text-xs text-muted-foreground">
                                <FiAward className="w-3.5 h-3.5 text-accent/70" />
                                {completionPct}% complete
                            </span>
                        )}
                    </div>
                )}

                {/* Review */}
                {showReviews && reviewData && (
                    <section
                        className="mb-12 animate-fade-in-up opacity-0 stagger-4"
                        style={{ animationFillMode: 'forwards' }}
                    >
                        <div className="section-label mb-3">alen&apos;s review</div>
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
                        className="inline-flex items-center gap-1.5 mono-label text-muted-foreground/50 hover:text-accent transition-colors"
                    >
                        <FaSteam className="w-3.5 h-3.5" />
                        view on steam
                        <FiArrowUpRight className="w-3 h-3" />
                    </a>
                )}
            </div>
        </PageTransition>
    )
}
