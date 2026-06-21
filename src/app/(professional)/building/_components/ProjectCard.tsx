'use client'

import { TechStack, TechType } from '@/components/ui/tech-badge'
import { FiArrowUpRight } from 'react-icons/fi'
import { cn } from '@/lib/utils'

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
    featured?: boolean
}

const getTypeLabel = (type: string) => {
    switch (type) {
        case 'GitHub': return 'repo'
        case 'NPM': return 'pkg'
        case 'Bot': return 'bot'
        default: return 'site'
    }
}

export function ProjectRow({ project }: ProjectRowProps) {
    return (
        <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-baseline gap-3 py-3.5 border-b border-dashed border-border/50 hover:border-accent/40 transition-all duration-200 scanline-hover"
        >
            {/* Title */}
            <h3 className="font-mono-ui text-sm font-medium shrink-0 group-hover:text-accent transition-colors duration-200">
                {project.title}
            </h3>

            {/* Dot trail spacer */}
            <span className="flex-1 border-b border-dotted border-muted-foreground/15 translate-y-[-4px]" />

            {/* Type chip */}
            <span className="mono-label text-muted-foreground/40 shrink-0 group-hover:text-accent/60 transition-colors duration-200">
                {getTypeLabel(project.type)}
            </span>

            {/* Period */}
            <span className="mono-label text-muted-foreground/40 shrink-0 hidden sm:inline">
                {project.period}
            </span>

            {/* Arrow */}
            <FiArrowUpRight className="w-3 h-3 text-muted-foreground/25 group-hover:text-accent shrink-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
    )
}

export function ProjectDetail({ project }: { project: Project }) {
    return (
        <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex gap-4 py-5 border-b border-dashed border-border/50 hover:border-accent/40 transition-all duration-200 scanline-hover"
        >
            {/* Left accent line */}
            <div className="w-px bg-border group-hover:bg-accent transition-colors duration-300 shrink-0 self-stretch" />

            <div className="flex-1 min-w-0">
                {/* Title row */}
                <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                        <h3 className="text-display text-lg group-hover:text-accent transition-colors duration-200 mb-0.5">
                            {project.title}
                        </h3>
                        <div className="flex items-center gap-2">
                            <span className="mono-label text-muted-foreground/40">
                                {getTypeLabel(project.type)}
                            </span>
                            <span className="text-border">·</span>
                            <span className="mono-label text-muted-foreground/40 hidden sm:inline">
                                {project.period}
                            </span>
                        </div>
                    </div>
                    <FiArrowUpRight className="w-4 h-4 text-muted-foreground/25 group-hover:text-accent shrink-0 transition-all duration-200 mt-0.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>

                {/* Description */}
                <p className="text-[0.875rem] text-muted-foreground leading-relaxed mb-3">
                    {project.description}
                </p>

                {/* Tech stack */}
                <TechStack
                    technologies={project.technologies.slice(0, 6)}
                    alwaysColor
                />
            </div>
        </a>
    )
}
