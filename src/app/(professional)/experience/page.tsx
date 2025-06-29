import { LinkButton } from '@/components/ui/link-button'
import { PageTransition } from '@/components/ui/page-transition'
import { FaBriefcase, FaCalendarAlt, FaMapMarkerAlt, FaBuilding, FaDownload } from 'react-icons/fa'
import { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import { runGetExperiences } from '@/lib/cms-db'

export const metadata: Metadata = {
    title: 'Experience',
    description: 'My professional experience so far',
    openGraph: {
        title: 'Experience',
        description: 'My professional experience so far',
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
            <div className="container mx-auto max-w-4xl px-4 py-8">
                {/* Header Section */}
                <div className="mb-12">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight mb-2">
                                Experience
                            </h1>
                        </div>
                        <LinkButton 
                            href="/Alen-Resume.pdf" 
                            target="_blank"
                            className="flex items-center gap-2"
                        >
                            <FaDownload className="w-4 h-4" />
                            Resume
                        </LinkButton>
                    </div>
                </div>

                {/* Experience Timeline */}
                <div className="space-y-8">
                    {experiences.map((experience, index) => (
                        <div key={experience.id} className="group">
                            <div className={`
                                bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl shadow-slate-200/20 dark:shadow-slate-950/20 border border-slate-200/50 dark:border-slate-800/50
                                transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl
                                ${experience.current ? 'ring-2 ring-green-500/20' : ''}
                            `}>
                                <div className="flex flex-col gap-6">
                                    {/* Company Header */}
                                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3">
                                                <FaBuilding className="text-slate-600 dark:text-slate-400 w-5 h-5" />
                                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                                                    {experience.company}
                                                </h2>
                                                {experience.current && (
                                                    <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-sm font-medium">
                                                        Current
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <FaBriefcase className="text-slate-500 dark:text-slate-500 w-4 h-4" />
                                                <span className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                                                    {experience.position}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div className="flex flex-col gap-2 text-sm text-slate-600 dark:text-slate-400">
                                            <div className="flex items-center gap-2">
                                                <FaCalendarAlt className="w-4 h-4" />
                                                <span className="font-medium">{experience.period}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <FaMapMarkerAlt className="w-4 h-4" />
                                                <span>{experience.location}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div className="border-t border-slate-200/50 dark:border-slate-700/50 pt-6">
                                        <ul className="space-y-3">
                                            {experience.description.map((item, i) => (
                                                <li key={i} className="flex items-start gap-3 text-slate-600 dark:text-slate-400 leading-relaxed">
                                                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </PageTransition>
    )
}
