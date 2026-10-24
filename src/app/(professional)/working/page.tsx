import { LinkButton } from '@/components/ui/link-button'
import { PageTransition } from '@/components/ui/page-transition'
import { constructMetadata } from '@/lib/metadata'
import { FiDownload } from 'react-icons/fi'
import { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import { runGetExperiences } from '@/lib/cms-db'
import { PageHeader } from '@/components/ui/page-header'

// ─── Period parsing ──────────────────────────────────────────────────────────
// Periods are free text in the CMS ("July 2025 - January 2026", "Dec 2021 - Sep 2022",
// "2026 - Present"). Month names, full or abbreviated, resolve to the first of the
// month; "Present" resolves to today; a bare year is a start we can't measure from.

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function parsePeriodDate(raw: string | undefined): { date: Date; exact: boolean } | null {
    const text = (raw ?? '').trim().toLowerCase()
    if (!text) return null
    if (text === 'present' || text === 'now') return { date: new Date(), exact: true }
    const monthYear = text.match(/^([a-z]+)\.?\s+(\d{4})$/)
    if (monthYear) {
        const month = MONTHS.indexOf(monthYear[1].slice(0, 3))
        if (month >= 0) return { date: new Date(Number(monthYear[2]), month, 1), exact: true }
    }
    const yearOnly = text.match(/^(\d{4})$/)
    if (yearOnly) return { date: new Date(Number(yearOnly[1]), 0, 1), exact: false }
    return null
}

/** "Jul 2025" from "July 2025", "now" from "Present", a bare year as is */
function shortDate(raw: string | undefined): string {
    const text = (raw ?? '').trim()
    if (!text) return ''
    if (/^(present|now)$/i.test(text)) return 'now'
    const parsed = parsePeriodDate(text)
    if (!parsed) return text
    if (!parsed.exact) return String(parsed.date.getFullYear())
    return `${MONTH_LABELS[parsed.date.getMonth()]} ${parsed.date.getFullYear()}`
}

/** The rail reads "Jul 2025 – Jan 2026" or "2026 – now" */
function shortPeriod(period: string): string {
    const [startRaw, endRaw] = period.split(' - ')
    return `${shortDate(startRaw)} – ${shortDate(endRaw ?? 'present')}`
}

/** "7 mo", "1 yr 2 mo", "5 yrs". Counts the start and end months inclusively, the way a CV does. */
function formatDuration(period: string): string | null {
    const [startRaw, endRaw] = period.split(' - ')
    const start = parsePeriodDate(startRaw)
    const end = parsePeriodDate(endRaw ?? 'present')
    if (!start?.exact || !end) return null
    const months =
        (end.date.getFullYear() - start.date.getFullYear()) * 12 + (end.date.getMonth() - start.date.getMonth()) + 1
    if (months < 1) return null
    const years = Math.floor(months / 12)
    const rest = months % 12
    if (years === 0) return `${months} mo`
    const yearPart = `${years} ${years === 1 ? 'yr' : 'yrs'}`
    return rest > 0 ? `${yearPart} ${rest} mo` : yearPart
}

export const metadata: Metadata = constructMetadata({
    title: 'working',
    description: "Alen's work history as a software engineer, newest first.",
    slug: 'working',
    ogTitle: 'Alen is Working',
    noCanonical: true, // It has /experience canonical
    openGraph: { description: "Alen's work history as a software engineer, newest first." }
})

metadata.alternates = { canonical: '/experience' }

export default async function Experience() {
    const experiences = await runGetExperiences()

    const experienceSchema = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: experiences.map((experience, index) => ({
            '@type': 'WorkExperience',
            position: index + 1,
            name: experience.position,
            description: experience.description.join('. '),
            worksFor: { '@type': 'Organization', name: experience.company },
            startDate: experience.period.split(' - ')[0],
            endDate: experience.period.split(' - ')[1] || 'Present',
            jobLocation: { '@type': 'Place', address: experience.location }
        }))
    }

    return (
        <PageTransition>
            <JsonLd data={experienceSchema} />
            <div className="container max-w-3xl py-10 md:py-14 px-4">
                {/* ── Header ─────────────────────────────────────── */}
                <PageHeader
                    eyebrow="career"
                    title="Experience"
                    aside={
                        <a
                            href="/Alen_Resume.pdf"
                            download
                            className="inline-flex items-center gap-2 px-3 py-2 text-xs font-mono-ui border border-border/60 hover:text-accent transition-colors duration-200 rounded-sm shrink-0"
                        >
                            <FiDownload className="w-3 h-3" />
                            <span>resume</span>
                        </a>
                    }
                >
                    <p className="text-[0.9rem] text-muted-foreground">Where I&apos;ve worked, newest first.</p>
                </PageHeader>

                {/* ── Ledger: when on the left, what on the right ─── */}
                <div className="border-t border-dashed border-border/40">
                    {experiences.map((experience) => {
                        const duration = formatDuration(experience.period)
                        return (
                            <article
                                key={experience.id}
                                className="grid gap-x-8 gap-y-2 md:grid-cols-[10rem_1fr] py-6 border-b border-dashed border-border/40"
                            >
                                {/* When */}
                                <div className="mono-label tabular-nums md:pt-1.5">
                                    <p
                                        className={
                                            experience.current
                                                ? 'text-accent flex items-center gap-2'
                                                : 'text-muted-foreground/70'
                                        }
                                    >
                                        {experience.current && (
                                            <span
                                                className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-glow shrink-0"
                                                aria-hidden="true"
                                            />
                                        )}
                                        {shortPeriod(experience.period)}
                                    </p>
                                    {duration && <p className="text-muted-foreground/40 mt-0.5">{duration}</p>}
                                </div>

                                {/* What */}
                                <div className="min-w-0">
                                    <div className="flex items-baseline gap-x-3 gap-y-1 flex-wrap">
                                        <h2 className="text-display text-xl">
                                            {experience.link ? (
                                                <LinkButton href={experience.link} target="_blank" className="text-xl">
                                                    {experience.company}
                                                </LinkButton>
                                            ) : (
                                                experience.company
                                            )}
                                        </h2>
                                        <span className="text-sm text-muted-foreground">{experience.position}</span>
                                    </div>
                                    <p className="mono-label text-muted-foreground/50 mt-1">
                                        {experience.location.toLowerCase() === experience.workType
                                            ? experience.workType
                                            : `${experience.location} · ${experience.workType}`}
                                    </p>
                                    <ul className="mt-3 space-y-1.5">
                                        {experience.description.map((item, i) => (
                                            <li
                                                key={i}
                                                className="text-[0.875rem] text-muted-foreground leading-relaxed break-words"
                                            >
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </article>
                        )
                    })}
                </div>
            </div>
        </PageTransition>
    )
}
