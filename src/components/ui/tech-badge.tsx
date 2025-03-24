"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { FaReact, FaNodeJs, FaVuejs, FaRust, FaPython, FaAws, FaGithub, FaDiscord, FaNpm } from "react-icons/fa"
import { SiTypescript, SiJavascript, SiNextdotjs, SiTensorflow, SiMediapipe, SiPostgresql, SiPrisma, SiMongodb, SiMariadb } from "react-icons/si"
import { TbBrandOpenai } from "react-icons/tb"
import { BiLogoGoLang } from "react-icons/bi"
import { BsDatabaseFill } from "react-icons/bs"

// Define tech stack types and their properties
export type TechType = 
  | "typescript" 
  | "javascript" 
  | "react" 
  | "next" 
  | "node" 
  | "vue" 
  | "rust" 
  | "python"
  | "aws" 
  | "gcp" 
  | "langchain" 
  | "tensorflow"
  | "mediapipe"
  | "llm"
  | "valorant"
  | "web"
  | "discord"
  | "npm"
  | "github"
  | "overwatch"
  | "ai"
  | "postgres"
  | "prisma"
  | "mongodb"
  | "mariadb"
  | "frappe"

interface TechConfig {
  name: string
  color: string
  textColor: string
  icon: React.ReactNode
}

