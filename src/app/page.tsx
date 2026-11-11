import { Suspense } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { LinkButton } from '@/components/ui/link-button'
import { PageTransition } from '@/components/ui/page-transition'
import { DiscordCopy } from '@/components/ui/discord-copy'
import { Signature } from '@/components/ui/signature'
import { GlitchPersonWord } from '@/components/ui/glitch-word'
import { Persona } from '@/components/persona'
import { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import { FiMail, FiCalendar } from 'react-icons/fi'
import { FaLinkedin, FaGithub, FaWhatsapp } from 'react-icons/fa'
import { runGetPersonalInfo, runGetSocialLinks } from '@/lib/cms-db'
import { asBanPersonalInfo } from '@/lib/ban-content'
import { getAllPosts } from '@/lib/blog'
import { CurrentlyListening, CurrentlyListeningSkeleton } from './_components/CurrentlyListening'

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
        alternates: { canonical: '/' }
    }
}

const IconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
    FaEnvelope: FiMail,
    FaLinkedin,
    FaGithub,
    FaCalendarCheck: FiCalendar,
    FaWhatsapp
}

/** The hero links Ban has his own name for, by social link id (DESIGN.md section 9) */
const BAN_LINK_NAMES: Record<string, string> = {
    meeting: 'A word'
}

function parseTextWithLinks(text: string): React.ReactNode[] {
    const parts: React.ReactNode[] = []
    let currentIndex = 0
    const linkRegex = /\[([^\]]+)\](?:\(([^)]+)\)|\{COPY:([^}]+)\})/g
    let match

    while ((match = linkRegex.exec(text)) !== null) {
        const [fullMatch, linkText, url, discordUsername] = match
        const startIndex = match.index
        if (startIndex > currentIndex) parts.push(text.slice(currentIndex, startIndex))
        if (discordUsername) {
            parts.push(
                <DiscordCopy key={startIndex} username={discordUsername}>
                    {linkText}
                </DiscordCopy>
            )
        } else if (url) {
            parts.push(
                <LinkButton key={startIndex} href={url} target={url.startsWith('http') ? '_blank' : undefined}>
                    {linkText}
                </LinkButton>
            )
        }
        currentIndex = startIndex + fullMatch.length
    }
    if (currentIndex < text.length) parts.push(text.slice(currentIndex))
    return parts.map((part, index) => <span key={index}>{part}</span>)
}

/**
 * Ban's hero title crosses a name out: "I'm ~~Alen~~ Ban." in his
 * personal-info.json. The word between the tildes gets his mark (.struck).
 */
function withStrikes(text: string): React.ReactNode[] {
    return text.split(/~~(.+?)~~/g).map((part, index) =>
        index % 2 === 1 ? (
            <span key={index} className="struck">
                {part}
            </span>
        ) : (
            part
        )
    )
}

/**
 * The hero, about and contact text await the CMS directly (fast, and deduped
 * with generateMetadata via React cache). Only the Last.fm "now playing"
 * section streams in behind Suspense, so the one slow API call never holds up
 * the rest of the page.
 *
 * The page has one entrance: PageTransition's on a direct load, the saucer's
 * beam (or Ban's redaction) after an in-site navigation. Nothing inside it
 * fades in on its own, so nothing can be left waiting at opacity 0.
 */
