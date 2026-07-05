import { LinkButton } from '@/components/ui/link-button'
import { PageTransition } from '@/components/ui/page-transition'
import { FiDownload, FiMapPin, FiWifi, FiHome, FiRepeat } from 'react-icons/fi'
import { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import { runGetExperiences } from '@/lib/cms-db'

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

export const metadata: Metadata = {
    title: 'Experience',
    description: "Alen's Work Experience",
    openGraph: {
        title: 'Alen is Working',
        description: "Alen's Work Experience",
        url: 'https://alen.is/working',
        images: [{ url: '/api/og?is=working', width: 1200, height: 630, alt: 'alen is working' }]
    },
    alternates: { canonical: '/experience' }
}

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
                <div className="flex items-start justify-between gap-4 mb-16">
                    <div>
                        <p className="mono-label text-muted-foreground/50 mb-4">// career</p>
                        <h1 className="text-display text-5xl md:text-6xl mb-3">Experience</h1>
                        <p className="text-[0.9rem] text-muted-foreground">My professional journey so far.</p>
                    </div>
                    <a
                        href="/Alen_Resume.pdf"
                        download
                        className="group flex items-center gap-2 px-3 py-2 text-xs font-mono-ui border border-border/60 hover:border-accent/40 hover:text-accent hover:bg-accent/5 transition-all duration-200 rounded-sm shrink-0 mt-2"
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
                        {experiences.map((experience, index) => {
                            const badge = getWorkTypeBadge(experience.workType)
                            const Icon = badge.icon
                            return (
                                <div key={experience.id} className="relative pl-8 group/exp">
                                    {/* Timeline dot */}
                                    <div
                                        className={`absolute left-0 top-1.5 w-2 h-2 -translate-x-[3.5px] border border-border bg-background transition-colors duration-300 group-hover/exp:border-accent/60 ${
                                            experience.current ? 'bg-accent border-accent ring-4 ring-accent/15' : ''
                                        }`}
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

                                        {/* Meta: period · location · work type */}
                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mono-label text-muted-foreground/60 mb-5">
                                            <span>{experience.period}</span>
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
                                                    <span>{item}</span>
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
