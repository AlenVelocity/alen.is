import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PageTransition } from '@/components/ui/page-transition'
import { api } from '@/trpc/server'
import { resolveSlug } from '@/lib/steam'
import { FiArrowLeft, FiArrowUpRight, FiCheck, FiStar, FiClock, FiAward } from 'react-icons/fi'
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

function formatPlaytime(hours: number): string {
    if (hours === 0) return '—'
    if (hours < 1) return `${Math.round(hours * 60)} min`
    if (hours >= 100) return `${Math.round(hours)} hrs`
    return `${hours} hrs`
}

function formatUnlockDate(isoDate: string | null): string {
    if (!isoDate) return ''
    try {
        const date = new Date(isoDate)
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    } catch {
        return ''
    }
}

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
                        className="relative mb-4 p-2 rounded-lg border border-border/50 bg-muted/10 shadow-sm animate-fade-in-up opacity-0 stagger-1"
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
                            <div className="absolute bottom-4 left-4 right-4 z-20 flex items-end justify-between gap-4">
                                <h1 className="text-display text-2xl md:text-4xl drop-shadow-md">{game.name}</h1>
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
                        <h1 className="text-display text-2xl md:text-4xl">{game.name}</h1>
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
                <div
                    className="flex flex-wrap items-center gap-1.5 mb-12 animate-fade-in-up opacity-0 stagger-3"
                    style={{ animationFillMode: 'forwards' }}
                >
                    {isSteam && (
                        <span className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm border border-border/50 font-mono-ui text-xs text-muted-foreground">
                            <FiClock className="w-3.5 h-3.5 text-accent/70" />
                            {formatPlaytime(game.playtime_forever_hours)} total
                        </span>
                    )}
                    {recentHours > 0 && (
                        <span className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm border border-accent/30 font-mono-ui text-xs text-accent">
                            <FiClock className="w-3.5 h-3.5" />
                            {formatPlaytime(recentHours)} this week
                        </span>
                    )}
                    {completionPct !== null && (
                        <span className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm border border-border/50 font-mono-ui text-xs text-muted-foreground">
                            <FiAward className="w-3.5 h-3.5 text-accent/70" />
                            {completionPct}% complete
                        </span>
                    )}
                </div>

                {/* Review */}
                {showReviews && reviewData && (
                    <section
                        className="mb-12 animate-fade-in-up opacity-0 stagger-4"
                        style={{ animationFillMode: 'forwards' }}
                    >
                        <div className="section-label mb-3">alen&apos;s review</div>
                        <div className="p-4 rounded-lg border border-dashed border-border/60 flex flex-col gap-2">
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

                {/* Achievements (Steam) */}
                {achievements && achievements.totalAchievements > 0 && (
                    <section
                        className="mb-12 animate-fade-in-up opacity-0 stagger-5"
                        style={{ animationFillMode: 'forwards' }}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="section-label">achievements</div>
                            <span className="mono-label text-muted-foreground/40">
                                {achievements.unlockedAchievements}/{achievements.totalAchievements}
                            </span>
                        </div>

                        <div className="h-1.5 bg-muted/60 rounded-full overflow-hidden mb-2">
                            <div
                                className="h-full bg-gradient-to-r from-accent/70 to-accent rounded-full animate-bar-grow"
                                style={{ width: `${completionPct}%` }}
                            />
                        </div>
                        {completion && (
                            <p className="mono-label text-muted-foreground/40 mb-6">
                                status: <span className={completion.tone}>{completion.label}</span>
                            </p>
                        )}

                        {unlockedSteam.length > 0 && (
                            <div>
                                {unlockedSteam.map((achievement, i) => (
                                    <div
                                        key={achievement.apiname}
                                        className="group flex items-center gap-3 py-2.5 border-b border-dashed border-border/40 last:border-b-0 hover:border-accent/30 transition-colors"
                                    >
                                        <span className="mono-label text-muted-foreground/30 w-5 text-right shrink-0 group-hover:text-accent/60 transition-colors">
                                            {String(i + 1).padStart(2, '0')}
                                        </span>
                                        {achievement.icon ? (
                                            <div className="relative w-9 h-9 rounded overflow-hidden flex-shrink-0 ring-1 ring-border/50 group-hover:ring-accent/40 transition-all">
                                                <Image
                                                    src={achievement.icon}
                                                    alt={achievement.name || ''}
                                                    fill
                                                    unoptimized
                                                    className="object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-9 h-9 rounded bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                                                <FiCheck className="w-4 h-4 text-accent" />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate group-hover:text-accent transition-colors">
                                                {achievement.name}
                                            </p>
                                            {achievement.description && (
                                                <p className="text-xs text-muted-foreground/60 truncate">
                                                    {achievement.description}
                                                </p>
                                            )}
                                        </div>
                                        {achievement.unlockDate && (
                                            <span className="mono-label text-muted-foreground/40 shrink-0 hidden sm:inline">
                                                {formatUnlockDate(achievement.unlockDate)}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {achievements.totalAchievements > unlockedSteam.length && (
                            <p className="mono-label text-muted-foreground/30 mt-3">
                                + {achievements.totalAchievements - unlockedSteam.length} more locked
                            </p>
                        )}
                    </section>
                )}

                {/* Achievements (Xbox) */}
                {xboxAchievements && xboxAchievements.total > 0 && !achievements && (
                    <section
                        className="mb-12 animate-fade-in-up opacity-0 stagger-5"
                        style={{ animationFillMode: 'forwards' }}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="section-label">achievements</div>
                            <span className="mono-label text-muted-foreground/40">
                                {xboxAchievements.current}/{xboxAchievements.total}
                            </span>
                        </div>

                        <div className="h-1.5 bg-muted/60 rounded-full overflow-hidden mb-2">
                            <div
                                className="h-full bg-gradient-to-r from-accent/70 to-accent rounded-full animate-bar-grow"
                                style={{ width: `${completionPct}%` }}
                            />
                        </div>
                        {completion && (
                            <p className="mono-label text-muted-foreground/40 mb-6">
                                status: <span className={completion.tone}>{completion.label}</span>
                            </p>
                        )}

                        {unlockedXbox.length > 0 && (
                            <div>
                                {unlockedXbox.map((achievement, i) => (
                                    <div
                                        key={achievement.id}
                                        className="group flex items-center gap-3 py-2.5 border-b border-dashed border-border/40 last:border-b-0 hover:border-accent/30 transition-colors"
                                    >
                                        <span className="mono-label text-muted-foreground/30 w-5 text-right shrink-0 group-hover:text-accent/60 transition-colors">
                                            {String(i + 1).padStart(2, '0')}
                                        </span>
                                        {achievement.icon ? (
                                            <div className="relative w-9 h-9 rounded overflow-hidden flex-shrink-0 ring-1 ring-border/50 group-hover:ring-accent/40 transition-all">
                                                <Image
                                                    src={achievement.icon}
                                                    alt={achievement.name || ''}
                                                    fill
                                                    unoptimized
                                                    className="object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-9 h-9 rounded bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                                                <FiCheck className="w-4 h-4 text-accent" />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate group-hover:text-accent transition-colors">
                                                {achievement.name}
                                            </p>
                                            {achievement.description && (
                                                <p className="text-xs text-muted-foreground/60 truncate">
                                                    {achievement.description}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            {achievement.gamerscore > 0 && (
                                                <span className="mono-label border border-accent/25 text-accent/70 px-1.5 py-0.5 rounded-sm">
                                                    {achievement.gamerscore}g
                                                </span>
                                            )}
                                            {achievement.unlockedDate && (
                                                <span className="mono-label text-muted-foreground/40 hidden sm:inline">
                                                    {formatUnlockDate(achievement.unlockedDate)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {xboxDetailedAchievements.length > unlockedXbox.length && (
                            <p className="mono-label text-muted-foreground/30 mt-3">
                                + {xboxDetailedAchievements.length - unlockedXbox.length} more locked
                            </p>
                        )}
                    </section>
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
