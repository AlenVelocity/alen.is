import { Metadata } from 'next'
import { PageTransition } from '@/components/ui/page-transition'
import { api } from '@/trpc/server'

import { constructMetadata } from '@/lib/metadata'
import { EmptyState } from '@/components/ui/empty-state'
import { PageHeader } from '@/components/ui/page-header'
import { Persona } from '@/components/persona'

export const metadata: Metadata = constructMetadata({
    title: 'Coding',
    description: 'My last year on GitHub: the contribution graph, commit counts and languages.',
    slug: 'coding',
    ogTitle: 'Alen is Coding'
})

/** The profile the page is about. Kept here too so the link still works when the API does not. */
const GITHUB_USERNAME = 'AlenVelocity'

type ContributionDay = { date: string; contributionCount: number; color: string }

/** Accent strength per level. Level 0 (nothing that day) is the muted surface instead. */
const LEVEL_ALPHA = [0, 0.3, 0.5, 0.75, 1]

const dayFormat = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
const count = (n: number) => n.toLocaleString('en-US')
const plural = (n: number, word: string) => `${count(n)} ${word}${n === 1 ? '' : 's'}`

/**
 * GitHub sends a colour with every day, out of its own light-theme greens.
 * Only the order of those colours is kept: sorted by the smallest count they
 * appear on, a colour's place in the list is that day's level (0 to 4). The
 * cells are then drawn in the site's accent, so the graph follows the palette
 * (and whoever is in) instead of staying GitHub green on every theme.
 */
function contributionLevels(days: ContributionDay[]): Map<string, number> {
    const lowest = new Map<string, number>()
    for (const day of days) {
        lowest.set(day.color, Math.min(lowest.get(day.color) ?? Infinity, day.contributionCount))
    }
    const ordered = [...lowest.entries()].sort((a, b) => a[1] - b[1])
    // A year with something on every single day has no "nothing" colour to take level 0
    const first = ordered.length > 0 && ordered[0][1] > 0 ? 1 : 0
    return new Map(ordered.map(([color], i) => [color, Math.min(i + first, 4)]))
}

function ContributionGraph({ days, total }: { days: ContributionDay[]; total: number }) {
    // Pad the front so every column is a Sunday→Saturday week, like GitHub's own graph
    // (the API window rarely starts on a Sunday, which skewed every row off its weekday)
    const lead = days.length ? new Date(days[0].date).getUTCDay() : 0
    const cells: (ContributionDay | null)[] = [...Array<null>(lead).fill(null), ...days]
    const weekCount = Math.ceil(cells.length / 7)
    const mobileCells = cells.slice(Math.max(0, weekCount - 20) * 7)
    const levels = contributionLevels(days)

    // Columns are fractions of the container rather than fixed 11px squares, so the
    // full year fits the page width instead of scrolling (and hiding the recent weeks)
    const renderGrid = (list: (ContributionDay | null)[], className: string) => (
        <div
            className={`${className} grid-flow-col gap-[2px] [grid-template-rows:repeat(7,auto)]`}
            style={{ gridTemplateColumns: `repeat(${Math.ceil(list.length / 7)}, minmax(0, 1fr))` }}
        >
            {list.map((day, i) => {
                if (!day) return <div key={`pad-${i}`} />
                const level = day.contributionCount === 0 ? 0 : Math.max(1, levels.get(day.color) ?? 1)
                const on = dayFormat.format(new Date(day.date))
                return (
                    <div
                        key={day.date}
                        className={`aspect-square rounded-sm ${level === 0 ? 'bg-muted' : ''}`}
                        style={
                            level > 0 ? { backgroundColor: `hsl(var(--accent) / ${LEVEL_ALPHA[level]})` } : undefined
                        }
                        title={
                            day.contributionCount === 0
                                ? `nothing on ${on}`
                                : `${plural(day.contributionCount, 'contribution')} on ${on}`
                        }
                    />
                )
            })}
        </div>
    )

    return (
        <div role="img" aria-label={`${plural(total, 'contribution')} in the last year, one square per day`}>
            {renderGrid(cells, 'hidden sm:grid')}
            {renderGrid(mobileCells, 'grid sm:hidden')}
        </div>
    )
}

