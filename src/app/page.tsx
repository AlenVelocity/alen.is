import { LinkButton } from '@/components/ui/link-button'
import { PageTransition } from '@/components/ui/page-transition'
import { DiscordCopy } from '@/components/ui/discord-copy'
import { Signature } from '@/components/ui/signature'
import { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import { FaEnvelope, FaLinkedin, FaGithub, FaCalendarCheck, FaWhatsapp } from 'react-icons/fa'
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

// Icon mapping for social links
const IconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
    FaEnvelope,
    FaLinkedin,
    FaGithub,
    FaCalendarCheck,
    FaWhatsapp
}

// Parser function to handle markdown links and special Discord syntax
function parseTextWithLinks(text: string, className: string = "text-base"): React.ReactNode[] {
    const parts: React.ReactNode[] = []
    let currentIndex = 0
    
    // Regex to match [text](url) and [text]{COPY:username}
    const linkRegex = /\[([^\]]+)\](?:\(([^)]+)\)|\{COPY:([^}]+)\})/g
    let match
    
    while ((match = linkRegex.exec(text)) !== null) {
        const [fullMatch, linkText, url, discordUsername] = match
        const startIndex = match.index
        
        // Add text before the link
        if (startIndex > currentIndex) {
            parts.push(text.slice(currentIndex, startIndex))
        }
        
        // Add the link component
        if (discordUsername) {
            // Discord copy component
            parts.push(
                <DiscordCopy key={startIndex} username={discordUsername} className={className}>
                    {linkText}
                </DiscordCopy>
            )
        } else if (url) {
            // Regular link
            const isExternal = url.startsWith('http')
            parts.push(
                <LinkButton 
                    key={startIndex}
                    href={url}
                    target={isExternal ? "_blank" : undefined}
                    className={className}
                >
                    {linkText}
                </LinkButton>
            )
        }
        
        currentIndex = startIndex + fullMatch.length
    }
    
    // Add remaining text
    if (currentIndex < text.length) {
        parts.push(text.slice(currentIndex))
    }
    
    return parts.map((part, index) => (
        <span key={index}>{part}</span>
    ))
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
                                {parseTextWithLinks(personalInfo.hero_description, "text-lg")}
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
                            {parseTextWithLinks(personalInfo.about_me_paragraph_1)}
                        </p>
                        <p>
                            {parseTextWithLinks(personalInfo.about_me_paragraph_2)}
                        </p>
                    </div>

                    <div className="flex items-center justify-between gap-4 mt-8">
                        <div className="flex justify-start">
                            <Signature name={personalInfo.signature_name} />
                        </div>
                    </div>
                </section>

                <hr className="my-8 border-muted" />

                <div className="space-y-6">
                    <CurrentlyListening />
                </div>

                <hr className="my-8 border-muted" />

                {/* Contact Section */}
                <section className="space-y-6">
                    <h2 className="text-2xl font-bold tracking-tight">Contact</h2>
                    <div className="text-muted-foreground text-base leading-relaxed">
                        {parseTextWithLinks(personalInfo.contact_description)}
                    </div>
                </section>
            </div>
        </PageTransition>
    )
}
