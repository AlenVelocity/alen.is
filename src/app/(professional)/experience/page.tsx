import { LinkButton } from '@/components/ui/link-button'
import { PageTransition } from '@/components/ui/page-transition'
import { FiDownload, FiMapPin } from 'react-icons/fi'
import { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import { runGetExperiences } from '@/lib/cms-db'

export const metadata: Metadata = {
    title: 'Experience',
    description: 'My professional experience',
    openGraph: {
        title: 'Experience',
        description: 'My professional experience',
        url: 'https://alen.is/experience'
    },
    alternates: {
        canonical: '/experience'
    }
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
            worksFor: {
                '@type': 'Organization',
                name: experience.company
            },
            startDate: experience.period.split(' - ')[0],
            endDate: experience.period.split(' - ')[1] || 'Present',
            jobLocation: {
                '@type': 'Place',
                address: experience.location
            }
        }))
    }

    return (
        <PageTransition>
            <JsonLd data={experienceSchema} />
            <div className="container max-w-2xl py-12 md:py-20">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-12">
                        <div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                                Experience
                            </h1>
                        <p className="text-lg text-muted-foreground">
                            My professional journey so far.
                        </p>
                        </div>
                    <a
                            href="/Alen-Resume.pdf" 
                            target="_blank"
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full border border-border hover:bg-muted hover:border-foreground/20 transition-all duration-200"
                        >
                        <FiDownload className="w-4 h-4" />
                        <span className="hidden sm:inline">Resume</span>
                    </a>
                </div>

                {/* Timeline */}
                <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-0 top-2 bottom-2 w-px bg-border" />
                    
                    <div className="space-y-12">
                    {experiences.map((experience, index) => (
                            <div key={experience.id} className="relative pl-8">
                                {/* Timeline dot */}
                                <div className={`absolute left-0 top-2 w-2 h-2 rounded-full -translate-x-[3px] ${
                                    experience.current 
                                        ? 'bg-accent ring-4 ring-accent/20' 
                                        : 'bg-muted-foreground/50'
                                }`} />
                                
                                {/* Card */}
                                <div className="group">
                                    <div className="flex items-start justify-between gap-4 mb-2">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h2 className="text-lg font-semibold">
                                                    {experience.link ? (
                                                        <LinkButton href={experience.link} target="_blank" className="text-lg">
                                                            {experience.company}
                                                        </LinkButton>
                                                    ) : (
                                                        experience.company
                                                    )}
                                                </h2>
                                                {experience.current && (
                                                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-accent/10 text-accent">
                                                        Current
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-muted-foreground font-medium">
                                                    {experience.position}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                                        <span>{experience.period}</span>
                                        <span className="flex items-center gap-1">
                                            <FiMapPin className="w-3 h-3" />
                                            {experience.location}
                                        </span>
                                    </div>
                                    
                                    <ul className="space-y-2">
                                            {experience.description.map((item, i) => (
                                            <li key={i} className="flex items-start gap-3 text-muted-foreground text-sm">
                                                <span className="w-1 h-1 rounded-full bg-muted-foreground/50 mt-2 flex-shrink-0" />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                        ))}
                        </div>
                </div>
            </div>
        </PageTransition>
    )
}
