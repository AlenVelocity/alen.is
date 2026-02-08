'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { FaReact, FaNodeJs, FaVuejs, FaRust, FaPython, FaAws, FaGithub, FaDiscord, FaNpm } from 'react-icons/fa'
import {
    SiTypescript,
    SiJavascript,
    SiNextdotjs,
    SiTensorflow,
    SiMediapipe,
    SiPostgresql,
    SiPrisma,
    SiMongodb,
    SiMariadb,
    SiTailwindcss,
    SiScaleway,
    SiLangchain,
    SiValorant,
    SiShadcnui,
    SiDjango,
    SiFastapi,
    SiGo,
    SiMysql,
    SiRedis
} from 'react-icons/si'
import { TbBrandOpenai, TbSparkles } from 'react-icons/tb'
import { BsDatabaseFill } from 'react-icons/bs'
import { HiSparkles } from 'react-icons/hi2'

export type TechType =
    | 'typescript' | 'javascript' | 'react' | 'next' | 'node' | 'vue' | 'rust'
    | 'python' | 'aws' | 'gcp' | 'langchain' | 'tensorflow' | 'mediapipe' | 'llm'
    | 'valorant' | 'web' | 'discord' | 'npm' | 'github' | 'overwatch' | 'ai'
    | 'postgres' | 'prisma' | 'mongodb' | 'mariadb' | 'frappe' | 'convex'
    | 'tailwind' | 'shadcn' | 'scaleway' | 'wasm' | 'django' | 'fastapi' | 'go' | 'mysql' | 'redis'

const techIcons: Record<TechType, React.ReactNode> = {
    typescript: <SiTypescript />,
    javascript: <SiJavascript />,
    react: <FaReact />,
    next: <SiNextdotjs />,
    node: <FaNodeJs />,
    vue: <FaVuejs />,
    rust: <FaRust />,
    python: <FaPython />,
    aws: <FaAws />,
    gcp: <span>☁️</span>,
    langchain: <SiLangchain />,
    tensorflow: <SiTensorflow />,
    mediapipe: <SiMediapipe />,
    llm: <TbBrandOpenai />,
    valorant: <SiValorant />,
    web: <span>🌐</span>,
    discord: <FaDiscord />,
    npm: <FaNpm />,
    github: <FaGithub />,
    overwatch: <span>🔶</span>,
    ai: <HiSparkles />,
    postgres: <SiPostgresql />,
    prisma: <SiPrisma />,
    mongodb: <SiMongodb />,
    mariadb: <SiMariadb />,
    frappe: <span className="font-bold">F</span>,
    convex: <BsDatabaseFill />,
    tailwind: <SiTailwindcss />,
    shadcn: <SiShadcnui />,
    scaleway: <SiScaleway />,
    wasm: <span>⚙️</span>,
    django: <SiDjango />,
    fastapi: <SiFastapi />,
    go: <SiGo />,
    mysql: <SiMysql />,
    redis: <SiRedis />
}

const techNames: Record<TechType, string> = {
    typescript: 'TypeScript', javascript: 'JavaScript', react: 'React', next: 'Next.js',
    node: 'Node.js', vue: 'Vue', rust: 'Rust', python: 'Python', aws: 'AWS', gcp: 'GCP',
    langchain: 'LangChain', tensorflow: 'TensorFlow', mediapipe: 'MediaPipe', llm: 'LLM',
    valorant: 'Valorant', web: 'Web', discord: 'Discord', npm: 'NPM', github: 'GitHub',
    overwatch: 'Overwatch', ai: 'AI', postgres: 'PostgreSQL', prisma: 'Prisma',
    mongodb: 'MongoDB', mariadb: 'MariaDB', frappe: 'Frappe', convex: 'Convex',
    tailwind: 'Tailwind', shadcn: 'shadcn/ui', scaleway: 'Scaleway', wasm: 'WASM',
    django: 'Django', fastapi: 'FastAPI', go: 'Go', mysql: 'MySQL', redis: 'Redis'
}

