import { LinkButton } from '@/components/ui/link-button'
import { PageTransition } from '@/components/ui/page-transition'
import { FaBriefcase, FaCalendarAlt, FaMapMarkerAlt, FaBuilding } from 'react-icons/fa'
import { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'

export const metadata: Metadata = {
    title: 'Experience',
    description: 'My professional experience so far',
    openGraph: {
        title: 'Experience',
        description: 'My professional experience so far',
        url: 'https://alen.is/experience'
    },
    alternates: {
        canonical: '/experience'
    }
}

export default function Experience() {
    const experiences = [
        {
            company: 'Frappe',
            position: 'Software Engineer',
            period: 'November 2024 - Present',
            location: 'Remote, Mumbai, India',
            description: [
                'Worked on Frappe Cloud, primarily on the infrastructure automation and managing AWS infrastructure.',
                'Added support for provisioning custom Domains, email, and DNS configurations.',
                'User experience improvements for developers using Frappe Cloud and Frappe Framework.'
            ]
        },
        {
            company: 'xAGI',
            position: 'Software Development Engineer',
            location: 'Remote, Bangalore, India',
            period: 'April 2024 - Nov 2024',
            description: [
                'Built a dynamic AI Agent Platform and an AI Course Generation Platform',
                'Spearheaded infrastructure for deploying multiple edge apps on various providers',
                'Built Multiple AI Web apps including an AI voice survey platform',
                'Developed AI agents for various clients from the ground up'
            ]
        },
        {
            company: 'Plazza',
            position: 'Software Engineer',
            location: 'Remote, Bangalore, India',
            period: 'May 2024 - Nov 2024',
            description: [
                "Built the first version of Plazza's Quick Commerce system",
                'Designed and developed a Whatsapp Bot based medicine delivery system for the APR region',
                'Implemented infrastructure and backend solutions for Plazza',
                'Designed and developed various microservices using NestJS, RabbitMQ, and PostgreSQL',
                'Utilized AWS services including EC2, EKS, Amazon MQ, and RDS for robust and scalable cloud infrastructure'
            ]
        },
        {
            company: 'EquivoxAI',
            position: 'Founding Software Engineer - AI',
            location: 'Remote, Melbourne, Australia',
            period: 'May 2023 - Jan 2024',
            description: [
                'Developed and implemented dataset parsing algorithms to be used as LoRA training data for LLMs such as Vicuna-13b and LLaMa-2-7b',
                'Implemented methods to streamline fine-tuning of diffusion models on human faces',
                'Built highly interactive AI-first chat playground/chat UIs'
            ]
        },
        {
            company: 'DataEquinox',
            position: 'Software Development Engineer',
            location: 'Remote, Kochi, India',
            period: 'Dec 2021 - Sep 2022',
            description: [
                'Designed and developed CRM web apps by piecing together multiple different feedback and customer sources/portals',
                'Created proofs of concept for multi-threaded solutions for Node based Backends',
                'Collaborated with multiple teams of over 7 members'
            ]
        },
        {
            company: 'Synthesized Infinity',
            position: 'Founder',
            location: 'Remote',
            period: 'July 2020 - Present',
            description: [
                'Managed multiple development teams with over 10 people',
                "Created organization's mission and vision statements for use by the members",
                'Built and contributed to 12+ OSS Projects',
                'Conducted lessons on NodeJS and TypeScript for the members of the community'
            ]
        }
    ]

    const experienceSchema = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: experiences.map((experience, index) => ({
            '@type': 'WorkExperience',
            position: index + 1,
            name: experience.position,
            description: experience.description.join('. '),
            worksFor: {
                '@type': 'Organization',
                name: experience.company
            },
            startDate: experience.period.split(' - ')[0],
            endDate: experience.period.split(' - ')[1] || 'Present',
            jobLocation: {
                '@type': 'Place',
                address: experience.location
            }
        }))
    }

    return (
        <PageTransition>
            <JsonLd data={experienceSchema} />
            <div className="container py-12 max-w-4xl">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">Experience</h1>
                    <LinkButton href="/Alen-Resume.pdf" target="_blank">
                        View Resume
                    </LinkButton>
                </div>
                <div className="space-y-8">
                    {experiences.map((experience, index) => (
                        <div key={index} className="pb-6">
                            <div className="space-y-2">
                                <h2 className="text-xl font-semibold flex items-center gap-2">{experience.company}</h2>
                                <div className="flex items-center text-lg font-medium">{experience.position}</div>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">{experience.period}</span>
                                    <span className="flex items-center gap-1">
                                        <FaMapMarkerAlt className="text-muted-foreground" />
                                        {experience.location}
                                    </span>
                                </div>
                                <ul className="list-disc pl-5 text-muted-foreground space-y-1 pt-2">
                                    {experience.description.map((item, i) => (
                                        <li key={i}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </PageTransition>
    )
}
