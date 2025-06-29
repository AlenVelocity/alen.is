import { PageTransition } from '@/components/ui/page-transition'
import { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import { runGetProjects } from '@/lib/cms-db'
import { FeaturedProjectCard, RegularProjectCard } from './_components/ProjectCard'

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
    const allProjects = await runGetProjects()

    const featuredProjects = allProjects.filter(project => project.featured)

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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {featuredProjects.map((project) => (
                            <FeaturedProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                </section>

                {/* All Projects */}
                <section className="space-y-6 pb-8 pt-6 md:pb-12 lg:py-12 max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-3">
                        All Projects
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {allProjects.filter(project => !project.featured).map((project) => (
                            <RegularProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                </section>
            </div>
        </PageTransition>
    )
}