function LanguageBar({ languages }: { languages: { name: string; color: string; percentage: number }[] }) {
    // The colours are GitHub's own, one per language, so they stay as data
    const colorOf = (lang: { color: string }) => lang.color || 'hsl(var(--muted-foreground))'

    return (
        <div className="space-y-4">
            <div className="h-2 rounded-full ban:rounded-none overflow-hidden flex bg-muted" aria-hidden="true">
                {languages.map((lang) => (
                    <div
                        key={lang.name}
                        className="h-full"
                        style={{ backgroundColor: colorOf(lang), width: `${lang.percentage}%` }}
                    />
                ))}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                {languages.slice(0, 6).map((lang) => (
                    <div key={lang.name} className="flex items-center gap-1.5 font-mono-ui text-xs">
                        <span
                            className="w-2 h-2 rounded-full ban:rounded-none"
                            style={{ backgroundColor: colorOf(lang) }}
                        />
                        <span className="text-muted-foreground">{lang.name}</span>
                        <span className="text-muted-foreground/50 tabular-nums">{lang.percentage}%</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

/** The shared header plus the profile link, which is there whether or not the numbers are */
function Header({ username, children }: { username: string; children?: React.ReactNode }) {
    return (
        <PageHeader eyebrow="commit history" title="Coding" banTitle="Evidence">
            {children}
            <a
                href={`https://github.com/${username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-mono-ui text-xs text-muted-foreground hover:text-accent transition-colors duration-150"
            >
                github.com/{username}
                <span className="text-muted-foreground/40" aria-hidden="true">
                    ↗
                </span>
            </a>
        </PageHeader>
    )
}

export default async function Coding() {
    let githubData
    try {
        githubData = await api.github.getStats()
    } catch {
        // One sentence for what happened, and the profile link above it as the way out
        return (
            <PageTransition>
                <div className="container max-w-3xl py-10 md:py-14 px-4">
                    <Header username={GITHUB_USERNAME} />
                    <EmptyState>
                        <Persona
                            alen="github isn't answering right now"
                            ban="GitHub is not answering. No evidence, no case."
                        />
                    </EmptyState>
                </div>
            </PageTransition>
        )
    }

    const counts = [
        plural(githubData.commits, 'commit'),
        plural(githubData.pullRequests, 'pull request'),
        plural(githubData.issues, 'issue')
    ].join(', ')
    // One day is not a streak
    const streak = githubData.currentStreak >= 2 ? githubData.currentStreak : 0

    return (
        <PageTransition>
            <div className="container max-w-3xl py-10 md:py-14 px-4">
                <Header username={githubData.username}>
                    <p className="text-[0.9rem] text-muted-foreground mb-4 tabular-nums">
                        {plural(githubData.totalContributions, 'contribution')} in the last year. {counts}.{' '}
                        <Persona
                            alen={streak > 0 ? `${streak} days in a row at the moment.` : null}
                            ban={`${streak > 0 ? `${streak} days in a row. ` : ''}All premeditated.`}
                        />
                    </p>
                </Header>

                {/* Contribution graph: the one visual on the page */}
                <section className="mb-12">
                    <div className="flex items-baseline justify-between gap-4 mb-4">
                        <div className="section-label">
                            <Persona alen="contributions" ban="every day I did it" />
                        </div>
                        {/* A phone has room for twenty weeks, not fifty-three */}
                        <span className="mono-label text-muted-foreground/50 shrink-0">
                            <span className="sm:hidden">last 20 weeks</span>
                            <span className="hidden sm:inline">last 12 months</span>
                        </span>
                    </div>
                    <ContributionGraph days={githubData.contributionDays} total={githubData.totalContributions} />
                </section>

                {/* Languages */}
                <section>
                    <div className="flex items-baseline justify-between gap-4 mb-4">
                        <div className="section-label">
                            <Persona alen="languages" ban="methods" />
                        </div>
                        <span className="mono-label text-muted-foreground/50 shrink-0">public repos, by size</span>
                    </div>
                    <LanguageBar languages={githubData.topLanguages} />
                </section>
            </div>
        </PageTransition>
    )
}
