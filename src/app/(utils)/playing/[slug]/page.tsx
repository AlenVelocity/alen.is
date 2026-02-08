import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PageTransition } from '@/components/ui/page-transition'
import { api } from '@/trpc/server'
import { fetchAllGames, resolveSlug, slugify } from '@/lib/steam'
import { FiArrowLeft, FiArrowUpRight, FiCheck, FiLock } from 'react-icons/fi'
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

    // Fetch platform-specific data in parallel
    const [achievementsData, recentData, xboxAchievementsData] = await Promise.all([
        appid ? api.gaming.getGameAchievements({ appid }).catch(() => ({ steam: null })) : { steam: null },
        isSteam ? api.gaming.getRecentlyPlayed() : { steam: null },
        !isSteam ? api.gaming.getXboxGameAchievements({ titleId: game.id }).catch(() => ({ xbox: [] })) : { xbox: [] },
    ])

    const achievements = achievementsData.steam
    const recentGame = recentData.steam?.find((g) => g.appid === appid)
    const recentHours = recentGame?.playtime_2weeks_hours || 0

    // For Xbox games, use the achievement data from the game entry itself for stats
    const xboxAchievements = !isSteam && game.achievements ? game.achievements : null
    // Detailed Xbox achievement list
    const xboxDetailedAchievements = xboxAchievementsData.xbox || []

    const completionPct = achievements
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

                {/* Header image */}
                {game.image && (
                    <div
                        className="relative w-full aspect-[460/215] rounded-lg overflow-hidden mb-8"
                        style={{ rotate: '-0.5deg' }}
                    >
                        <Image src={game.image} alt={game.name} fill className="object-cover" priority />
                    </div>
                )}

                {/* Title + platform */}
                <div className="flex items-center gap-3 mb-6">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{game.name}</h1>
                    {isSteam ? (
                        <FaSteam className="w-5 h-5 text-muted-foreground/40 shrink-0" />
                    ) : (
                        <FaXbox className="w-5 h-5 text-muted-foreground/40 shrink-0" />
                    )}
                </div>

                {/* My Stats */}
                <section className="mb-10">
                    <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider border-l-2 border-accent pl-3 mb-4">
                        My Stats
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-6">
                        {isSteam && (
                            <div>
                                <p className="text-2xl font-bold">
                                    {formatPlaytime(game.playtime_forever_hours)}
                                </p>
                                <p className="text-xs text-muted-foreground/60">total playtime</p>
                            </div>
                        )}
                        {recentHours > 0 && (
                            <div>
                                <p className="text-2xl font-bold text-accent">{formatPlaytime(recentHours)}</p>
                                <p className="text-xs text-muted-foreground/60">this week</p>
                            </div>
                        )}
                        {completionPct !== null && (
                            <div>
                                <p className="text-2xl font-bold">{completionPct}%</p>
                                <p className="text-xs text-muted-foreground/60">achievements</p>
                            </div>
                        )}
                        {xboxAchievements && (
                            <div>
                                <p className="text-2xl font-bold">
                                    {xboxAchievements.current}
                                    <span className="text-muted-foreground/40 text-lg">
                                        /{xboxAchievements.total}
                                    </span>
                                </p>
                                <p className="text-xs text-muted-foreground/60">achievements</p>
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
                        <div className="h-1.5 rounded-full bg-muted border border-dashed border-border overflow-hidden mb-5">
                            <div
                                className="h-full bg-accent rounded-full transition-all"
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
                                                    className="flex items-center gap-3 py-2 border-b border-dashed border-border/50 last:border-b-0"
                                                >
                                                    {achievement.icon ? (
                                                        <Image
                                                            src={achievement.icon}
                                                            alt=""
                                                            width={24}
                                                            height={24}
                                                            className="rounded shrink-0"
                                                        />
                                                    ) : (
                                                        <FiCheck className="w-4 h-4 text-accent shrink-0" />
                                                    )}
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium truncate">
                                                            {achievement.name}
                                                        </p>
                                                        {achievement.description && (
                                                            <p className="text-xs text-muted-foreground/50 truncate">
                                                                {achievement.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                    {achievement.unlockDate && (
                                                        <span className="text-xs text-muted-foreground/40 shrink-0 hidden sm:inline">
                                                            {formatUnlockDate(achievement.unlockDate)}
                                                        </span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {locked.length > 0 && (
                                        <div>
                                            <p className="text-xs text-muted-foreground/50 uppercase tracking-wider mb-2">
                                                Up Next
                                            </p>
                                            {locked.map((achievement) => (
                                                <div
                                                    key={achievement.apiname}
                                                    className="flex items-center gap-3 py-2 border-b border-dashed border-border/30 last:border-b-0 opacity-60"
                                                >
                                                    {achievement.icon ? (
                                                        <Image
                                                            src={achievement.icon}
                                                            alt=""
                                                            width={24}
                                                            height={24}
                                                            className="rounded shrink-0 grayscale"
                                                        />
                                                    ) : (
                                                        <FiLock className="w-4 h-4 text-muted-foreground/30 shrink-0" />
                                                    )}
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-muted-foreground/60 truncate">
                                                            {achievement.name}
                                                        </p>
                                                        {achievement.description && (
                                                            <p className="text-xs text-muted-foreground/30 truncate">
                                                                {achievement.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {achievements.totalAchievements > 15 && (
                                        <p className="text-xs text-muted-foreground/40 mt-3 italic">
                                            + {achievements.totalAchievements - unlocked.length - locked.length} more
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
                        <div className="h-1.5 rounded-full bg-muted border border-dashed border-border overflow-hidden mb-5">
                            <div
                                className="h-full bg-accent rounded-full transition-all"
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
                                                    className="flex items-center gap-3 py-2 border-b border-dashed border-border/50 last:border-b-0"
                                                >
                                                    {achievement.icon ? (
                                                        <Image
                                                            src={achievement.icon}
                                                            alt=""
                                                            width={24}
                                                            height={24}
                                                            className="rounded shrink-0"
                                                        />
                                                    ) : (
                                                        <FiCheck className="w-4 h-4 text-accent shrink-0" />
                                                    )}
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium truncate">
                                                            {achievement.name}
                                                        </p>
                                                        {achievement.description && (
                                                            <p className="text-xs text-muted-foreground/50 truncate">
                                                                {achievement.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2 shrink-0">
                                                        {achievement.gamerscore > 0 && (
                                                            <span className="text-xs text-muted-foreground/50">
                                                                {achievement.gamerscore}G
                                                            </span>
                                                        )}
                                                        {achievement.unlockedDate && (
                                                            <span className="text-xs text-muted-foreground/40 hidden sm:inline">
                                                                {formatUnlockDate(achievement.unlockedDate)}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {locked.length > 0 && (
                                        <div>
                                            <p className="text-xs text-muted-foreground/50 uppercase tracking-wider mb-2">
                                                Up Next
                                            </p>
                                            {locked.map((achievement) => (
                                                <div
                                                    key={achievement.id}
                                                    className="flex items-center gap-3 py-2 border-b border-dashed border-border/30 last:border-b-0 opacity-60"
                                                >
                                                    {achievement.icon ? (
                                                        <Image
                                                            src={achievement.icon}
                                                            alt=""
                                                            width={24}
                                                            height={24}
                                                            className="rounded shrink-0 grayscale"
                                                        />
                                                    ) : (
                                                        <FiLock className="w-4 h-4 text-muted-foreground/30 shrink-0" />
                                                    )}
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-muted-foreground/60 truncate">
                                                            {achievement.name}
                                                        </p>
                                                        {achievement.description && (
                                                            <p className="text-xs text-muted-foreground/30 truncate">
                                                                {achievement.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                    {achievement.gamerscore > 0 && (
                                                        <span className="text-xs text-muted-foreground/30 shrink-0">
                                                            {achievement.gamerscore}G
                                                        </span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {xboxDetailedAchievements.length > 15 && (
                                        <p className="text-xs text-muted-foreground/40 mt-3 italic">
                                            + {xboxDetailedAchievements.length - unlocked.length - locked.length} more
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
