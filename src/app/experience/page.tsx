import { PageTransition } from "@/components/ui/page-transition"

export default function Experience() {
  const experiences = [
    {
      title: "Engineer",
      company: "Frappe",
      location: "Remote, Mumbai, India",
      period: "November 2024 - Present",
      description: [
        "Leading the AWS - Bare Metal Migration for Frappe Cloud",
        "L2 Support for Frappe Cloud"
      ]
    },
    {
      title: "Software Development Engineer",
      company: "xAGI",
      location: "Remote, Bangalore, India",
      period: "April 2024 - Nov 2024",
      description: [
        "Built a dynamic AI Agent Platform and an AI Course Generation Platform",
        "Spearheaded infrastructure for deploying multiple edge apps on various providers",
        "Built Multiple AI Web apps including an AI voice survey platform",
        "Developed AI agents for various clients from the ground up"
      ]
    },
    {
      title: "Software Engineer",
      company: "Plazza",
      location: "Remote, Bangalore, India",
      period: "May 2024 - Nov 2024",
      description: [
        "Built the first version of Plazza's Quick Commerce system",
        "Designed and developed a Whatsapp Bot based medicine delivery system for the APR region",
        "Implemented infrastructure and backend solutions for Plazza",
        "Designed and developed various microservices using NestJS, RabbitMQ, and PostgreSQL",
        "Utilized AWS services including EC2, EKS, Amazon MQ, and RDS for robust and scalable cloud infrastructure"
      ]
    },
    {
      title: "Founding Software Engineer - AI",
      company: "EquivoxAI",
      location: "Remote, Melbourne, Australia",
      period: "May 2023 - Jan 2024",
      description: [
        "Developed and implemented dataset parsing algorithms to be used as LoRA training data for LLMs such as Vicuna-13b and LLaMa-2-7b",
        "Implemented methods to streamline fine-tuning of diffusion models on human faces",
        "Built highly interactive AI-first chat playground/chat UIs"
      ]
    },
    {
      title: "Software Development Engineer",
      company: "DataEquinox",
      location: "Remote, Kochi, India",
      period: "Dec 2021 - Sep 2022",
      description: [
        "Designed and developed CRM web apps by piecing together multiple different feedback and customer sources/portals",
        "Created proofs of concept for multi-threaded solutions for Node based Backends",
        "Collaborated with multiple teams of over 7 members"
      ]
    },
    {
      title: "Founder",
      company: "Synthesized Infinity",
      location: "Remote",
      period: "July 2020 - Present",
      description: [
        "Managed multiple development teams with over 10 people",
        "Created organization's mission and vision statements for use by the members",
        "Built and contributed to 12+ OSS Projects",
        "Conducted lessons on NodeJS and TypeScript for the members of the community"
      ]
    }
  ]

  return (
    <PageTransition>
      <div className="container py-12">
        <h1 className="text-3xl font-bold tracking-tight mb-8">Professional Experience</h1>
        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <div key={index} className="space-y-2">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{exp.title}</h2>
                  <p className="text-muted-foreground">{exp.company}</p>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>{exp.location}</p>
                  <p>{exp.period}</p>
                </div>
              </div>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                {exp.description.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </PageTransition>
  )
}