const techConfigs: Record<TechType, TechConfig> = {
  typescript: {
    name: "TypeScript",
    color: "bg-blue-100 dark:bg-blue-900/30",
    textColor: "text-blue-700 dark:text-blue-300",
    icon: <SiTypescript className="text-blue-600 dark:text-blue-400" />
  },
  javascript: {
    name: "JavaScript",
    color: "bg-yellow-100 dark:bg-yellow-900/30",
    textColor: "text-yellow-700 dark:text-yellow-300",
    icon: <SiJavascript className="text-yellow-500 dark:text-yellow-400" />
  },
  react: {
    name: "React",
    color: "bg-cyan-100 dark:bg-cyan-900/30",
    textColor: "text-cyan-700 dark:text-cyan-300",
    icon: <FaReact className="text-cyan-500 dark:text-cyan-400" />
  },
  next: {
    name: "Next.js",
    color: "bg-neutral-100 dark:bg-neutral-800/50",
    textColor: "text-neutral-700 dark:text-neutral-300",
    icon: <SiNextdotjs className="text-black dark:text-white" />
  },
  node: {
    name: "Node.js",
    color: "bg-green-100 dark:bg-green-900/30",
    textColor: "text-green-700 dark:text-green-300",
    icon: <FaNodeJs className="text-green-600 dark:text-green-400" />
  },
  vue: {
    name: "Vue",
    color: "bg-emerald-100 dark:bg-emerald-900/30",
    textColor: "text-emerald-700 dark:text-emerald-300",
    icon: <FaVuejs className="text-emerald-600 dark:text-emerald-400" />
  },
  rust: {
    name: "Rust",
    color: "bg-orange-100 dark:bg-orange-900/30",
    textColor: "text-orange-700 dark:text-orange-300",
    icon: <FaRust className="text-orange-600 dark:text-orange-400" />
  },
  python: {
    name: "Python",
    color: "bg-blue-100 dark:bg-blue-900/30",
    textColor: "text-blue-700 dark:text-blue-300",
    icon: <FaPython className="text-blue-600 dark:text-blue-400" />
  },
  aws: {
    name: "AWS",
    color: "bg-amber-100 dark:bg-amber-900/30",
    textColor: "text-amber-700 dark:text-amber-300",
    icon: <FaAws className="text-amber-600 dark:text-amber-400" />
  },
  gcp: {
    name: "GCP",
    color: "bg-red-100 dark:bg-red-900/30",
    textColor: "text-red-700 dark:text-red-300",
    icon: "☁️"
  },
  langchain: {
    name: "LangChain",
    color: "bg-emerald-100 dark:bg-emerald-900/30",
    textColor: "text-emerald-700 dark:text-emerald-300",
    icon: "🔗"
  },
  tensorflow: {
    name: "TensorFlow",
    color: "bg-orange-100 dark:bg-orange-900/30",
    textColor: "text-orange-700 dark:text-orange-300",
    icon: <SiTensorflow className="text-orange-600 dark:text-orange-400" />
  },
  mediapipe: {
    name: "MediaPipe",
    color: "bg-purple-100 dark:bg-purple-900/30",
    textColor: "text-purple-700 dark:text-purple-300",
    icon: <SiMediapipe className="text-purple-600 dark:text-purple-400" />
  },
  llm: {
    name: "LLM",
    color: "bg-indigo-100 dark:bg-indigo-900/30",
    textColor: "text-indigo-700 dark:text-indigo-300",
    icon: <TbBrandOpenai className="text-indigo-600 dark:text-indigo-400" />
  },
  valorant: {
    name: "Valorant",
    color: "bg-red-100 dark:bg-red-900/30",
    textColor: "text-red-700 dark:text-red-300",
    icon: "🎯"
  },
  web: {
    name: "Web",
    color: "bg-sky-100 dark:bg-sky-900/30",
    textColor: "text-sky-700 dark:text-sky-300",
    icon: "🌐"
  },
  discord: {
    name: "Discord",
    color: "bg-indigo-100 dark:bg-indigo-900/30",
    textColor: "text-indigo-700 dark:text-indigo-300",
    icon: <FaDiscord className="text-indigo-600 dark:text-indigo-400" />
  },
  npm: {
    name: "NPM",
    color: "bg-red-100 dark:bg-red-900/30",
    textColor: "text-red-700 dark:text-red-300",
    icon: <FaNpm className="text-red-600 dark:text-red-400" />
  },
  github: {
    name: "GitHub",
    color: "bg-neutral-100 dark:bg-neutral-800/50",
    textColor: "text-neutral-700 dark:text-neutral-300",
    icon: <FaGithub className="text-neutral-800 dark:text-neutral-200" />
  },
  overwatch: {
    name: "Overwatch",
    color: "bg-orange-100 dark:bg-orange-900/30",
    textColor: "text-orange-700 dark:text-orange-300",
    icon: "🔶"
  },
  ai: {
    name: "AI",
    color: "bg-violet-100 dark:bg-violet-900/30",
    textColor: "text-violet-700 dark:text-violet-300",
    icon: "🧠"
  },
  postgres: {
    name: "PostgreSQL",
    color: "bg-blue-100 dark:bg-blue-900/30",
    textColor: "text-blue-700 dark:text-blue-300",
    icon: <SiPostgresql className="text-blue-600 dark:text-blue-400" />
  },
  prisma: {
    name: "Prisma",
    color: "bg-teal-100 dark:bg-teal-900/30",
    textColor: "text-teal-700 dark:text-teal-300",
    icon: <SiPrisma className="text-teal-600 dark:text-teal-400" />
  },
  mongodb: {
    name: "MongoDB",
    color: "bg-green-100 dark:bg-green-900/30",
    textColor: "text-green-700 dark:text-green-300",
    icon: <SiMongodb className="text-green-600 dark:text-green-400" />
  },
  mariadb: {
    name: "MariaDB",
    color: "bg-amber-100 dark:bg-amber-900/30",
    textColor: "text-amber-700 dark:text-amber-300",
    icon: <SiMariadb className="text-amber-600 dark:text-amber-400" />
  },
  frappe: {
    name: "Frappe",
    color: "bg-blue-100 dark:bg-blue-900/30",
    textColor: "text-blue-700 dark:text-blue-300",
    icon: "F"
  }
}

interface TechBadgeProps {
  tech: TechType
  className?: string
}

export function TechBadge({ tech, className }: TechBadgeProps) {
  const config = techConfigs[tech]
  
  return (
    <span 
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors", 
        "border border-transparent hover:border-foreground/10",
        config.color, 
        config.textColor,
        className
      )}
    >
      <span className="mr-1.5 flex items-center justify-center">{config.icon}</span>
      {config.name}
    </span>
  )
} 