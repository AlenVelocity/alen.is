import { PageTransition } from '@/components/ui/page-transition'
import { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import { runGetProjects } from '@/lib/cms-db'
import { ProjectDetail, ProjectRow } from './_components/ProjectCard'

import { constructMetadata } from '@/lib/metadata'
import { PageHeader } from '@/components/ui/page-header'

export const metadata: Metadata = constructMetadata({
    title: 'Projects',
    description: "Things I've built, shipped and sometimes abandoned",
    slug: 'building',
    ogTitle: 'Alen is Building'
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
            <div className="container max-w-3xl py-10 md:py-14 px-4">
                {/* ── Header ───────────────────────────────────── */}
                <PageHeader eyebrow="work" title="Projects">
                    <p className="text-[0.9rem] text-muted-foreground">
                        Things I&apos;ve built, shipped, and sometimes abandoned.
                    </p>
                </PageHeader>

                {/* ── Featured ─────────────────────────────────── */}
                {featuredProjects.length > 0 && (
                    <section className="mb-14">
                        <div className="section-label mb-4">featured</div>
                        <div className="grid md:grid-cols-2 gap-x-10">
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
