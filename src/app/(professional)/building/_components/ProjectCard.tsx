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

export function ProjectRow({ project, featured = false }: ProjectRowProps) {
    return (
        <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
                'group flex items-baseline gap-3 py-3 border-b border-dashed border-border hover:border-accent/50 transition-colors',
                featured && 'py-4'
            )}
        >
            {/* Title */}
            <h3 className={cn(
                'font-semibold shrink-0 group-hover:text-accent transition-colors',
                featured ? 'text-lg' : 'text-base'
            )}>
                {project.title}
            </h3>

            {/* Dot trail / spacer */}
            <span className="flex-1 border-b border-dotted border-muted-foreground/20 translate-y-[-4px]" />

            {/* Type */}
            <span className="text-xs text-muted-foreground/60 shrink-0">{getTypeLabel(project.type)}</span>

            {/* Period */}
            <span className="text-xs text-muted-foreground shrink-0 hidden sm:inline">{project.period}</span>

            {/* Arrow */}
            <FiArrowUpRight className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-accent shrink-0 transition-colors" />
        </a>
    )
}

export function ProjectDetail({ project }: { project: Project }) {
    return (
        <div className="group">
            <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 py-5 border-b border-dashed border-border hover:border-accent/50 transition-colors"
            >
                <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-3 mb-1.5">
                        <h3 className="text-lg font-semibold group-hover:text-accent transition-colors">
                            {project.title}
                        </h3>
                        <span className="text-xs text-muted-foreground/60">{getTypeLabel(project.type)}</span>
                        <span className="text-xs text-muted-foreground hidden sm:inline">{project.period}</span>
                        <FiArrowUpRight className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-accent shrink-0 transition-colors" />
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                        {project.description}
                    </p>
                    <TechStack
                        technologies={project.technologies.slice(0, 6)}
                        alwaysColor
                    />
                </div>
            </a>
        </div>
    )
}
