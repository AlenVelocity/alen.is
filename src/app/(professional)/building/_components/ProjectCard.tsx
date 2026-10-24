'use client'

import { useState } from 'react'
import { TechStack } from '@/components/ui/tech-badge'
import { DecodeText } from '@/components/ui/decode-text'

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
}

const getTypeLabel = (type: string) => {
    switch (type) {
        case 'GitHub':
            return 'repo'
        case 'NPM':
            return 'pkg'
        case 'Bot':
            return 'bot'
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

export function ProjectRow({ project }: ProjectRowProps) {
    return (
        <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-baseline justify-between gap-4 py-3.5 border-b border-dashed border-border/50"
        >
            <h3 className="font-mono-ui text-sm font-medium min-w-0 truncate group-hover:text-accent transition-colors duration-200">
                {project.title}
            </h3>

            <span className="mono-label text-muted-foreground/40 shrink-0 tabular-nums inline-flex items-baseline gap-2">
                <span>{getTypeLabel(project.type)}</span>
                <span className="sm:hidden">{yearOf(project.period)}</span>
                <span className="hidden sm:inline">{project.period}</span>
                <Leaves />
            </span>
        </a>
    )
}

export function ProjectDetail({ project }: ProjectRowProps) {
    const [hovered, setHovered] = useState(false)

    return (
        <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onFocus={() => setHovered(true)}
            onBlur={() => setHovered(false)}
            className="group block py-5 border-b border-dashed border-border/50"
        >
            {/* Title row: name left, when right */}
            <div className="flex items-baseline justify-between gap-4 mb-1.5">
                <h3 className="text-display text-lg md:text-xl min-w-0 break-words group-hover:text-accent transition-colors duration-200">
                    <DecodeText text={project.title} active={hovered} />
                </h3>
                <span className="mono-label text-muted-foreground/40 shrink-0 tabular-nums">
                    <span className="sm:hidden">{yearOf(project.period)}</span>
                    <span className="hidden sm:inline">{project.period}</span>
                </span>
            </div>

            <p className="text-[0.9rem] text-muted-foreground leading-relaxed mb-3 max-w-prose">
                {project.description}
            </p>

            {/* Stack left, destination right. Icons stay monochrome until the row is hovered */}
            <div className="flex items-center justify-between gap-4">
                <TechStack technologies={project.technologies.slice(0, 6)} colorOnGroupHover />
                <span className="mono-label text-muted-foreground/40 shrink-0 inline-flex items-baseline gap-1.5">
                    {getTypeLabel(project.type)}
                    <Leaves />
                </span>
            </div>
        </a>
    )
}
