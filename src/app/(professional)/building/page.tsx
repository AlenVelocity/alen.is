import { PageTransition } from '@/components/ui/page-transition'
import { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import { runGetProjects } from '@/lib/cms-db'
import { ProjectDetail, ProjectRow } from './_components/ProjectCard'

import { constructMetadata } from '@/lib/metadata'

export const metadata: Metadata = constructMetadata({
    title: 'Projects',
    description: "Things I've built, shipped and sometimes abandoned",
    slug: 'building'
})

export default async function Building() {
    const allProjects = await runGetProjects()
    const featuredProjects = allProjects.filter((project) => project.featured)
    const otherProjects = allProjects.filter((project) => !project.featured)

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
            <div className="container max-w-2xl py-12 md:py-20 px-4">
                {/* ── Header ───────────────────────────────────── */}
                <div className="mb-16">
                    <p className="mono-label text-muted-foreground/50 mb-4">// work</p>
                    <h1 className="text-display text-5xl md:text-6xl mb-3">Projects</h1>
                    <p className="text-[0.9rem] text-muted-foreground">
                        Things I&apos;ve built, shipped, and sometimes abandoned.
                    </p>
                </div>

                {/* ── Featured ─────────────────────────────────── */}
                {featuredProjects.length > 0 && (
                    <section className="mb-12">
                        <div className="section-label mb-6">featured</div>
                        <div>
                            {featuredProjects.map((project) => (
                                <ProjectDetail key={project.id} project={project} />
                            ))}
                        </div>
                    </section>
                )}

                {/* ── Other ─────────────────────────────────────── */}
                {otherProjects.length > 0 && (
                    <section>
                        <div className="section-label mb-4">everything else</div>
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
