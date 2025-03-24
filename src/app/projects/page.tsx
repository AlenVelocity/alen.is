import { PageTransition } from "@/components/ui/page-transition"

export default function Projects() {
  const projects = [
    {
      title: "Press",
      period: "December 2024",
      description: "Worked on Frappe/Press, Bare Metal Providder integration",
      link: "https://github.com/frappe/press",
      type: "GitHub"
    },
    {
      title: "Kalidokit",
      period: "November 2021",
      description: "Blendshape and kinematics solver for Mediapipe/Tensorflow.js face, eyes, pose, and hand tracking models",
      link: "https://www.npmjs.com/package/kalidokit",
      type: "NPM"
    },
    {
      title: "Wa-Sticker-Formatter",
      period: "March 2021",
      description: "WhatsApp sticker creator for Node. Built webp parsers for images and videos with editable exif metadata",
      link: "https://www.npmjs.com/package/wa-sticker-formatter",
      type: "NPM"
    },
    {
      title: "Valdle",
      period: "October 2024",
      description: "Worked with Paragon w/ official Valorant Discord to create a Valorant arcade game for the web",
      link: "https://valdle.com",
      type: "Website"
    },
    {
      title: "OWCSLE",
      period: "April 2024",
      description: "Overwatch Championship Series League Esports Arcade Game",
      link: "https://owcsle.com",
      type: "Website"
    },
    {
      title: "Langchain-Llama/Vicuna-TS",
      period: "April 2023",
      description: "Llama LLM compatibility for Langchain NodeJS",
      link: "https://github.com/AlenVelocity/langchain-llama",
      type: "GitHub"
    },
    {
      title: "Auerolin",
      period: "November 2021",
      description: "Superfast TS Web Framework for Node. Utilized Reflect metadata's decorators to allow users to easily create APIs and platforms",
      link: "https://github.com/AlenVelocity/auerolin",
      type: "GitHub"
    },
    {
      title: "Infinity",
      period: "July 2020",
      description: "First ever utility WhatsApp Bot",
      link: "https://alen.infinity.is",
      type: "Website"
    },
    {
      title: "Gyan.Pro",
      period: "March 2024",
      description: "AI Voice Note Taking app built with Llama3-8b GROQ and OAI Embeddings",
      link: "https://gyan.pro",
      type: "Website"
    },
  ]

  return (
    <PageTransition>
      <div className="container py-12">
        <h1 className="text-3xl font-bold tracking-tight mb-8">Projects</h1>
        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project, index) => (
            <div key={index} className="group relative rounded-lg border p-6 hover:border-foreground transition-colors">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">{project.title}</h2>
                  <span className="text-sm text-muted-foreground">{project.period}</span>
                </div>
                <p className="text-muted-foreground">{project.description}</p>
                <div className="flex items-center gap-2">
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

