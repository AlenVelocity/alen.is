import { PageTransition } from '@/components/ui/page-transition'
import { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import { runGetProjects } from '@/lib/cms-db'
import { ProjectDetail, ProjectRow } from './_components/ProjectCard'

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
            <div className="container max-w-2xl py-12 md:py-20">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                        Building
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Things I've built, shipped, and sometimes abandoned.
                    </p>
                </div>

                {/* Featured — expanded with descriptions */}
                {featuredProjects.length > 0 && (
                    <section className="mb-10">
                        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider border-l-2 border-accent pl-3 mb-4">
                            Featured
                        </h2>
                        <div>
                            {featuredProjects.map((project) => (
                                <ProjectDetail key={project.id} project={project} />
                            ))}
                        </div>
                    </section>
                )}

                {/* Everything else — compact directory listing */}
                {otherProjects.length > 0 && (
                    <section>
                        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider border-l-2 border-accent pl-3 mb-4">
                            Other
                        </h2>
                        <div>
                            {otherProjects.map((project) => (
                                <ProjectRow key={project.id} project={project} />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </PageTransition>
    )
}

