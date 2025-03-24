import { LinkButton } from "@/components/ui/link-button"
import { PageTransition } from "@/components/ui/page-transition"

export default function Home() {
  return (
    <PageTransition>
      <div className="container py-12">
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-16">
          <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between">
            <div className="flex-1 space-y-4">
              <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl lg:leading-[1.1]">
                Hi, I'm Alen
              </h1>
              <h2 className="text-xl text-muted-foreground md:text-2xl">Full Stack Developer</h2>
              <p className="max-w-[700px] text-lg text-muted-foreground">
                I build accessible, responsive, and performant web applications with modern technologies, specializing in AI, LLMs, and cloud infrastructure.
              </p>
              <div className="flex gap-4">
                <LinkButton href="/experience">View Experience</LinkButton>
                <LinkButton href="/projects">View Projects</LinkButton>
              </div>
            </div>
          </div>
        </section>

        <hr className="my-8 border-muted" />

        <section className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight">About Me</h2>
          <p className="text-muted-foreground">
            I'm a passionate developer with over 5 years of experience building web applications and AI solutions. I specialize in React, Next.js, Node.js, and AI technologies, with a focus on creating clean, accessible, and performant user interfaces.
          </p>
          <p className="text-muted-foreground">
            Currently working as an Engineer at Frappe, leading AWS Bare Metal Migration and providing L2 Support for Frappe Cloud. Previously worked on AI platforms at xAGI and Plazza, where I built dynamic AI Agent Platforms and Quick Commerce systems.
          </p>
        </section>

        <hr className="my-8 border-muted" />

        <section className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight">Contact</h2>
          <div className="space-y-2 text-muted-foreground">
            <p>📍 Kochi, Kerala, India</p>
            <p>📱 +91 90741-61917</p>
            <div className="flex gap-4">
              <LinkButton href="mailto:alenyohannan71@gmail.com">Email</LinkButton>
              <LinkButton href="https://www.linkedin.com/in/alen-%F0%9F%8E%B6-yohannan-6794a81ba/" target="_blank">LinkedIn</LinkButton>
              <LinkButton href="https://github.com/AlenVelocity" target="_blank">GitHub</LinkButton>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  )
}

