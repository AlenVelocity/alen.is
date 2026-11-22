import { Suspense } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { LinkButton } from '@/components/ui/link-button'
import { PageTransition } from '@/components/ui/page-transition'
import { DiscordCopy } from '@/components/ui/discord-copy'
import { Signature } from '@/components/ui/signature'
import { GlitchPersonWord } from '@/components/ui/glitch-word'
import { HeroSaucer } from '@/components/ui/hero-saucer'
import { BanStamp } from '@/components/ui/ban-stamp'
import { Translate } from '@/components/ui/translate'
import { Persona, OnlyAlen, OnlyBan } from '@/components/persona'
import { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import { TbMail, TbBrandLinkedin, TbBrandGithub, TbCalendar, TbBrandWhatsapp, TbArrowUpRight } from 'react-icons/tb'
import { AlienGlyph } from '@/components/ui/alien-script'
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

// The CMS names icons by their old Font Awesome names. All five are drawn from
// one set here (Tabler, outlined), so the row is one weight and one style.
const IconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
    FaEnvelope: TbMail,
    FaLinkedin: TbBrandLinkedin,
    FaGithub: TbBrandGithub,
    FaCalendarCheck: TbCalendar,
    FaWhatsapp: TbBrandWhatsapp
}

/** "Alen", the way he would write it. Sits under the handwritten one. */
const NAME_IN_SCRIPT = [6, 11, 1, 3]

/** The hero links Ban has his own name for, by social link id (DESIGN.md, "What Ban calls the pages") */
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
            // Crossed out by hand, and drawn across as the page arrives
            <span key={index} className="struck-drawn">
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
 * beam (or Ban's redaction) after an in-site navigation. The one thing inside
 * it that moves on arrival is Alen's name turning from his script into
 * English, and that is CSS over text that is already there, so nothing can be
 * left waiting at opacity 0.
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
                {/* ── Hero ───────────────────────────────────────────
                    Alen's has the ship in it, top right, with the links hanging in
                    its beam from md up. Ban has no ship. His is a masthead: a rule,
                    the name he crossed out, his stamp across the corner, and the
                    links in a row. The layout for both is in globals.css under
                    .hero, keyed on who is in. */}
                <section className="hero relative mb-20">
                    <OnlyAlen as="div">
                        <HeroSaucer />
                    </OnlyAlen>
                    <OnlyBan as="div">
                        <BanStamp />
                    </OnlyBan>

                    <div className="hero-copy relative">
                        {/* Alen's name arrives in his own script and turns into English */}
                        <h1 className="text-display text-6xl sm:text-7xl lg:text-[5.25rem] mb-6">
                            <Persona
                                // The delay is the page landing (320ms) and one beat with the
                                // name still in his script, so it is seen before it is translated
                                alen={<Translate text={personalInfo.hero_title} delay={460} />}
                                ban={withStrikes(banInfo.hero_title)}
                            />
                        </h1>

                        <p className="text-xl text-foreground/85 leading-snug max-w-md mb-3">
                            <Persona
                                alen={parseTextWithLinks(personalInfo.hero_description)}
                                ban={parseTextWithLinks(banInfo.hero_description)}
                            />
                        </p>

                        {/* Alen's last word gives him away when you point at it; Ban has no alien in him */}
                        <p className="text-base text-muted-foreground">
                            <Persona
                                alen={
                                    <>
                                        engineer · builder · <GlitchPersonWord />
                                    </>
                                }
                                ban="Engineer. Builder. Person of interest."
                            />
                        </p>
                    </div>

                    {/* Social links: plain text, a static mark on the ones that leave the site */}
                    <div className="hero-links relative flex flex-wrap gap-x-5 mt-7">
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
                                    // py-2 is for thumbs: a row of bare text is a 20px target
                                    className="inline-flex items-center gap-2 py-2 text-sm font-medium text-foreground/75 hover:text-accent transition-[color,scale] duration-150 ease-out active:[scale:0.97]"
                                >
                                    {IconComponent && <IconComponent className="w-4 h-4 shrink-0 opacity-75" />}
                                    {banName ? <Persona alen={link.name} ban={banName} /> : link.name}
                                    {external && (
                                        <TbArrowUpRight
                                            className="w-3.5 h-3.5 -ml-0.5 text-muted-foreground"
                                            aria-label="opens in a new tab"
                                        />
                                    )}
                                </a>
                            )
                        })}
                    </div>
                </section>

                {/* ── About ────────────────────────────────────────── */}
                <section className="mb-20">
                    <h2 className="section-label mb-6">
                        <Persona alen="about" ban="the accused" />
                    </h2>
                    <div className="space-y-4 text-foreground/80 leading-[1.7] max-w-[64ch]">
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
                        {/* Signed twice: once the way he was taught, once the way he writes */}
                        <OnlyAlen as="div">
                            <div className="flex gap-1.5 mt-3 text-accent/70" aria-hidden="true">
                                {NAME_IN_SCRIPT.map((index) => (
                                    <AlienGlyph key={index} index={index} className="w-3.5 h-3.5" />
                                ))}
                            </div>
                        </OnlyAlen>
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
                            <h2 className="section-label">
                                <Persona alen="recent writing" ban="recent statements" />
                            </h2>
                            <Link
                                href="/writing"
                                className="text-sm text-muted-foreground hover:text-accent transition-colors duration-150"
                            >
                                <Persona alen="all posts" ban="all statements" />
                            </Link>
                        </div>
                        <div>
                            {recentPosts.map((post) => (
                                <Link
                                    key={post.slug}
                                    href={`/writing/about/${post.slug}`}
                                    className="group flex items-center gap-4 py-3.5 border-b border-dashed border-border last:border-b-0"
                                >
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-pretty group-hover:text-accent transition-colors duration-150">
                                            {post.title}
                                        </p>
                                        <p className="mono-label text-muted-foreground mt-1">
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
                    <h2 className="section-label mb-5">
                        <Persona alen="contact" ban="where to find me" />
                    </h2>
                    <p className="text-foreground/80 leading-[1.7] max-w-[64ch]">
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
