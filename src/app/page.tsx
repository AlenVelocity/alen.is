import { LinkButton } from '@/components/ui/link-button'
import { PageTransition } from '@/components/ui/page-transition'
import { DiscordCopy } from '@/components/ui/discord-copy'
import { Signature } from '@/components/ui/signature'
import { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import { FiMail, FiCalendar } from 'react-icons/fi'
import { FaLinkedin, FaGithub, FaWhatsapp } from 'react-icons/fa'
import { runGetPersonalInfo, runGetSocialLinks } from '@/lib/cms-db'
import { CurrentlyListening } from './_components/CurrentlyListening'

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

const IconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
    FaEnvelope: FiMail,
    FaLinkedin,
    FaGithub,
    FaCalendarCheck: FiCalendar,
    FaWhatsapp
}

function parseTextWithLinks(text: string): React.ReactNode[] {
    const parts: React.ReactNode[] = []
    let currentIndex = 0
    const linkRegex = /\[([^\]]+)\](?:\(([^)]+)\)|\{COPY:([^}]+)\})/g
    let match
    
    while ((match = linkRegex.exec(text)) !== null) {
        const [fullMatch, linkText, url, discordUsername] = match
        const startIndex = match.index
        
        if (startIndex > currentIndex) {
            parts.push(text.slice(currentIndex, startIndex))
        }
        
        if (discordUsername) {
            parts.push(
                <DiscordCopy key={startIndex} username={discordUsername}>
                    {linkText}
                </DiscordCopy>
            )
        } else if (url) {
            parts.push(
                <LinkButton 
                    key={startIndex}
                    href={url}
                    target={url.startsWith('http') ? "_blank" : undefined}
                >
                    {linkText}
                </LinkButton>
            )
        }
        
        currentIndex = startIndex + fullMatch.length
    }
    
    if (currentIndex < text.length) {
        parts.push(text.slice(currentIndex))
    }
    
    return parts.map((part, index) => <span key={index}>{part}</span>)
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
        image: 'https://alen.is/opengraph-image',
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

    const heroSocialLinks = socialLinks.filter(link => 
        ['email', 'linkedin', 'github', 'meeting', 'whatsapp'].includes(link.id)
    )

    return (
        <PageTransition>
            <JsonLd data={personSchema} />
            <div className="container max-w-2xl py-12 md:py-20 px-4">
                {/* Hero */}
                <section className="space-y-6 mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                                {personalInfo.hero_title}
                            </h1>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        {parseTextWithLinks(personalInfo.hero_description)}
                            </p>
                    <div className="flex flex-wrap gap-2 sm:gap-3 pt-2">
                                {heroSocialLinks.map((link) => {
                                    const IconComponent = IconMap[link.icon as keyof typeof IconMap]
                                    return (
                                <a
                                            key={link.id}
                                            href={link.url}
                                            target={link.url.startsWith('http') ? "_blank" : undefined}
                                    className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium rounded-lg border border-border hover:bg-muted hover:border-foreground/20 transition-all duration-200"
                                        >
                                            {IconComponent && <IconComponent className="w-4 h-4" />}
                                    <span className="hidden sm:inline">{link.name}</span>
                                </a>
                                    )
                                })}
                    </div>
                </section>

                {/* About */}
                <section className="space-y-6 mb-16">
                    <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider border-l-2 border-accent pl-3">About</h2>
                    <div className="space-y-4 text-muted-foreground leading-relaxed">
                        <p>{parseTextWithLinks(personalInfo.about_me_paragraph_1)}</p>
                        <p>{parseTextWithLinks(personalInfo.about_me_paragraph_2)}</p>
                    </div>
                    <div className="pt-4">
                            <Signature name={personalInfo.signature_name} />
                    </div>
                </section>

                {/* Currently Listening */}
                <section className="mb-16">
                    <CurrentlyListening />
                </section>

                {/* Contact */}
                <section className="space-y-4">
                    <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider border-l-2 border-accent pl-3">Contact</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        {parseTextWithLinks(personalInfo.contact_description)}
                    </p>
                </section>
            </div>
        </PageTransition>
    )
}
