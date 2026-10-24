import { PageTransition } from '@/components/ui/page-transition'
import { DecodeText } from '@/components/ui/decode-text'
import { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import { runGetProjects } from '@/lib/cms-db'
import { ProjectDetail, ProjectRow } from './_components/ProjectCard'

import { constructMetadata } from '@/lib/metadata'

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
            <div className="container max-w-2xl py-12 md:py-20 px-4">
                {/* ── Header ───────────────────────────────────── */}
                <div className="mb-16">
                    <p
                        className="mono-label text-muted-foreground/50 mb-4 animate-fade-in-up opacity-0 stagger-1"
                        style={{ animationFillMode: 'forwards' }}
                    >
                        // work
                    </p>
                    <h1
                        className="text-display text-5xl md:text-6xl mb-3 animate-fade-in-up opacity-0 stagger-2"
                        style={{ animationFillMode: 'forwards' }}
                    >
                        <DecodeText text="Projects" onMount />
                    </h1>
                    <p
                        className="text-[0.9rem] text-muted-foreground animate-fade-in-up opacity-0 stagger-3"
                        style={{ animationFillMode: 'forwards' }}
                    >
                        Things I&apos;ve built, shipped, and sometimes abandoned.
                    </p>
                </div>

                {/* ── Featured ─────────────────────────────────── */}
                {featuredProjects.length > 0 && (
                    <section
                        className="mb-14 animate-fade-in-up opacity-0 stagger-4"
                        style={{ animationFillMode: 'forwards' }}
                    >
                        <div className="section-label mb-4">featured</div>
                        <div>
                            {featuredProjects.map((project) => (
                                <ProjectDetail key={project.id} project={project} />
                            ))}
                        </div>
                    </section>
                )}

                {/* ── Other ─────────────────────────────────────── */}
                {otherProjects.length > 0 && (
                    <section
                        className="animate-fade-in-up opacity-0 stagger-5"
                        style={{ animationFillMode: 'forwards' }}
                    >
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
