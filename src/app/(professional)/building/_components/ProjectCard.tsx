'use client'

import { TechStack, TechType } from '@/components/ui/tech-badge'
import { FiExternalLink } from 'react-icons/fi'
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

interface ProjectCardProps {
    project: Project
    size?: 'large' | 'medium' | 'small'
}

const getTypeBadge = (type: string) => {
    switch (type) {
        case 'GitHub': return 'Repo'
        case 'NPM': return 'Package'
        case 'Bot': return 'Bot'
        default: return 'Website'
    }
}

export function ProjectCard({ project, size = 'medium' }: ProjectCardProps) {
    const isLarge = size === 'large'
    const isSmall = size === 'small'
    
    return (
        <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
                "group relative flex flex-col p-6 rounded-2xl border border-border bg-card",
                "hover:bg-muted/50 hover:border-accent/50 transition-all duration-300",
                "hover:-translate-y-1 hover:shadow-lg hover:shadow-accent/5",
                isLarge && "md:col-span-2 md:row-span-2",
                isSmall && "p-4"
            )}
        >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                    <h3 className={cn(
                        "font-semibold group-hover:text-foreground transition-colors",
                        isLarge ? "text-xl" : "text-base"
                    )}>
                        {project.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                        {project.period}
                    </p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground group-hover:bg-accent/10 group-hover:text-accent transition-all">
                    {getTypeBadge(project.type)}
                </span>
            </div>
            
            {/* Description */}
            <p className={cn(
                "text-muted-foreground flex-1 mb-4",
                isLarge ? "text-base leading-relaxed" : "text-sm",
                isSmall && "line-clamp-2"
            )}>
                {project.description}
            </p>
            
            {/* Tech Stack */}
            <div className="flex items-center justify-between gap-4">
                <TechStack 
                    technologies={project.technologies.slice(0, isSmall ? 3 : isLarge ? 6 : 4)}
                    colorOnGroupHover
                />
                <FiExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            </div>
        </a>
    )
}
