'use client'

import { TechBadge, TechType } from '@/components/ui/tech-badge'
import { FaExternalLinkAlt, FaGithub, FaGlobe, FaNpm, FaCalendarAlt } from 'react-icons/fa'
import { Lumiflex, Zenitho, Novatrix, Velustro, Tranquiluxe, Opulento, Xenon } from "uvcanvas"
import React from 'react'

const BACKGROUNDS = [
   Tranquiluxe,
   Velustro,
   Novatrix,
   Zenitho,
   Lumiflex,
   Opulento,
   Xenon
]

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
}

const getTypeIcon = (type: string) => {
    switch (type) {
        case 'GitHub':
            return <FaGithub className="w-4 h-4" />
        case 'NPM':
            return <FaNpm className="w-4 h-4" />
        case 'Website':
            return <FaGlobe className="w-4 h-4" />
        default:
            return <FaExternalLinkAlt className="w-4 h-4" />
    }
}

export function FeaturedProjectCard({ project }: ProjectCardProps) {
    return (
        <div className="group bg-gradient-to-br from-white/80 to-slate-50/80 dark:from-slate-900/80 dark:to-slate-800/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl shadow-slate-200/20 dark:shadow-slate-950/20 border border-slate-200/50 dark:border-slate-800/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl w-full">
            <div className="flex flex-col h-full">
                {/* Project Image or Icon */}
                <div className="relative w-full h-48 mb-4 rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700">
                    {React.createElement(BACKGROUNDS[Math.floor(project.order % BACKGROUNDS.length)] as React.ComponentType)}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <h3 className="text-2xl font-bold text-white drop-shadow-lg text-center px-4">
                            {project.title}
                        </h3>
                    </div>
                </div>

                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                            {project.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-3">
                            <FaCalendarAlt className="w-3 h-3" />
                            <span>{project.period}</span>
                        </div>
                    </div>
                </div>
                
                <p className="text-slate-600 dark:text-slate-400 mb-4 flex-1 leading-relaxed">
                    {project.description}
                </p>
                
                <div className="relative overflow-hidden mb-4 h-8">
                    <div className="flex gap-2 group-hover:animate-marquee">
                        {project.technologies.map((tech, index) => (
                            <TechBadge key={`${tech}-${index}`} tech={tech as TechType} />
                        ))}
                        {project.technologies.map((tech, index) => (
                            <TechBadge key={`${tech}-duplicate-${index}`} tech={tech as TechType} />
                        ))}
                    </div>
                </div>
                
                <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400"
                >
                    {getTypeIcon(project.type)}
                    <span>View {project.type}</span>
                    <FaExternalLinkAlt className="w-3 h-3 opacity-60" />
                </a>
            </div>
        </div>
    )
}

export function RegularProjectCard({ project }: ProjectCardProps) {
    return (
        <div className="group bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg shadow-slate-200/10 dark:shadow-slate-950/10 border border-slate-200/50 dark:border-slate-800/50 transition-all duration-300 hover:scale-102 hover:shadow-xl w-full">
            <div className="flex flex-col h-full">
                <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        {project.title}
                    </h3>
                    {project.featured && (
                        <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                    )}
                </div>
                
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-3">
                    <FaCalendarAlt className="w-3 h-3" />
                    <span>{project.period}</span>
                </div>
                
                <p className="text-slate-600 dark:text-slate-400 mb-4 flex-1 text-sm leading-relaxed">
                    {project.description}
                </p>
                
                <div className="relative overflow-hidden mb-4 h-6">
                    <div className="flex gap-1.5 group-hover:animate-marquee">
                        {project.technologies.map((tech, index) => (
                            <TechBadge key={`${tech}-${index}`} tech={tech as TechType} />
                        ))}
                        {project.technologies.map((tech, index) => (
                            <TechBadge key={`${tech}-duplicate-${index}`} tech={tech as TechType} />
                        ))}
                    </div>
                </div>
                
                <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm font-medium transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400"
                >
                    {getTypeIcon(project.type)}
                    <span>View {project.type}</span>
                    <FaExternalLinkAlt className="w-3 h-3 opacity-60" />
                </a>
            </div>
        </div>
    )
} 