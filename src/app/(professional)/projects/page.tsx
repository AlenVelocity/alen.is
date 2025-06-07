import { PageTransition } from '@/components/ui/page-transition'
import { TechBadge, TechType } from '@/components/ui/tech-badge'
import { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import { FaExternalLinkAlt, FaGithub, FaGlobe, FaNpm, FaCalendarAlt } from 'react-icons/fa'

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

interface Project {
    title: string
    period: string
    description: string
    link: string
    type: string
    technologies: TechType[]
    featured?: boolean
}

export default function Projects() {
    const projects: Project[] = [
        {
            title: 'Press',
            period: 'December 2024',
            description: 'Worked on Frappe/Press, Bare Metal Provider integration',
            link: 'https://github.com/frappe/press',
            type: 'GitHub',
            technologies: ['typescript', 'vue', 'frappe', 'mariadb'],
            featured: true
        },
        {
            title: 'Kalidokit',
            period: 'November 2021',
            description:
                'Blendshape and kinematics solver for Mediapipe/Tensorflow.js face, eyes, pose, and hand tracking models',
            link: 'https://www.npmjs.com/package/kalidokit',
            type: 'NPM',
            technologies: ['typescript', 'mediapipe', 'tensorflow'],
            featured: true
        },
        {
            title: 'MeowScript',
            period: 'August 2023',
            description: 'The Purr-fect programming language for cat lovers',
            link: 'https://meow.alen.is',
            type: 'Website',
            technologies: ['typescript', 'node']
        },
        {
            title: 'Wa-Sticker-Formatter',
            period: 'March 2021',
            description:
                'WhatsApp sticker creator for Node. Built webp parsers for images and videos with editable exif metadata',
            link: 'https://www.npmjs.com/package/wa-sticker-formatter',
            type: 'NPM',
            technologies: ['typescript', 'node', 'npm']
        },
        {
            title: 'Valdle',
            period: 'October 2024',
            description:
                'Worked with Paragon w/ official Valorant Discord to create a Valorant arcade game for the web',
            link: 'https://valdle.com',
            type: 'Website',
            technologies: ['typescript', 'react', 'next', 'prisma', 'postgres', 'valorant', 'discord'],
            featured: true
        },
        {
            title: 'OWCSLE',
            period: 'April 2024',
            description: 'Overwatch Championship Series League Esports Arcade Game',
            link: 'https://owcsle.com',
            type: 'Website',
            technologies: ['typescript', 'react', 'next', 'prisma', 'postgres', 'overwatch']
        },
        {
            title: 'Langchain-Llama/Vicuna-TS',
            period: 'April 2023',
            description: 'Llama LLM compatibility for Langchain NodeJS',
            link: 'https://github.com/AlenVelocity/langchain-llama',
            type: 'GitHub',
            technologies: ['typescript', 'node', 'langchain', 'llm']
        },
        {
            title: 'Aureolin',
            period: 'November 2021',
            description:
                "Superfast TS Web Framework for Node. Utilized Reflect metadata's decorators to allow users to easily create APIs and platforms",
            link: 'https://github.com/AlenVelocity/aureolin',
            type: 'GitHub',
            technologies: ['typescript', 'node']
        },
        {
            title: 'Infinity',
            period: 'July 2020',
            description: 'First ever utility WhatsApp Bot',
            link: 'https://alen.infinity.is',
            type: 'Website',
            technologies: ['typescript', 'node', 'mongodb']
        },
        {
            title: 'Gyan.Pro',
            period: 'March 2024',
            description: 'AI Voice Note Taking app built with Llama3-8b GROQ and OAI Embeddings',
            link: 'https://gyan.pro',
            type: 'Website',
            technologies: ['typescript', 'react', 'next', 'ai', 'llm']
        }
    ]

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
        itemListElement: projects.map((project, index) => ({
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
            <div className="container mx-auto max-w-6xl px-4 py-8">
                {/* Header Section */}
                <div className="mb-12">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight mb-4">
                            Projects
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Things I've built over the years
                        </p>
                    </div>
                </div>

                {/* Featured Projects */}
                <div className="mb-16">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-3">
                        <span className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></span>
                        Featured Projects
                    </h2>
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {projects.filter(project => project.featured).map((project, index) => (
                            <div
                                key={index}
                                className="group bg-gradient-to-br from-white/80 to-slate-50/80 dark:from-slate-900/80 dark:to-slate-800/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl shadow-slate-200/20 dark:shadow-slate-950/20 border border-slate-200/50 dark:border-slate-800/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                            >
                                <div className="flex flex-col h-full">
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
                                        <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-2 py-1 rounded-full text-xs font-medium">
                                            Featured
                                        </span>
                                    </div>
                                    
                                    <p className="text-slate-600 dark:text-slate-400 mb-4 flex-1 leading-relaxed">
                                        {project.description}
                                    </p>
                                    
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {project.technologies.map((tech) => (
                                            <TechBadge key={tech} tech={tech} />
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
                </div>

                {/* All Projects */}
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-3">
                        <span className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"></span>
                        All Projects
                    </h2>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {projects.map((project, index) => (
                            <div
                                key={index}
                                className="group bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg shadow-slate-200/10 dark:shadow-slate-950/10 border border-slate-200/50 dark:border-slate-800/50 transition-all duration-300 hover:scale-102 hover:shadow-xl"
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
                                            <TechBadge key={tech} tech={tech} />
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
                </div>
            </div>
        </PageTransition>
    )
}