// Active colors for each tech (shown on group hover)
const techColors: Record<TechType, string> = {
    typescript: 'text-blue-500',
    javascript: 'text-yellow-500',
    react: 'text-cyan-400',
    next: 'text-foreground',
    node: 'text-green-500',
    vue: 'text-emerald-500',
    rust: 'text-orange-500',
    python: 'text-blue-400',
    aws: 'text-amber-500',
    gcp: 'text-red-500',
    langchain: 'text-emerald-400',
    tensorflow: 'text-orange-400',
    mediapipe: 'text-purple-500',
    llm: 'text-emerald-400',
    valorant: 'text-red-500',
    web: 'text-sky-400',
    discord: 'text-indigo-500',
    npm: 'text-red-500',
    github: 'text-foreground',
    overwatch: 'text-orange-500',
    ai: 'text-violet-500',
    postgres: 'text-blue-500',
    prisma: 'text-teal-500',
    mongodb: 'text-green-500',
    mariadb: 'text-amber-500',
    frappe: 'text-blue-500',
    convex: 'text-orange-500',
    tailwind: 'text-cyan-400',
    shadcn: 'text-foreground',
    scaleway: 'text-purple-500',
    wasm: 'text-purple-400',
    django: 'text-green-600',
    fastapi: 'text-teal-500',
    go: 'text-cyan-500',
    mysql: 'text-blue-500',
    redis: 'text-red-500'
}

// Group-hover colors (for parent card hover activation)
const techGroupHoverColors: Record<TechType, string> = {
    typescript: 'group-hover:text-blue-500',
    javascript: 'group-hover:text-yellow-500',
    react: 'group-hover:text-cyan-400',
    next: 'group-hover:text-foreground',
    node: 'group-hover:text-green-500',
    vue: 'group-hover:text-emerald-500',
    rust: 'group-hover:text-orange-500',
    python: 'group-hover:text-blue-400',
    aws: 'group-hover:text-amber-500',
    gcp: 'group-hover:text-red-500',
    langchain: 'group-hover:text-emerald-400',
    tensorflow: 'group-hover:text-orange-400',
    mediapipe: 'group-hover:text-purple-500',
    llm: 'group-hover:text-emerald-400',
    valorant: 'group-hover:text-red-500',
    web: 'group-hover:text-sky-400',
    discord: 'group-hover:text-indigo-500',
    npm: 'group-hover:text-red-500',
    github: 'group-hover:text-foreground',
    overwatch: 'group-hover:text-orange-500',
    ai: 'group-hover:text-violet-500',
    postgres: 'group-hover:text-blue-500',
    prisma: 'group-hover:text-teal-500',
    mongodb: 'group-hover:text-green-500',
    mariadb: 'group-hover:text-amber-500',
    frappe: 'group-hover:text-blue-500',
    convex: 'group-hover:text-orange-500',
    tailwind: 'group-hover:text-cyan-400',
    shadcn: 'group-hover:text-foreground',
    scaleway: 'group-hover:text-purple-500',
    wasm: 'group-hover:text-purple-400',
    django: 'group-hover:text-green-600',
    fastapi: 'group-hover:text-teal-500',
    go: 'group-hover:text-cyan-500',
    mysql: 'group-hover:text-blue-500',
    redis: 'group-hover:text-red-500'
}

interface TechBadgeProps {
    tech: TechType
    showName?: boolean
    className?: string
    colorOnGroupHover?: boolean
    alwaysColor?: boolean
}

export function TechBadge({ tech, showName = false, className, colorOnGroupHover = false, alwaysColor = false }: TechBadgeProps) {
    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 transition-colors duration-200',
                alwaysColor ? techColors[tech] : 'text-muted-foreground',
                colorOnGroupHover && !alwaysColor ? techGroupHoverColors[tech] : '',
                showName && 'px-2 py-1 rounded-md bg-muted/50 text-xs font-medium',
                className
            )}
            title={techNames[tech]}
        >
            <span className="text-sm">{techIcons[tech]}</span>
            {showName && <span>{techNames[tech]}</span>}
        </span>
    )
}

interface TechStackProps {
    technologies: string[]
    showNames?: boolean
    className?: string
    colorOnGroupHover?: boolean
    alwaysColor?: boolean
}

export function TechStack({ technologies, showNames = false, className, colorOnGroupHover = false, alwaysColor = false }: TechStackProps) {
    return (
        <div className={cn('flex flex-wrap gap-2', className)}>
            {technologies.map((tech) => (
                <TechBadge key={tech} tech={tech as TechType} showName={showNames} colorOnGroupHover={colorOnGroupHover} alwaysColor={alwaysColor} />
            ))}
        </div>
    )
}
