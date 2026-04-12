import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PageTransition } from '@/components/ui/page-transition'
import { api } from '@/trpc/server'
import { fetchAllGames, resolveSlug, slugify } from '@/lib/steam'
import { FiArrowLeft, FiArrowUpRight, FiCheck, FiStar } from 'react-icons/fi'
import { FaSteam, FaXbox } from 'react-icons/fa'
import Image from 'next/image'
import Link from 'next/link'

// ─── Static generation ──────────────────────────────────────────────────────

export const dynamicParams = true

export async function generateStaticParams() {
    const games = await fetchAllGames()
    return games
        .filter((g) => g.playtime_forever_hours > 0 || g.achievements?.current)
        .map((g) => ({ slug: g.slug }))
}

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
            images: game.image ? [{ url: game.image, width: 460, height: 215, alt: game.name }] : undefined,
        },
        twitter: {
            card: 'summary_large_image',
            title: `Alen is Playing ${game.name}`,
            description: desc,
            images: game.image ? [game.image] : undefined,
        },
        alternates: { canonical: `/playing/${slug}` },
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
        showReviews ? api.reviews.getReview({ entityId: game.id.toString(), type: 'GAME' }).catch(() => null) : Promise.resolve(null)
    ])

    const achievements = achievementsData.steam
    const recentGame = recentData.steam?.find((g) => g.appid === appid)
    const recentHours = recentGame?.playtime_2weeks_hours || 0

    // Detailed Xbox achievement list
    const xboxDetailedAchievements = xboxAchievementsData.xbox || []
    const hasDetailedXbox = !isSteam && xboxDetailedAchievements.length > 0

    // Fix: Override xboxAchievements using detailed array if available
    const xboxAchievements = hasDetailedXbox
        ? {
            current: xboxDetailedAchievements.filter((a) => a.isUnlocked).length,
            total: xboxDetailedAchievements.length,
        }
        : (!isSteam && game.achievements ? game.achievements : null)

    const completionPct = achievements && achievements.totalAchievements > 0
        ? Math.round((achievements.unlockedAchievements / achievements.totalAchievements) * 100)
        : xboxAchievements && xboxAchievements.total > 0
            ? Math.round((xboxAchievements.current / xboxAchievements.total) * 100)
            : null

    return (
        <PageTransition>
            <div className="container max-w-2xl py-12 md:py-20">
                {/* Back link */}
                <Link
                    href="/playing"
                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-accent transition-colors mb-8"
                >
                    <FiArrowLeft className="w-3.5 h-3.5" />
                    Back to Playing
                </Link>

                {/* Header image and Title */}
                {game.image && (
                    <div
                        className="relative w-full aspect-[460/215] rounded-2xl overflow-hidden mb-10 shadow-xl shadow-black/5 ring-1 ring-border/50 group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent z-10" />
                        <Image src={game.image} alt={game.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" priority />

                        {/* Title overlay */}
                        <div className="absolute bottom-6 left-6 right-6 z-20 flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight drop-shadow-md">{game.name}</h1>
                            <div className="w-10 h-10 rounded-full bg-background/80 backdrop-blur-md border border-white/10 shadow-lg flex items-center justify-center shrink-0">
                                {isSteam ? (
                                    <FaSteam className="w-4 h-4 text-foreground/80" />
                                ) : (
                                    <FaXbox className="w-4 h-4 text-foreground/80" />
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Fallback Title if no image */}
                {!game.image && (
                    <div className="flex items-center gap-3 mb-10">
                        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">{game.name}</h1>
                        <div className="w-10 h-10 rounded-full bg-muted/50 border border-border/50 flex items-center justify-center shrink-0">
                            {isSteam ? (
                                <FaSteam className="w-4 h-4 text-foreground/70" />
                            ) : (
                                <FaXbox className="w-4 h-4 text-foreground/70" />
                            )}
                        </div>
                    </div>
                )}

                {/* Review Section */}
                {showReviews && reviewData && (
                    <section className="mb-14">
                        <div className="p-6 rounded-2xl bg-card border border-border mt-8 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between border-b pb-2">
                                <h3 className="font-bold text-lg tracking-tight">Alen's Review</h3>
                                {reviewData.rating && (
                                    <div className="flex items-center gap-1.5 text-accent font-bold">
                                        <FiStar className="fill-current w-4 h-4" />
                                        <span>{reviewData.rating} <span className="text-muted-foreground/50 text-sm">/ 10</span></span>
                                    </div>
                                )}
                            </div>
                            <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                                {reviewData.content}
                            </p>
                        </div>
                    </section>
                )}

                {/* My Stats */}
                <section className="mb-14">
                    <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider border-l-2 border-accent pl-3 mb-5">
                        My Stats
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {isSteam && (
                            <div className="p-5 rounded-2xl border border-border/50 bg-muted/20 flex flex-col gap-1 shadow-sm hover:border-border transition-colors">
                                <p className="text-3xl font-bold tracking-tight">
                                    {formatPlaytime(game.playtime_forever_hours)}
                                </p>
                                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mt-1">total playtime</p>
                            </div>
                        )}
                        {recentHours > 0 && (
                            <div className="p-5 rounded-2xl border border-accent/20 bg-accent/5 flex flex-col gap-1 relative overflow-hidden shadow-sm shadow-accent/5 block group">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-accent/10 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none group-hover:bg-accent/20 transition-colors duration-500" />
                                <p className="text-3xl font-bold tracking-tight text-accent relative z-10">{formatPlaytime(recentHours)}</p>
                                <p className="text-[10px] font-semibold text-accent/70 uppercase tracking-widest relative z-10 mt-1">this week</p>
                            </div>
                        )}
                        {completionPct !== null && (
                            <div className="p-5 rounded-2xl border border-border/50 bg-muted/20 flex flex-col gap-1 shadow-sm hover:border-border transition-colors">
                                <p className="text-3xl font-bold tracking-tight">{completionPct}%</p>
                                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mt-1">completion</p>
                            </div>
                        )}
                        {xboxAchievements && (
                            <div className="p-5 rounded-2xl border border-border/50 bg-muted/20 flex flex-col gap-1 shadow-sm hover:border-border transition-colors">
                                <p className="text-3xl font-bold tracking-tight flex items-baseline gap-1">
                                    {xboxAchievements.current}
                                    <span className="text-muted-foreground/40 text-lg font-medium">
                                        /{xboxAchievements.total}
                                    </span>
                                </p>
                                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mt-1">achievements</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Steam Achievements (detailed) */}
                {achievements && achievements.totalAchievements > 0 && (
                    <section className="mb-10">
                        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider border-l-2 border-accent pl-3 mb-4">
                            Achievements
                            <span className="text-muted-foreground/40 ml-2 normal-case font-normal">
                                {achievements.unlockedAchievements} / {achievements.totalAchievements}
                            </span>
                        </h2>

                        {/* Progress bar */}
                        <div className="h-2.5 rounded-full bg-muted/40 border border-border/50 overflow-hidden mb-8 relative shadow-inner">
                            {completionPct === 100 && (
                                <div className="absolute inset-0 bg-accent/20 blur-sm z-0" />
                            )}
                            <div
                                className="h-full bg-gradient-to-r from-accent/80 to-accent rounded-full transition-all duration-1000 relative z-10"
                                style={{ width: `${completionPct}%` }}
                            />
                        </div>

                        {(() => {
                            const unlocked = achievements.achievements
                                .filter((a) => a.achieved === 1)
                                .sort((a, b) => b.unlocktime - a.unlocktime)
                                .slice(0, 10)

                            const locked = achievements.achievements
                                .filter((a) => a.achieved === 0)
                                .slice(0, 5)

                            return (
                                <>
                                    {unlocked.length > 0 && (
                                        <div className="mb-4">
                                            <p className="text-xs text-muted-foreground/50 uppercase tracking-wider mb-2">
                                                Recent Unlocks
                                            </p>
                                            {unlocked.map((achievement) => (
                                                <div
                                                    key={achievement.apiname}
                                                    className="group flex items-center gap-4 p-3 mb-2 rounded-xl bg-muted/10 border border-border/40 hover:bg-muted/30 hover:border-border/80 transition-all shadow-sm"
                                                >
                                                    {achievement.icon ? (
                                                        <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 ring-2 ring-accent/40 shadow-sm group-hover:ring-accent transition-colors">
                                                            <Image src={achievement.icon} alt={achievement.name || ""} fill unoptimized className="object-cover" />
                                                        </div>
                                                    ) : (
                                                        <div className="w-12 h-12 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                                                            <FiCheck className="w-5 h-5 text-accent" />
                                                        </div>
                                                    )}
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-semibold text-foreground/90 truncate group-hover:text-accent transition-colors">
                                                            {achievement.name}
                                                        </p>
                                                        {achievement.description && (
                                                            <p className="text-xs text-muted-foreground/70 truncate mt-0.5">
                                                                {achievement.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                    {achievement.unlockDate && (
                                                        <span className="text-xs font-medium text-muted-foreground/50 shrink-0 hidden sm:inline bg-background px-2 py-1 rounded-md border border-border/30">
                                                            {formatUnlockDate(achievement.unlockDate)}
                                                        </span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {achievements.totalAchievements > 15 && (
                                        <p className="text-xs text-muted-foreground/40 mt-3 italic">
                                            + {achievements.totalAchievements - unlocked.length} more
                                        </p>
                                    )}
                                </>
                            )
                        })()}
                    </section>
                )}

                {/* Xbox Achievements (detailed) */}
                {xboxAchievements && xboxAchievements.total > 0 && !achievements && (
                    <section className="mb-10">
                        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider border-l-2 border-accent pl-3 mb-4">
                            Achievements
                            <span className="text-muted-foreground/40 ml-2 normal-case font-normal">
                                {xboxAchievements.current} / {xboxAchievements.total}
                            </span>
                        </h2>

                        {/* Progress bar */}
                        <div className="h-2.5 rounded-full bg-muted/40 border border-border/50 overflow-hidden mb-8 relative shadow-inner">
                            {completionPct === 100 && (
                                <div className="absolute inset-0 bg-accent/20 blur-sm z-0" />
                            )}
                            <div
                                className="h-full bg-gradient-to-r from-accent/80 to-accent rounded-full transition-all duration-1000 relative z-10"
                                style={{ width: `${completionPct}%` }}
                            />
                        </div>

                        {xboxDetailedAchievements.length > 0 && (() => {
                            const unlocked = xboxDetailedAchievements
                                .filter((a) => a.isUnlocked)
                                .sort((a, b) => {
                                    if (!a.unlockedDate || !b.unlockedDate) return 0
                                    return new Date(b.unlockedDate).getTime() - new Date(a.unlockedDate).getTime()
                                })
                                .slice(0, 10)

                            const locked = xboxDetailedAchievements
                                .filter((a) => !a.isUnlocked)
                                .slice(0, 5)

                            return (
                                <>
                                    {unlocked.length > 0 && (
                                        <div className="mb-4">
                                            <p className="text-xs text-muted-foreground/50 uppercase tracking-wider mb-2">
                                                Recent Unlocks
                                            </p>
                                            {unlocked.map((achievement) => (
                                                <div
                                                    key={achievement.id}
                                                    className="group flex items-center gap-4 p-3 mb-2 rounded-xl bg-muted/10 border border-border/40 hover:bg-muted/30 hover:border-border/80 transition-all shadow-sm"
                                                >
                                                    {achievement.icon ? (
                                                        <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 ring-2 ring-accent/40 shadow-sm group-hover:ring-accent transition-colors">
                                                            <Image src={achievement.icon} alt={achievement.name || ""} fill unoptimized className="object-cover" />
                                                        </div>
                                                    ) : (
                                                        <div className="w-12 h-12 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                                                            <FiCheck className="w-5 h-5 text-accent" />
                                                        </div>
                                                    )}
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-semibold text-foreground/90 truncate group-hover:text-accent transition-colors">
                                                            {achievement.name}
                                                        </p>
                                                        {achievement.description && (
                                                            <p className="text-xs text-muted-foreground/70 truncate mt-0.5">
                                                                {achievement.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-3 shrink-0">
                                                        {achievement.gamerscore > 0 && (
                                                            <span className="text-xs font-bold text-accent px-2 py-1 rounded-md bg-accent/10">
                                                                {achievement.gamerscore}G
                                                            </span>
                                                        )}
                                                        {achievement.unlockedDate && (
                                                            <span className="text-xs font-medium text-muted-foreground/50 hidden sm:inline bg-background px-2 py-1 rounded-md border border-border/30">
                                                                {formatUnlockDate(achievement.unlockedDate)}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {xboxDetailedAchievements.length > 15 && (
                                        <p className="text-xs text-muted-foreground/40 mt-3 italic">
                                            + {xboxDetailedAchievements.length - unlocked.length} more
                                        </p>
                                    )}
                                </>
                            )
                        })()}
                    </section>
                )}

                {/* Store link */}
                {isSteam && appid && (
                    <a
                        href={`https://store.steampowered.com/app/${appid}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors"
                    >
                        <FaSteam className="w-4 h-4" />
                        View on Steam
                        <FiArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                )}
            </div>
        </PageTransition>
    )
}
