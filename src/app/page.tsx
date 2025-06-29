import { LinkButton } from '@/components/ui/link-button'
import { PageTransition } from '@/components/ui/page-transition'
import { DiscordCopy } from '@/components/ui/discord-copy'
import { Signature } from '@/components/ui/signature'
import { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import { FaEnvelope, FaLinkedin, FaGithub, FaCalendarCheck, FaWhatsapp } from 'react-icons/fa'
import { runGetPersonalInfo, runGetSocialLinks } from '@/lib/cms-db'

export async function generateMetadata(): Promise<Metadata> {
    const personalInfo = await runGetPersonalInfo()
    
    return {
        title: personalInfo.meta_title,
        description: personalInfo.meta_description,
        openGraph: {
            title: personalInfo.meta_title,
            description: personalInfo.meta_description,
            url: 'https://alen.is'
        },
        alternates: {
            canonical: '/'
        }
    }
}

// Icon mapping for social links
const IconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
    FaEnvelope,
    FaLinkedin,
    FaGithub,
    FaCalendarCheck,
    FaWhatsapp
}

export default async function Home() {
    const [personalInfo, socialLinks] = await Promise.all([
        runGetPersonalInfo(),
        runGetSocialLinks()
    ])

    const personSchema = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: personalInfo.meta_title,
        url: 'https://alen.is',
        image: 'https://alen.is/og.jpg',
        jobTitle: personalInfo.job_title,
        worksFor: {
            '@type': 'Organization',
            name: personalInfo.company
        },
        sameAs: [
            'https://github.com/AlenVelocity',
            'https://www.linkedin.com/in/alen-%F0%9F%8E%B6-yohannan-6794a81ba/'
        ],
        knowsAbout: personalInfo.skills
    }

    // Filter social links for hero section (first 4)
    const heroSocialLinks = socialLinks.filter(link => 
        ['email', 'linkedin', 'github', 'meeting'].includes(link.id)
    )

    return (
        <PageTransition>
            <JsonLd data={personSchema} />
            <div className="container mx-auto max-w-4xl px-4 py-8">
                {/* Hero Section */}
                <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-16">
                    <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between">
                        <div className="flex-1 space-y-4">
                            <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl lg:leading-[1.1]">
                                {personalInfo.hero_title}
                            </h1>
                            <p className="max-w-[700px] text-lg text-muted-foreground">
                                {personalInfo.hero_description.split('cool').map((part, index, array) => (
                                    <span key={index}>
                                        {part}
                                        {index < array.length - 1 && (
                                            <LinkButton href="/cool" className="text-lg">
                                                cool
                                            </LinkButton>
                                        )}
                                    </span>
                                ))}
                            </p>
                            <div className="flex flex-wrap gap-4">
                                {heroSocialLinks.map((link) => {
                                    const IconComponent = IconMap[link.icon as keyof typeof IconMap]
                                    return (
                                        <LinkButton 
                                            key={link.id}
                                            href={link.url}
                                            target={link.url.startsWith('http') ? "_blank" : undefined}
                                            className="flex items-center gap-2"
                                        >
                                            {IconComponent && <IconComponent className="w-4 h-4" />}
                                            {link.name}
                                        </LinkButton>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </section>

                <hr className="my-8 border-muted" />

                {/* About Section */}
                <section className="space-y-6">
                    <h2 className="text-2xl font-bold tracking-tight">About Me</h2>
                    
                    <div className="space-y-4 text-muted-foreground text-base leading-relaxed">
                        <p>
                            {personalInfo.about_me_paragraph_1
                                .replace(/Frappe/g, '|||Frappe|||')
                                .replace(/FC/g, '|||FC|||')
                                .split('|||')
                                .map((part, index) => {
                                    switch (part) {
                                        case 'Frappe':
                                            return (
                                                <LinkButton
                                                    key={index}
                                                    href="https://frappe.io"
                                                    target="_blank"
                                                    className="text-base"
                                                >
                                                    Frappe
                                                </LinkButton>
                                            )
                                        case 'FC':
                                            return (
                                                <LinkButton
                                                    key={index}
                                                    href="https://frappe.cloud"
                                                    target="_blank"
                                                    className="text-base"
                                                >
                                                    FC
                                                </LinkButton>
                                            )
                                        default:
                                            return part
                                    }
                                })}
                        </p>
                        <p>
                            {personalInfo.about_me_paragraph_2
                                .replace(/JRPG/g, '|||JRPG|||')
                                .replace(/Overwatch/g, '|||Overwatch|||')
                                .replace(/listening/g, '|||listening|||')
                                .replace(/sumika/g, '|||sumika|||')
                                .replace(/Final Fantasy 7 Remake Trilogy/g, '|||Final Fantasy 7 Remake Trilogy|||')
                                .split('|||')
                                .map((part, index) => {
                                    switch (part) {
                                        case 'JRPG':
                                            return (
                                                <LinkButton
                                                    key={index}
                                                    href="https://en.wikipedia.org/wiki/Role-playing_video_game#Japanese_role-playing_games"
                                                    target="_blank"
                                                    className="text-base"
                                                >
                                                    JRPG
                                                </LinkButton>
                                            )
                                        case 'Overwatch':
                                            return (
                                                <LinkButton key={index} href="https://overwatch.blizzard.com" target="_blank" className="text-base">
                                                    Overwatch
                                                </LinkButton>
                                            )
                                        case 'listening':
                                            return (
                                                <LinkButton key={index} href="/listening" className="text-base">
                                                    listening
                                                </LinkButton>
                                            )
                                        case 'sumika':
                                            return (
                                                <LinkButton
                                                    key={index}
                                                    href="https://en.wikipedia.org/wiki/Sumika_(band)"
                                                    target="_blank"
                                                    className="text-base"
                                                >
                                                    sumika
                                                </LinkButton>
                                            )
                                        case 'Final Fantasy 7 Remake Trilogy':
                                            return (
                                                <LinkButton key={index} href="https://en.wikipedia.org/wiki/Final_Fantasy_VII" target="_blank" className="text-base">
                                                    Final Fantasy 7 Remake Trilogy
                                                </LinkButton>
                                            )
                                        default:
                                            return <span key={index}>{part}</span>
                                    }
                                })}
                        </p>
                    </div>

                    <div className="flex items-center justify-between gap-4 mt-8">
                        <div className="flex justify-start">
                            <Signature name={personalInfo.signature_name} />
                        </div>
                    </div>
                </section>

                <hr className="my-8 border-muted" />

                {/* Contact Section */}
                <section className="space-y-6">
                    <h2 className="text-2xl font-bold tracking-tight">Contact</h2>
                    <div className="text-muted-foreground text-base leading-relaxed">
                        {personalInfo.contact_description
                            .replace(/Whatsapp/g, '|||Whatsapp|||')
                            .replace(/Discord/g, '|||Discord|||')
                            .replace(/email/g, '|||email|||')
                            .replace(/schedule a meeting/g, '|||schedule a meeting|||')
                            .split('|||')
                            .map((part, index) => {
                                const whatsappLink = socialLinks.find(link => link.id === 'whatsapp')
                                const emailLink = socialLinks.find(link => link.id === 'email')
                                const meetingLink = socialLinks.find(link => link.id === 'meeting')
                                
                                switch (part) {
                                    case 'Whatsapp':
                                        return whatsappLink ? (
                                            <LinkButton 
                                                key={index}
                                                href={whatsappLink.url} 
                                                target="_blank" 
                                                className="text-base"
                                            >
                                                Whatsapp
                                            </LinkButton>
                                        ) : <span key={index}>Whatsapp</span>
                                    case 'Discord':
                                        return (
                                            <DiscordCopy key={index} username="notalen" className="text-base">
                                                Discord
                                            </DiscordCopy>
                                        )
                                    case 'email':
                                        return emailLink ? (
                                            <LinkButton 
                                                key={index}
                                                href={emailLink.url} 
                                                className="text-base"
                                            >
                                                email
                                            </LinkButton>
                                        ) : <span key={index}>email</span>
                                    case 'schedule a meeting':
                                        return meetingLink ? (
                                            <LinkButton 
                                                key={index}
                                                href={meetingLink.url} 
                                                className="text-base"
                                            >
                                                schedule a meeting
                                            </LinkButton>
                                        ) : <span key={index}>schedule a meeting</span>
                                    default:
                                        return <span key={index}>{part}</span>
                                }
                            })}
                    </div>
                </section>
            </div>
        </PageTransition>
    )
}
