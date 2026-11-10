import Image from 'next/image'
import { FiCheck } from 'react-icons/fi'
import { Persona } from '@/components/persona'

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
    /** The completion readout in each person's words, and its colour */
    status: { alen: string; ban: string; tone: string } | null
    /** The most recent unlocks, newest first. Not the whole list. */
    items: AchievementItem[]
}

function formatUnlockDate(isoDate: string): string {
    const date = new Date(isoDate)
    if (Number.isNaN(date.getTime())) return ''
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

/** Completion bar plus the most recent unlocks. One block for both Steam and Xbox. */
export function AchievementList({ unlocked, total, pct, status, items }: AchievementListProps) {
    // The rows are only the latest few, so the line under them says so. What is
    // still locked is already in the count beside the label.
    const partial = items.length > 0 && items.length < unlocked

    return (
        <section className="mb-12">
            <div className="flex items-baseline justify-between gap-4 mb-3">
                <div className="section-label">achievements</div>
                <span className="mono-label text-muted-foreground/50 tabular-nums">
                    {unlocked}/{total}
                </span>
            </div>

            <div className="h-1.5 bg-muted/60 rounded-full ban:rounded-none overflow-hidden mb-2" aria-hidden="true">
                <div className="h-full bg-accent rounded-full ban:rounded-none" style={{ width: `${pct}%` }} />
            </div>
            {status && (
                <p className="mono-label text-muted-foreground/50 mb-6">
                    <Persona alen="status: " ban="verdict: " />
                    <span className={status.tone}>
                        <Persona alen={status.alen} ban={status.ban} />
                    </span>
                </p>
            )}

            {items.length > 0 && (
                <div>
                    {items.map((achievement) => (
                        <div
                            key={achievement.id}
                            className="flex items-center gap-3 py-2.5 border-b border-dashed border-border/40 last:border-b-0"
                        >
                            {/* The name is right beside it, so the icon says nothing of its own */}
                            {achievement.icon ? (
                                <div className="relative w-9 h-9 rounded ban:rounded-none overflow-hidden flex-shrink-0 ring-1 ring-border/50">
                                    <Image
                                        src={achievement.icon}
                                        alt=""
                                        fill
                                        sizes="36px"
                                        unoptimized
                                        className="object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="w-9 h-9 rounded ban:rounded-none bg-muted/30 border border-border/50 flex items-center justify-center shrink-0">
                                    <FiCheck className="w-4 h-4 text-muted-foreground/50" />
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
                            <div className="flex items-baseline gap-3 shrink-0 mono-label tabular-nums">
                                {achievement.score !== undefined && achievement.score > 0 && (
                                    <span className="text-muted-foreground/60">{achievement.score} G</span>
                                )}
                                {achievement.date && (
                                    <span className="text-muted-foreground/50 hidden sm:inline">
                                        {formatUnlockDate(achievement.date)}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {partial && (
                <p className="mono-label text-muted-foreground/50 mt-3 tabular-nums">
                    the {items.length} most recent, of {unlocked}
                </p>
            )}
        </section>
    )
}
