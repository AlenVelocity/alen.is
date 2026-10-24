import { LinkButton } from '@/components/ui/link-button'
import { PageTransition } from '@/components/ui/page-transition'
import { DecodeText } from '@/components/ui/decode-text'
import { constructMetadata } from '@/lib/metadata'
import { FiDownload, FiMapPin, FiWifi, FiHome, FiRepeat } from 'react-icons/fi'
import { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import { runGetExperiences } from '@/lib/cms-db'
import { cn } from '@/lib/utils'

const getWorkTypeBadge = (workType: string) => {
    switch (workType) {
        case 'remote':
            return { label: 'remote', icon: FiWifi, className: 'text-accent' }
        case 'onsite':
            return { label: 'onsite', icon: FiHome, className: 'text-blue-400' }
        case 'hybrid':
            return { label: 'hybrid', icon: FiRepeat, className: 'text-amber-400' }
        default:
            return { label: 'remote', icon: FiWifi, className: 'text-accent' }
    }
}

// ─── Period parsing ──────────────────────────────────────────────────────────
// Periods are free text in the CMS ("July 2025 - January 2026", "Dec 2021 - Sep 2022",
// "2026 - Present"). Month names, full or abbreviated, resolve to the first of the
// month; "Present" resolves to today; a bare year is a start we can't measure from.

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']

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
            <div className="container max-w-2xl py-12 md:py-20 px-4">
                {/* ── Header ─────────────────────────────────────── */}
                {/* Wraps below ~400px: "Experience" at display size plus the button don't fit one row */}
                <div className="flex flex-wrap items-start justify-between gap-4 mb-16">
                    <div className="min-w-0">
                        <p className="mono-label text-muted-foreground/50 mb-4">// career</p>
                        <h1 className="text-display text-5xl md:text-6xl mb-3">
                            <DecodeText text="Experience" onMount />
                        </h1>
                        <p className="text-[0.9rem] text-muted-foreground">Where I&apos;ve worked, newest first.</p>
                    </div>
                    <a
                        href="/Alen_Resume.pdf"
                        download
                        className="group flex items-center gap-2 px-3 py-2 text-xs font-mono-ui border border-border/60 hover:border-accent/40 hover:text-accent hover:bg-accent/5 transition-colors duration-200 rounded-sm shrink-0 mt-2"
                    >
                        <FiDownload className="w-3 h-3" />
                        <span>resume</span>
                    </a>
                </div>

                {/* ── Timeline ───────────────────────────────────── */}
                <div className="relative">
                    {/* Vertical dashed line */}
                    <div className="absolute left-0 top-0 bottom-0 w-px border-l border-dashed border-border/60" />

                    <div className="space-y-14">
                        {experiences.map((experience) => {
                            const badge = getWorkTypeBadge(experience.workType)
                            const Icon = badge.icon
                            const duration = formatDuration(experience.period)
                            return (
                                <div key={experience.id} className="relative pl-8 group/exp">
                                    {/* Timeline dot. The live one pulses like a beacon */}
                                    <div
                                        className={cn(
                                            'absolute left-0 top-1.5 w-2 h-2 -translate-x-[3.5px] border transition-colors duration-300',
                                            experience.current
                                                ? 'bg-accent border-accent ring-4 ring-accent/15 animate-pulse-glow'
                                                : 'bg-background border-border group-hover/exp:border-accent/60'
                                        )}
                                    />

                                    {/* Entry */}
                                    <div>
                                        {/* Company + current badge */}
                                        <div className="flex items-baseline gap-3 mb-0.5 flex-wrap">
                                            <h2 className="text-display text-xl">
                                                {experience.link ? (
                                                    <LinkButton
                                                        href={experience.link}
                                                        target="_blank"
                                                        className="text-xl"
                                                    >
                                                        {experience.company}
                                                    </LinkButton>
                                                ) : (
                                                    experience.company
                                                )}
                                            </h2>
                                            {experience.current && (
                                                <span className="mono-label text-accent border border-accent/30 px-1.5 py-0.5 rounded-sm bg-accent/8">
                                                    now
                                                </span>
                                            )}
                                        </div>

                                        {/* Position */}
                                        <p className="text-sm text-foreground/80 mb-3">{experience.position}</p>

                                        {/* Meta: period · duration · location · work type */}
                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mono-label text-muted-foreground/60 mb-5 tabular-nums">
                                            <span>{experience.period}</span>
                                            {duration && (
                                                <>
                                                    <span className="text-border">·</span>
                                                    <span className="text-muted-foreground/40">{duration}</span>
                                                </>
                                            )}
                                            <span className="text-border">·</span>
                                            <span className="flex items-center gap-1">
                                                <FiMapPin className="w-2.5 h-2.5" />
                                                {experience.location}
                                            </span>
                                            <span className="text-border">·</span>
                                            <span className={`flex items-center gap-1 ${badge.className}`}>
                                                <Icon className="w-2.5 h-2.5" />
                                                {badge.label}
                                            </span>
                                        </div>

                                        {/* Description bullets */}
                                        <ul className="space-y-2">
                                            {experience.description.map((item, i) => (
                                                <li
                                                    key={i}
                                                    className="flex items-start gap-3 text-[0.875rem] text-muted-foreground leading-relaxed"
                                                >
                                                    <span className="text-accent/50 mt-[0.2em] shrink-0 font-mono-ui">
                                                        —
                                                    </span>
                                                    <span className="min-w-0 break-words">{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </PageTransition>
    )
}