export default async function Home() {
    const [personalInfo, socialLinks] = await Promise.all([runGetPersonalInfo(), runGetSocialLinks()])
    const banInfo = asBanPersonalInfo(personalInfo)
    const recentPosts = getAllPosts().slice(0, 3)

    // Structured data stays Alen's, like the metadata: crawlers never meet Ban
    const personSchema = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: personalInfo.meta_title,
        url: 'https://alen.is',
        image: 'https://alen.is/opengraph-image',
        jobTitle: personalInfo.job_title,
        worksFor: { '@type': 'Organization', name: personalInfo.company },
        sameAs: [
            'https://github.com/AlenVelocity',
            'https://www.linkedin.com/in/alen-%F0%9F%8E%B6-yohannan-6794a81ba/'
        ],
        knowsAbout: personalInfo.skills
    }

    const heroSocialLinks = socialLinks.filter((link) =>
        ['email', 'linkedin', 'github', 'meeting', 'whatsapp'].includes(link.id)
    )

    return (
        <PageTransition>
            <JsonLd data={personSchema} />
            <div className="container max-w-3xl py-12 md:py-16 px-4">
                {/* ── Hero ─────────────────────────────────────────── */}
                <section className="mb-20">
                    {/* Eyebrow. Alen's last word turns alien on hover; Ban has no alien in him */}
                    <p className="mono-label text-muted-foreground/60 mb-6">
                        <Persona
                            alen={
                                <>
                                    engineer · builder · <GlitchPersonWord />
                                </>
                            }
                            ban="Engineer. Builder. Person of interest."
                        />
                    </p>

                    {/* Display heading */}
                    <h1 className="text-display text-5xl sm:text-6xl md:text-7xl leading-[1.02] mb-8">
                        <Persona alen={personalInfo.hero_title} ban={withStrikes(banInfo.hero_title)} />
                    </h1>

                    {/* Description */}
                    <p className="text-base text-muted-foreground leading-relaxed max-w-lg mb-10">
                        <Persona
                            alen={parseTextWithLinks(personalInfo.hero_description)}
                            ban={parseTextWithLinks(banInfo.hero_description)}
                        />
                    </p>

                    {/* Social links: plain text, a static mark on the ones that leave the site */}
                    <div className="flex flex-wrap gap-x-5 gap-y-2">
                        {heroSocialLinks.map((link) => {
                            const IconComponent = IconMap[link.icon as keyof typeof IconMap]
                            const external = link.url.startsWith('http')
                            const banName = BAN_LINK_NAMES[link.id]
                            return (
                                <a
                                    key={link.id}
                                    href={link.url}
                                    target={external ? '_blank' : undefined}
                                    rel={external ? 'noopener noreferrer' : undefined}
                                    className="inline-flex items-center gap-1.5 text-xs font-mono-ui text-muted-foreground hover:text-accent transition-colors duration-200"
                                >
                                    {IconComponent && <IconComponent className="w-3 h-3 shrink-0" />}
                                    {banName ? <Persona alen={link.name} ban={banName} /> : link.name}
                                    {external && <span className="text-muted-foreground/40">↗</span>}
                                </a>
                            )
                        })}
                    </div>
                </section>

                {/* ── About ────────────────────────────────────────── */}
                <section className="mb-20">
                    <div className="section-label mb-6">
                        <Persona alen="about" ban="the accused" />
                    </div>
                    <div className="space-y-4 text-muted-foreground leading-relaxed text-[0.925rem]">
                        <p>
                            <Persona
                                alen={parseTextWithLinks(personalInfo.about_me_paragraph_1)}
                                ban={parseTextWithLinks(banInfo.about_me_paragraph_1)}
                            />
                        </p>
                        <p>
                            <Persona
                                alen={parseTextWithLinks(personalInfo.about_me_paragraph_2)}
                                ban={parseTextWithLinks(banInfo.about_me_paragraph_2)}
                            />
                        </p>
                    </div>
                    <div className="pt-6">
                        <Signature name={personalInfo.signature_name} banName={banInfo.signature_name} />
                    </div>
                </section>

                {/* ── Listening: the only streamed section. It brings its own <section> and
                    label, so when Last.fm has nothing the whole block is absent ── */}
                <Suspense fallback={<CurrentlyListeningSkeleton />}>
                    <CurrentlyListening />
                </Suspense>

                {/* ── Recent posts ─────────────────────────────────── */}
                {recentPosts.length > 0 && (
                    <section className="mb-20">
                        <div className="flex items-center justify-between mb-5">
                            <div className="section-label">
                                <Persona alen="recent writing" ban="recent statements" />
                            </div>
                            <Link
                                href="/writing"
                                className="mono-label text-muted-foreground/50 hover:text-accent transition-colors duration-200"
                            >
                                <Persona alen="all posts" ban="all statements" />
                            </Link>
                        </div>
                        <div>
                            {recentPosts.map((post) => (
                                <Link
                                    key={post.slug}
                                    href={`/writing/about/${post.slug}`}
                                    className="group flex items-center gap-4 py-3.5 border-b border-dashed border-border/50 last:border-b-0"
                                >
                                    <div className="flex-1 min-w-0">
                                        <p className="font-mono-ui text-sm font-medium truncate group-hover:text-accent transition-colors duration-200">
                                            {post.title}
                                        </p>
                                        <p className="mono-label text-muted-foreground/40 mt-0.5">
                                            {format(new Date(post.date), 'MMM d, yyyy')}
                                            <span className="mx-1.5">·</span>
                                            {post.readingMinutes} min read
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* ── Contact ──────────────────────────────────────── */}
                <section className="mb-4">
                    <div className="section-label mb-5">
                        <Persona alen="contact" ban="where to find me" />
                    </div>
                    <p className="text-muted-foreground text-[0.925rem] leading-relaxed">
                        <Persona
                            alen={parseTextWithLinks(personalInfo.contact_description)}
                            ban={parseTextWithLinks(banInfo.contact_description)}
                        />
                    </p>
                </section>
            </div>
        </PageTransition>
    )
}
