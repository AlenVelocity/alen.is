import { Suspense } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { LinkButton } from '@/components/ui/link-button'
import { PageTransition } from '@/components/ui/page-transition'
import { DiscordCopy } from '@/components/ui/discord-copy'
import { Signature } from '@/components/ui/signature'
import { GlitchPersonWord } from '@/components/ui/glitch-word'
import { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import { FiMail, FiCalendar, FiArrowUpRight } from 'react-icons/fi'
import { FaLinkedin, FaGithub, FaWhatsapp } from 'react-icons/fa'
import { runGetPersonalInfo, runGetSocialLinks } from '@/lib/cms-db'
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
 * The hero/about/contact content awaits the CMS directly (fast, and deduped
 * with generateMetadata via React cache) — only the Last.fm-powered "now
 * playing" section streams in behind Suspense, so the one genuinely slow
 * API call never delays the rest of the page.
 */
export default async function Home() {
    const [personalInfo, socialLinks] = await Promise.all([runGetPersonalInfo(), runGetSocialLinks()])
    const recentPosts = getAllPosts().slice(0, 3)

    const personSchema = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        // meta_title is "Alen.is" — the site, not the person. Naming the Person
        // after the domain is what leaves Google unsure who the page is about.
        name: 'Alen Yohannan',
        alternateName: 'Alen',
        url: 'https://alen.is/',
        image: 'https://alen.is/opengraph-image',
        jobTitle: personalInfo.job_title,
        // company is blank in the CMS more often than not — an Organization with
        // an empty name is worse than no employer at all
        ...(personalInfo.company && { worksFor: { '@type': 'Organization', name: personalInfo.company } }),
        sameAs: [
            'https://github.com/AlenVelocity',
            'https://www.linkedin.com/in/alen-%F0%9F%8E%B6-yohannan-6794a81ba/'
        ],
        knowsAbout: personalInfo.skills
    }

    // Drives the site name Google prints above the result — without it the
    // crawler guesses one from the <title>, which is how you end up with
    // "Alen's Personal Website" sitting where "alen.is" should be.
    const siteSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'alen.is',
        alternateName: ['Alen.is', 'Alen Yohannan'],
        url: 'https://alen.is/',
        description: personalInfo.meta_description,
        publisher: { '@type': 'Person', name: 'Alen Yohannan', url: 'https://alen.is/' }
    }

    const heroSocialLinks = socialLinks.filter((link) =>
        ['email', 'linkedin', 'github', 'meeting', 'whatsapp'].includes(link.id)
    )

    return (
        <PageTransition>
            <JsonLd data={siteSchema} />
            <JsonLd data={personSchema} />
            <div className="container max-w-2xl py-12 md:py-20 px-4">
                {/* ── Hero ─────────────────────────────────────────── */}
                <section className="mb-20">
                    {/* Eyebrow */}
                    <p
                        className="mono-label text-muted-foreground/60 mb-6 animate-fade-in-up opacity-0 stagger-1"
                        style={{ animationFillMode: 'forwards' }}
                    >
                        engineer · builder · <GlitchPersonWord />
                    </p>

                    {/* Display heading */}
                    <h1
                        className="text-display text-5xl sm:text-6xl md:text-7xl leading-[1.02] mb-8 animate-fade-in-up opacity-0 stagger-2"
                        style={{ animationFillMode: 'forwards' }}
                    >
                        {personalInfo.hero_title}
                    </h1>

                    {/* Description */}
                    <p
                        className="text-base text-muted-foreground leading-relaxed max-w-lg mb-10 animate-fade-in-up opacity-0 stagger-3"
                        style={{ animationFillMode: 'forwards' }}
                    >
                        {parseTextWithLinks(personalInfo.hero_description)}
                    </p>

                    {/* Social links */}
                    <div
                        className="flex flex-wrap gap-1 animate-fade-in-up opacity-0 stagger-4"
                        style={{ animationFillMode: 'forwards' }}
                    >
                        {heroSocialLinks.map((link, i) => {
                            const IconComponent = IconMap[link.icon as keyof typeof IconMap]
                            return (
                                <a
                                    key={link.id}
                                    href={link.url}
                                    target={link.url.startsWith('http') ? '_blank' : undefined}
                                    className="group inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono-ui text-muted-foreground border border-border/40 hover:border-accent/50 hover:text-accent hover:bg-accent/5 hover:shadow-[0_0_12px_hsl(var(--accent)/0.15)] transition-all duration-200 rounded-sm"
                                >
                                    {IconComponent && <IconComponent className="w-3 h-3 shrink-0" />}
                                    <span className="hidden sm:inline">{link.name}</span>
                                    <span className="text-accent/40 group-hover:text-accent group-hover:glow-text transition-colors duration-200 ml-0.5">
                                        →
                                    </span>
                                </a>
                            )
                        })}
                    </div>
                </section>

                {/* ── About ────────────────────────────────────────── */}
                <section className="mb-20">
                    <div
                        className="section-label mb-6 animate-fade-in-up opacity-0 stagger-4"
                        style={{ animationFillMode: 'forwards' }}
                    >
                        about
                    </div>
                    <div
                        className="space-y-4 text-muted-foreground leading-relaxed text-[0.925rem] animate-fade-in-up opacity-0 stagger-5"
                        style={{ animationFillMode: 'forwards' }}
                    >
                        <p>{parseTextWithLinks(personalInfo.about_me_paragraph_1)}</p>
                        <p>{parseTextWithLinks(personalInfo.about_me_paragraph_2)}</p>
                    </div>
                    <div
                        className="pt-6 animate-fade-in-up opacity-0 stagger-6"
                        style={{ animationFillMode: 'forwards' }}
                    >
                        <Signature name={personalInfo.signature_name} />
                    </div>
                </section>

                {/* ── Currently Listening — the only streamed section ── */}
                <section className="mb-20">
                    <div className="section-label mb-5">now playing</div>
                    <Suspense fallback={<CurrentlyListeningSkeleton />}>
                        <CurrentlyListening />
                    </Suspense>
                </section>

                {/* ── Recent Blogs ────────────────────────────────── */}
                {recentPosts.length > 0 && (
                    <section className="mb-20">
                        <div className="flex items-center justify-between mb-5">
                            <div className="section-label">recent writing</div>
                            <Link
                                href="/writing"
                                className="mono-label text-muted-foreground/50 hover:text-accent transition-colors"
                            >
                                all posts →
                            </Link>
                        </div>
                        <div>
                            {recentPosts.map((post) => (
                                <Link
                                    key={post.slug}
                                    href={`/writing/about/${post.slug}`}
                                    className="group flex items-center gap-4 py-3.5 border-b border-dashed border-border/50 last:border-b-0 hover:border-accent/40 transition-all duration-200"
                                >
                                    <div className="flex-1 min-w-0">
                                        <p className="font-mono-ui text-sm font-medium truncate group-hover:text-accent transition-colors">
                                            {post.title}
                                        </p>
                                        <p className="mono-label text-muted-foreground/40 mt-0.5">
                                            {format(new Date(post.date), 'MMM d, yyyy')}
                                            <span className="mx-1.5">·</span>
                                            {post.readingMinutes} min read
                                        </p>
                                    </div>
                                    <FiArrowUpRight className="w-3.5 h-3.5 text-muted-foreground/25 group-hover:text-accent shrink-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* ── Contact ──────────────────────────────────────── */}
                <section className="mb-4">
                    <div className="section-label mb-5">contact</div>
                    <p className="text-muted-foreground text-[0.925rem] leading-relaxed">
                        {parseTextWithLinks(personalInfo.contact_description)}
                    </p>
                </section>
            </div>
        </PageTransition>
    )
}
