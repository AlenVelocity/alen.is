import { PageTransition } from '@/components/ui/page-transition'
import { TechBadge, TechType } from '@/components/ui/tech-badge'
import { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import { FaExternalLinkAlt, FaGithub, FaGlobe, FaNpm, FaCalendarAlt } from 'react-icons/fa'
import { getProjectsFromDB } from '@/lib/cms-db'
import Image from 'next/image'
import Emoji from 'react-emojis'
import { getBg } from '@/lib/utils'

export const metadata: Metadata = {
    title: 'Projects',
    description: "A list of projects I've worked on",
    openGraph: {
        title: 'Projects',
        description: "A list of projects I've worked on",
        url: 'https://alen.is/projects'
    },
    alternates: {
        canonical: '/projects'
    }
}

export default async function Projects() {
    const allProjects = await getProjectsFromDB()

    const featuredProjects = allProjects.filter(project => project.featured)

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'GitHub':
                return <FaGithub className="w-4 h-4" />
            case 'NPM':
                return <FaNpm className="w-4 h-4" />
            case 'Website':
                return <FaGlobe className="w-4 h-4" />
            default:
                return <FaExternalLinkAlt className="w-4 h-4" />
        }
    }

    const projectsSchema = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: allProjects.map((project, index) => ({
            '@type': 'SoftwareSourceCode',
            position: index + 1,
            name: project.title,
            description: project.description,
            codeRepository: project.link,
            programmingLanguage: project.technologies.join(', '),
            dateCreated: project.period
        }))
    }

    return (
        <PageTransition>
            <JsonLd data={projectsSchema} />
            <div className="container mx-auto max-w-4xl px-4 py-8">


                {/* Featured Projects */}
                <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-16">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-3">
                        Featured Projects
                    </h2>
                    <div className="grid gap-8 md:grid-cols-2">
                        {featuredProjects.map((project) => (
                            <div
                                key={project.id}
                                className="group bg-gradient-to-br from-white/80 to-slate-50/80 dark:from-slate-900/80 dark:to-slate-800/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl shadow-slate-200/20 dark:shadow-slate-950/20 border border-slate-200/50 dark:border-slate-800/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl w-full h-[520px]"
                            >
                                <div className="flex flex-col h-full">
                                    {/* Project Image or Icon */}
                                    {project.image ? (
                                        <div className="relative w-full h-48 mb-4 rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700">
                                            <Image
                                                src={project.image}
                                                alt={project.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    ) : project.icon ? (
                                        <div className={`w-full h-48 mb-4 rounded-2xl flex items-center justify-center ${getBg(project.order)}`}>
                                            <Emoji emoji={project.icon} size={48} />
                                        </div>
                                    ) : null}

                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                                                {project.title}
                                            </h3>
                                            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-3">
                                                <FaCalendarAlt className="w-3 h-3" />
                                                <span>{project.period}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <p className="text-slate-600 dark:text-slate-400 mb-4 flex-1 leading-relaxed">
                                        {project.description}
                                    </p>
                                    
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {project.technologies.map((tech) => (
                                            <TechBadge key={tech} tech={tech as TechType} />
                                        ))}
                                    </div>
                                    
                                    <a
                                        href={project.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400"
                                    >
                                        {getTypeIcon(project.type)}
                                        <span>View {project.type}</span>
                                        <FaExternalLinkAlt className="w-3 h-3 opacity-60" />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* All Projects */}
                <section className="space-y-6 pb-8 pt-6 md:pb-12 lg:py-12">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-3">
                        All Projects
                    </h2>
                    <div className="grid gap-6 md:grid-cols-2">
                        {allProjects.filter(project => !project.featured).map((project) => (
                            <div
                                key={project.id}
                                className="group bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg shadow-slate-200/10 dark:shadow-slate-950/10 border border-slate-200/50 dark:border-slate-800/50 transition-all duration-300 hover:scale-102 hover:shadow-xl w-full h-[280px]"
                            >
                                <div className="flex flex-col h-full">
                                    <div className="flex items-start justify-between mb-3">
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                            {project.title}
                                        </h3>
                                        {project.featured && (
                                            <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                                        )}
                                    </div>
                                    
                                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-3">
                                        <FaCalendarAlt className="w-3 h-3" />
                                        <span>{project.period}</span>
                                    </div>
                                    
                                    <p className="text-slate-600 dark:text-slate-400 mb-4 flex-1 text-sm leading-relaxed">
                                        {project.description}
                                    </p>
                                    
                                    <div className="flex flex-wrap gap-1.5 mb-4">
                                        {project.technologies.map((tech) => (
                                            <TechBadge key={tech} tech={tech as TechType} />
                                        ))}
                                    </div>
                                    
                                    <a
                                        href={project.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm font-medium transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400"
                                    >
                                        {getTypeIcon(project.type)}
                                        <span>View {project.type}</span>
                                        <FaExternalLinkAlt className="w-3 h-3 opacity-60" />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </PageTransition>
    )
}
