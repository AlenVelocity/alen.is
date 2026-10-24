import Image from 'next/image'
import { FiCheck } from 'react-icons/fi'

export interface AchievementItem {
    id: string
    name: string
    description?: string
    icon?: string
    /** ISO date of the unlock, when the platform reports one */
    date?: string
    /** Xbox gamerscore for this achievement */
    score?: number
}

interface AchievementListProps {
    unlocked: number
    total: number
    pct: number
    status: { label: string; tone: string } | null
    items: AchievementItem[]
}

function formatUnlockDate(isoDate: string): string {
    const date = new Date(isoDate)
    if (Number.isNaN(date.getTime())) return ''
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

/** Completion bar plus the most recent unlocks. One block for both Steam and Xbox. */
export function AchievementList({ unlocked, total, pct, status, items }: AchievementListProps) {
    return (
        <section className="mb-12">
            <div className="flex items-center justify-between mb-3">
                <div className="section-label">achievements</div>
                <span className="mono-label text-muted-foreground/40 tabular-nums">
                    {unlocked}/{total}
                </span>
            </div>

            <div className="h-1.5 bg-muted/60 rounded-full overflow-hidden mb-2">
                <div
                    className="h-full bg-accent rounded-full animate-bar-grow"
                    style={{ width: `${pct}%`, animationDelay: '0.4s' }}
                />
            </div>
            {status && (
                <p className="mono-label text-muted-foreground/40 mb-6">
                    status: <span className={status.tone}>{status.label}</span>
                </p>
            )}

            {items.length > 0 && (
                <div>
                    {items.map((achievement, i) => (
                        <div
                            key={achievement.id}
                            className="flex items-center gap-3 py-2.5 border-b border-dashed border-border/40 last:border-b-0"
                        >
                            <span className="mono-label text-muted-foreground/30 w-5 text-right shrink-0 tabular-nums">
                                {i + 1}
                            </span>
                            {achievement.icon ? (
                                <div className="relative w-9 h-9 rounded overflow-hidden flex-shrink-0 ring-1 ring-border/50">
                                    <Image
                                        src={achievement.icon}
                                        alt={achievement.name}
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
                                <p className="text-sm font-medium truncate">{achievement.name}</p>
                                {achievement.description && (
                                    <p className="text-xs text-muted-foreground/60 truncate">
                                        {achievement.description}
                                    </p>
                                )}
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                {achievement.score !== undefined && achievement.score > 0 && (
                                    <span className="mono-label border border-accent/25 text-accent/70 px-1.5 py-0.5 rounded-sm">
                                        {achievement.score}g
                                    </span>
                                )}
                                {achievement.date && (
                                    <span className="mono-label text-muted-foreground/40 hidden sm:inline">
                                        {formatUnlockDate(achievement.date)}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {total > unlocked && (
                <p className="mono-label text-muted-foreground/30 mt-3">+ {total - unlocked} more locked</p>
            )}
        </section>
    )
}
