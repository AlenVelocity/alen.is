import { PageTransition } from "@/components/ui/page-transition"
import { TechBadge, TechType } from "@/components/ui/tech-badge"
import { Metadata } from "next"
import JsonLd from "@/components/JsonLd"

export const metadata: Metadata = {
  title: "Projects",
  description: "A list of projects I've worked on",
  openGraph: {
    title: "Projects",
    description: "A list of projects I've worked on",
    url: 'https://alen.is/projects',
  },
  alternates: {
    canonical: '/projects',
  },
}

interface Project {
  title: string
  period: string
  description: string
  link: string
  type: string
  technologies: TechType[]
}

export default function Projects() {
  const projects: Project[] = [
    {
      title: "Press",
      period: "December 2024",
      description: "Worked on Frappe/Press, Bare Metal Providder integration",
      link: "https://github.com/frappe/press",
      type: "GitHub",
      technologies: ["typescript", "vue", "frappe", "mariadb"]
    },
    {
      title: "Kalidokit",
      period: "November 2021",
      description: "Blendshape and kinematics solver for Mediapipe/Tensorflow.js face, eyes, pose, and hand tracking models",
      link: "https://www.npmjs.com/package/kalidokit",
      type: "NPM",
      technologies: ["typescript", "mediapipe", "tensorflow"]
    },
    {
      title: "Wa-Sticker-Formatter",
      period: "March 2021",
      description: "WhatsApp sticker creator for Node. Built webp parsers for images and videos with editable exif metadata",
      link: "https://www.npmjs.com/package/wa-sticker-formatter",
      type: "NPM",
      technologies: ["typescript", "node", "npm"]
    },
    {
      title: "Valdle",
      period: "October 2024",
      description: "Worked with Paragon w/ official Valorant Discord to create a Valorant arcade game for the web",
      link: "https://valdle.com",
      type: "Website",
      technologies: ["typescript", "react", "next", "prisma", "postgres", "valorant", "discord"]
    },
    {
      title: "OWCSLE",
      period: "April 2024",
      description: "Overwatch Championship Series League Esports Arcade Game",
      link: "https://owcsle.com",
      type: "Website",
      technologies: ["typescript", "react", "next", "prisma", "postgres", "overwatch"]
    },
    {
      title: "Langchain-Llama/Vicuna-TS",
      period: "April 2023",
      description: "Llama LLM compatibility for Langchain NodeJS",
      link: "https://github.com/AlenVelocity/langchain-llama",
      type: "GitHub",
      technologies: ["typescript", "node", "langchain", "llm"]
    },
    {
      title: "Auerolin",
      period: "November 2021",
      description: "Superfast TS Web Framework for Node. Utilized Reflect metadata's decorators to allow users to easily create APIs and platforms",
      link: "https://github.com/AlenVelocity/auerolin",
      type: "GitHub",
      technologies: ["typescript", "node"]
    },
    {
      title: "Infinity",
      period: "July 2020",
      description: "First ever utility WhatsApp Bot",
      link: "https://alen.infinity.is",
      type: "Website",
      technologies: ["typescript", "node", "mongodb"]
    },
    {
      title: "Gyan.Pro",
      period: "March 2024",
      description: "AI Voice Note Taking app built with Llama3-8b GROQ and OAI Embeddings",
      link: "https://gyan.pro",
      type: "Website",
      technologies: ["typescript", "react", "next", "ai", "llm"]
    },
  ]

  const projectsSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": projects.map((project, index) => ({
      "@type": "SoftwareSourceCode",
      "position": index + 1,
      "name": project.title,
      "description": project.description,
      "codeRepository": project.link,
      "programmingLanguage": project.technologies.join(", "),
      "dateCreated": project.period
    }))
  }

  return (
    <PageTransition>
      <JsonLd data={projectsSchema} />
      <div className="container py-12 max-w-4xl">
        <h1 className="text-3xl font-bold tracking-tight mb-8">Projects</h1>
        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project, index) => (
            <div key={index} className="group relative rounded-lg border p-6 hover:border-foreground transition-colors">
              <div className="flex flex-col space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">{project.title}</h2>
                  <span className="text-sm text-muted-foreground">{project.period}</span>
                </div>
                <p className="text-muted-foreground">{project.description}</p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {project.technologies.map((tech) => (
                    <TechBadge key={tech} tech={tech} />
                  ))}
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    View {project.type} →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageTransition>
  )
}

