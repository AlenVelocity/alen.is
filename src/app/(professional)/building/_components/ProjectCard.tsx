'use client'

import { useState } from 'react'
import Link from 'next/link'
import { TechStack } from '@/components/ui/tech-badge'
import { DecodeText } from '@/components/ui/decode-text'
import { Persona } from '@/components/persona'
import { usePersona } from '@/hooks/use-persona'
import type { ProjectDetails } from '@/lib/project-details'

interface Project {
    id: string
    title: string
    description: string
    technologies: string[]
    link: string
    type: string
    period: string
    order: number
    featured: boolean
}

interface ProjectRowProps {
    project: Project
    /** What Ban says this project is. Falls back to Alen's description. */
    banDescription?: string
    /** Extras that ship with the code: a repo link, a few hard facts, a write-up */
    details: ProjectDetails
}

const getTypeLabel = (type: string) => {
    switch (type) {
        case 'GitHub':
            return 'repo'
        case 'NPM':
            return 'pkg'
        case 'Bot':
            return 'bot'
        case 'App':
            return 'app'
        default:
            return 'site'
    }
}

/** "December 2024" is too wide for a phone row; the year alone still places it */
const yearOf = (period: string) => period.trim().split(' ').pop()

/** Every project link leaves the site, so each row ends with the same quiet mark */
function Leaves() {
    return (
        <span className="text-muted-foreground/40" aria-hidden="true">
            ↗
        </span>
    )
}

/**
 * A project's name, which is also its main link. The link is stretched over
 * the whole row (after:inset-0 on a relative parent), so a click anywhere
 * opens the project the way it did when the row itself was the anchor. It is
 * done this way because a row can now hold a second link (its source, a
 * write-up), and an anchor cannot sit inside another anchor.
 * A project whose site is gone has a name and no link.
 */
function Title({ project, offline, children }: { project: Project; offline?: boolean; children: React.ReactNode }) {
    if (offline) return <>{children}</>
    return (
        <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:outline focus-visible:after:outline-1 focus-visible:after:outline-ring"
        >
            {children}
        </a>
    )
}

/** Where the main link goes, or that it no longer goes anywhere */
function Destination({ project, offline }: { project: Project; offline?: boolean }) {
    if (offline) return <Persona alen="offline" ban="gone" />
    return <>{getTypeLabel(project.type)}</>
}

const QUIET_LINK =
    'relative z-10 text-muted-foreground/70 hover:text-accent transition-colors duration-200 underline decoration-dashed decoration-border underline-offset-4 hover:decoration-accent'

/**
 * The line under a description: the numbers worth saying, then the second and
 * third links. The links sit above the stretched title link (z-10) so they
 * stay clickable. Renders nothing for a project with no extras.
 */
function Extras({ details, className }: { details: ProjectDetails; className?: string }) {
    if (!details.facts && !details.repo && !details.writeup) return null
    return (
        <p className={`mono-label flex flex-wrap items-baseline gap-x-3 gap-y-1 ${className ?? ''}`}>
            {details.facts && <span className="text-foreground/70">{details.facts.join(' · ')}</span>}
            {details.writeup && (
                <Link href={details.writeup} className={QUIET_LINK}>
                    <Persona alen="write-up" ban="statement" />
                </Link>
            )}
            {details.repo && (
                <a href={details.repo} target="_blank" rel="noopener noreferrer" className={QUIET_LINK}>
                    source
                </a>
            )}
        </p>
    )
}

export function ProjectRow({ project, banDescription, details }: ProjectRowProps) {
    return (
        <article className="group relative py-3.5 border-b border-dashed border-border/50">
            <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-mono-ui text-sm font-medium min-w-0 truncate group-hover:text-accent transition-colors duration-200">
                    <Title project={project} offline={details.offline}>
                        {project.title}
                    </Title>
                </h3>

                <span className="mono-label text-muted-foreground/40 shrink-0 tabular-nums inline-flex items-baseline gap-2">
                    <span>
                        <Destination project={project} offline={details.offline} />
                    </span>
                    <span className="sm:hidden">{yearOf(project.period)}</span>
                    <span className="hidden sm:inline">{project.period}</span>
                    {!details.offline && <Leaves />}
                </span>
            </div>

            {/* A name alone does not say what the thing is */}
            <p className="text-[0.8125rem] text-muted-foreground leading-relaxed mt-1 max-w-prose">
                <Persona alen={project.description} ban={banDescription ?? project.description} />
            </p>

            <Extras details={details} className="mt-1.5" />
        </article>
    )
}

export function ProjectDetail({ project, banDescription, details }: ProjectRowProps) {
    const [hovered, setHovered] = useState(false)
    // The glyph decode is the ship's. Nothing on Ban's paper scrambles
    const persona = usePersona()

    return (
        <article
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onFocus={() => setHovered(true)}
            onBlur={() => setHovered(false)}
            className="group relative py-5 border-b border-dashed border-border/50"
        >
            {/* Title row: name left, when right */}
            <div className="flex items-baseline justify-between gap-4 mb-1.5">
                <h3 className="text-display text-lg md:text-xl min-w-0 break-words group-hover:text-accent transition-colors duration-200">
                    <Title project={project} offline={details.offline}>
                        <DecodeText text={project.title} active={hovered && persona === 'alen'} />
                    </Title>
                </h3>
                <span className="mono-label text-muted-foreground/40 shrink-0 tabular-nums">
                    <span className="sm:hidden">{yearOf(project.period)}</span>
                    <span className="hidden sm:inline">{project.period}</span>
                </span>
            </div>

            <p className="text-[0.9rem] text-muted-foreground leading-relaxed mb-3 max-w-prose">
                <Persona alen={project.description} ban={banDescription ?? project.description} />
            </p>

            <Extras details={details} className="mb-3" />

            {/* Stack left, destination right. Icons stay monochrome until the row is hovered */}
            <div className="flex items-center justify-between gap-4">
                <TechStack technologies={project.technologies.slice(0, 6)} colorOnGroupHover />
                <span className="mono-label text-muted-foreground/40 shrink-0 inline-flex items-baseline gap-1.5">
                    <Destination project={project} offline={details.offline} />
                    {!details.offline && <Leaves />}
                </span>
            </div>
        </article>
    )
}
