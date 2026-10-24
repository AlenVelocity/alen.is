import { Metadata } from 'next'
import { PageTransition } from '@/components/ui/page-transition'
import { api } from '@/trpc/server'
import { FiGithub, FiCode, FiGitCommit, FiGitPullRequest } from 'react-icons/fi'
import { VscIssues } from 'react-icons/vsc'

import { constructMetadata } from '@/lib/metadata'

export const metadata: Metadata = constructMetadata({
    title: 'Coding',
    description: 'My GitHub stats and contributions',
    slug: 'coding',
    ogTitle: 'Alen is Coding',
    openGraph: { description: 'My GitHub stats and contributions' }
})

type ContributionDay = { date: string; contributionCount: number; color: string }

function ContributionGraph({ days }: { days: ContributionDay[] }) {
    // Pad the front so every column is a Sunday→Saturday week, like GitHub's own graph
    // (the API window rarely starts on a Sunday, which skewed every row off its weekday)
    const lead = days.length ? new Date(days[0].date).getUTCDay() : 0
    const cells: (ContributionDay | null)[] = [...Array<null>(lead).fill(null), ...days]
    const weekCount = Math.ceil(cells.length / 7)
    const mobileCells = cells.slice(Math.max(0, weekCount - 20) * 7)

    // Columns are fractions of the container rather than fixed 11px squares, so the
    // full year fits the page width instead of scrolling (and hiding the recent weeks)
    const renderGrid = (list: (ContributionDay | null)[], className: string) => (
        <div
            className={`${className} grid-flow-col gap-[2px] [grid-template-rows:repeat(7,auto)]`}
            style={{ gridTemplateColumns: `repeat(${Math.ceil(list.length / 7)}, minmax(0, 1fr))` }}
        >
            {list.map((day, i) =>
                day ? (
                    <div
                        key={day.date}
                        className="aspect-square rounded-[2px] transition-shadow hover:ring-2 hover:ring-foreground/20"
                        style={{ backgroundColor: day.color }}
                        title={`${day.date}: ${day.contributionCount} contributions`}
                    />
                ) : (
                    <div key={`pad-${i}`} aria-hidden="true" />
                )
            )}
        </div>
    )

    return (
        <>
            {renderGrid(cells, 'hidden sm:grid')}
            {renderGrid(mobileCells, 'grid sm:hidden')}
        </>
    )
}

function LanguageBar({ languages }: { languages: { name: string; color: string; percentage: number }[] }) {
    return (
        <div className="space-y-4">
            <div className="h-2 rounded-full overflow-hidden flex bg-muted">
                {languages.map((lang) => (
                    <div
                        key={lang.name}
                        className="h-full first:rounded-l-full last:rounded-r-full"
                        style={{
                            backgroundColor: lang.color || '#8b949e',
                            width: `${lang.percentage}%`
                        }}
                    />
                ))}
            </div>
            <div className="flex flex-wrap gap-3">
                {languages.slice(0, 6).map((lang) => (
                    <div key={lang.name} className="flex items-center gap-1.5 text-sm">
                        <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: lang.color || '#8b949e' }}
                        />
                        <span className="text-muted-foreground">{lang.name}</span>
                        <span className="text-muted-foreground/50 text-xs">{lang.percentage}%</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default async function Coding() {
    let githubData
    try {
        githubData = await api.github.getStats()
    } catch (error) {
        return (
            <PageTransition>
                <div className="container max-w-2xl py-12 md:py-20">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">Coding</h1>
                    <div className="text-center py-12">
                        <FiGithub className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">GitHub stats unavailable. Check back later!</p>
                    </div>
                </div>
            </PageTransition>
        )
    }

    return (
        <PageTransition>
            <div className="container max-w-2xl py-12 md:py-20">
                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Coding</h1>
                    <a
                        href={`https://github.com/${githubData.username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors text-sm"
                    >
                        <FiGithub className="w-4 h-4" />
                        <span>@{githubData.username}</span>
                    </a>
                </div>

                {/* Contribution Graph */}
                <section className="mb-10">
                    <div className="flex items-baseline justify-between mb-3">
                        <span className="text-3xl font-bold">{githubData.totalContributions.toLocaleString()}</span>
                        <span className="text-sm text-muted-foreground">contributions this year</span>
                    </div>
                    <ContributionGraph days={githubData.contributionDays} />
                </section>

                {/* Stats Row */}
                <section className="mb-10">
                    <div className="flex items-center justify-between py-4 border-y border-border">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <FiGitCommit className="w-4 h-4 text-muted-foreground" />
                                <span className="font-semibold">{githubData.commits.toLocaleString()}</span>
                                <span className="text-sm text-muted-foreground hidden sm:inline">commits</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FiGitPullRequest className="w-4 h-4 text-muted-foreground" />
                                <span className="font-semibold">{githubData.pullRequests.toLocaleString()}</span>
                                <span className="text-sm text-muted-foreground hidden sm:inline">PRs</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <VscIssues className="w-4 h-4 text-muted-foreground" />
                                <span className="font-semibold">{githubData.issues.toLocaleString()}</span>
                                <span className="text-sm text-muted-foreground hidden sm:inline">issues</span>
                            </div>
                        </div>
                        {githubData.currentStreak > 0 && (
                            <div className="text-sm text-muted-foreground">
                                🔥 {githubData.currentStreak} day streak
                            </div>
                        )}
                    </div>
                </section>

                {/* Languages */}
                <section>
                    <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider border-l-2 border-accent pl-3 mb-4">
                        Languages
                    </h2>
                    <LanguageBar languages={githubData.topLanguages} />
                </section>
            </div>
        </PageTransition>
    )
}
