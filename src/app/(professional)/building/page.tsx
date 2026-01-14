import { PageTransition } from '@/components/ui/page-transition'
import { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import { runGetProjects } from '@/lib/cms-db'
import { ProjectCard } from './_components/ProjectCard'

export const metadata: Metadata = {
    title: 'Building',
    description: "Things I've built and shipped",
    openGraph: {
        title: 'Building',
        description: "Things I've built and shipped",
        url: 'https://alen.is/building'
    },
    alternates: {
        canonical: '/building'
    }
}

export default async function Building() {
    const allProjects = await runGetProjects()
    const featuredProjects = allProjects.filter(project => project.featured)
    const otherProjects = allProjects.filter(project => !project.featured)

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
            <div className="container max-w-4xl py-12 md:py-20">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                        Building
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Things I've built, shipped, and sometimes abandoned.
                    </p>
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Featured projects - larger cards */}
                    {featuredProjects.map((project, index) => (
                        <ProjectCard 
                            key={project.id} 
                            project={project} 
                            size={index === 0 ? 'large' : 'medium'}
                        />
                    ))}
                    
                    {/* Other projects - smaller cards */}
                    {otherProjects.map((project) => (
                        <ProjectCard 
                            key={project.id} 
                            project={project} 
                            size="small"
                        />
                    ))}
                </div>
            </div>
        </PageTransition>
    )
}

