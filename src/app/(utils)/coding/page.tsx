import { Metadata } from 'next'
import { PageTransition } from '@/components/ui/page-transition'
import { DecodeText } from '@/components/ui/decode-text'
import { api } from '@/trpc/server'

import { constructMetadata } from '@/lib/metadata'
import { EmptyState } from '@/components/ui/empty-state'

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
                        className="aspect-square rounded-[2px]"
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
            <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                {languages.slice(0, 6).map((lang) => (
                    <div key={lang.name} className="flex items-center gap-1.5 font-mono-ui text-xs">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: lang.color || '#8b949e' }} />
                        <span className="text-muted-foreground">{lang.name}</span>
                        <span className="text-muted-foreground/50 tabular-nums">{lang.percentage}%</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

function Header({ children }: { children?: React.ReactNode }) {
    return (
        <div className="mb-12">
            <p className="mono-label text-muted-foreground/50 mb-4">// commit history</p>
            <h1 className="text-display text-5xl md:text-6xl mb-3">
                <DecodeText text="Coding" onMount />
            </h1>
            {children}
        </div>
    )
}

export default async function Coding() {
    let githubData
    try {
        githubData = await api.github.getStats()
    } catch {
        return (
            <PageTransition>
                <div className="container max-w-2xl py-12 md:py-20 px-4">
                    <Header>
                        <EmptyState>github isn&apos;t answering right now</EmptyState>
                    </Header>
                </div>
            </PageTransition>
        )
    }

    const year = new Date().getFullYear()
    const counts = [
        `${githubData.commits.toLocaleString()} commits`,
        `${githubData.pullRequests.toLocaleString()} pull requests`,
        `${githubData.issues.toLocaleString()} issues`
    ].join(', ')

    return (
        <PageTransition>
            <div className="container max-w-2xl py-12 md:py-20 px-4">
                <Header>
                    <p className="text-[0.9rem] text-muted-foreground mb-4">
                        {githubData.totalContributions.toLocaleString()} contributions in {year}. {counts}.
                        {githubData.currentStreak > 0 && ` ${githubData.currentStreak} days in a row at the moment.`}
                    </p>
                    <a
                        href={`https://github.com/${githubData.username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 font-mono-ui text-xs text-muted-foreground hover:text-accent transition-colors"
                    >
                        github.com/{githubData.username}
                        <span className="text-muted-foreground/40" aria-hidden="true">
                            ↗
                        </span>
                    </a>
                </Header>

                {/* Contribution graph: the one visual on the page */}
                <section className="mb-12">
                    <div className="section-label mb-4">the last year</div>
                    <ContributionGraph days={githubData.contributionDays} />
                </section>

                {/* Languages */}
                <section>
                    <div className="section-label mb-4">languages</div>
                    <LanguageBar languages={githubData.topLanguages} />
                </section>
            </div>
        </PageTransition>
    )
}
