import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

// Palette lifted from globals.css light mode
const BG = '#f6f8f9' // hsl(210 20% 97%)
const CARD = '#ffffff'
const FG = '#101a1d' // hsl(200 25% 8%)
const ACCENT = '#0da55e' // hsl(152 85% 35%)
const MUTED = '#67737d'
const BORDER = '#d3dade'
const RED = '#d64545'
const DARK = '#0b1416' // mini "photo" canvas, matches dark mode bg

export const OG_SIZE = { width: 1200, height: 630 }

/** Polaroid-style pinned card with a glowing UFO "photo" */
function ExhibitUfo() {
    return (
        <div
            style={{
                position: 'absolute',
                left: 100,
                top: 78,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: CARD,
                border: `1px solid ${BORDER}`,
                padding: 10,
                boxShadow: '6px 8px 0 rgba(16, 26, 29, 0.08)',
                transform: 'rotate(-5deg)'
            }}
        >
            <div
                style={{
                    width: 180,
                    height: 140,
                    backgroundColor: DARK,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <div
                    style={{
                        width: 24,
                        height: 12,
                        borderRadius: '12px 12px 0 0',
                        backgroundColor: '#00f58266',
                        marginBottom: -3
                    }}
                />
                <div
                    style={{
                        width: 64,
                        height: 12,
                        borderRadius: 9999,
                        backgroundColor: '#00f582',
                        boxShadow: '0 0 20px #00f58299'
                    }}
                />
                <svg width="100" height="56" viewBox="0 0 100 56" style={{ marginTop: -2 }}>
                    <defs>
                        <linearGradient id="beamMini" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#00f582" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="#00f582" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    <polygon points="50,0 100,56 0,56" fill="url(#beamMini)" />
                </svg>
            </div>
        </div>
    )
}

/** Pinned card with a crop-circle field sketch */
function ExhibitCropCircles() {
    return (
        <div
            style={{
                position: 'absolute',
                left: 880,
                top: 88,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: CARD,
                border: `1px solid ${BORDER}`,
                padding: 10,
                boxShadow: '6px 8px 0 rgba(16, 26, 29, 0.08)',
                transform: 'rotate(4deg)'
            }}
        >
            <svg width="170" height="130" viewBox="0 0 170 130" style={{ backgroundColor: '#eef7f2' }}>
                <g stroke={ACCENT} fill="none" strokeWidth="3" opacity="0.8">
                    <circle cx="52" cy="52" r="30" />
                    <circle cx="118" cy="38" r="17" />
                    <circle cx="108" cy="98" r="22" />
                    <line x1="52" y1="52" x2="118" y2="38" />
                    <line x1="118" y1="38" x2="108" y2="98" />
                </g>
                <circle cx="52" cy="52" r="9" fill={ACCENT} opacity="0.45" />
            </svg>
        </div>
    )
}

export type OgKind = 'page' | 'adjective' | 'professional' | 'unknown'

/**
 * Investigation-board OG card. With a word the center card reads
 * "alen is <word>" — adjectives ask ("cool?", no stamp), professional pages
 * declare ("building!", CONFIRMED), other real pages get a plain CONFIRMED,
 * and made-up words get a red "?" with an UNVERIFIED stamp. Without a word
 * it's the "alen.is" case file.
 */
export async function renderOgImage(word?: string, kind: OgKind = 'page') {
    const [bold, regular] = await Promise.all([
        readFile(join(process.cwd(), 'src/fonts/JetBrainsMono-Bold.ttf')),
        readFile(join(process.cwd(), 'src/fonts/JetBrainsMono-Regular.ttf'))
    ])

    const suffix = kind === 'adjective' || kind === 'unknown' ? '?' : kind === 'professional' ? '!' : ''
    const suffixColor = kind === 'unknown' ? RED : ACCENT

    // Shrink the headline for long words so it never runs off the card
    const chars = word ? word.length + suffix.length + 8 : 7
    const fontSize = Math.min(84, Math.floor(980 / (0.62 * chars)))

    const stamp = word ? (kind === 'unknown' ? 'UNVERIFIED' : kind === 'adjective' ? null : 'CONFIRMED') : 'ACTIVE CASE'
    const stampColor = kind === 'unknown' ? RED : ACCENT

    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    backgroundColor: BG,
                    fontFamily: 'JetBrains Mono',
                    position: 'relative'
                }}
            >
                {/* Graph-paper grid */}
                <svg width="1200" height="630" viewBox="0 0 1200 630" style={{ position: 'absolute', inset: 0 }}>
                    <g stroke={ACCENT} strokeWidth="1" opacity="0.07">
                        {Array.from({ length: 49 }, (_, i) => (
                            <line key={`fv${i}`} x1={(i + 1) * 24} y1={0} x2={(i + 1) * 24} y2={630} />
                        ))}
                        {Array.from({ length: 26 }, (_, i) => (
                            <line key={`fh${i}`} x1={0} y1={(i + 1) * 24} x2={1200} y2={(i + 1) * 24} />
                        ))}
                    </g>
                    <g stroke={ACCENT} strokeWidth="1" opacity="0.16">
                        {Array.from({ length: 12 }, (_, i) => (
                            <line key={`cv${i}`} x1={(i + 1) * 96} y1={0} x2={(i + 1) * 96} y2={630} />
                        ))}
                        {Array.from({ length: 6 }, (_, i) => (
                            <line key={`ch${i}`} x1={0} y1={(i + 1) * 96} x2={1200} y2={(i + 1) * 96} />
                        ))}
                    </g>
                </svg>

                <ExhibitUfo />
                <ExhibitCropCircles />

                {/* Center hypothesis card */}
                <div
                    style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: 328,
                        display: 'flex',
                        justifyContent: 'center'
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 12,
                            backgroundColor: CARD,
                            border: `1px solid ${BORDER}`,
                            padding: '28px 52px',
                            boxShadow: '8px 10px 0 rgba(16, 26, 29, 0.08)',
                            transform: 'rotate(-1.5deg)'
                        }}
                    >
                        <div style={{ display: 'flex', fontSize: 19, letterSpacing: 6, color: MUTED }}>
                            {word ? '// HYPOTHESIS' : '// CASE FILE 001'}
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'baseline',
                                fontSize,
                                fontWeight: 700,
                                letterSpacing: -2
                            }}
                        >
                            {word ? (
                                <>
                                    <span style={{ color: MUTED }}>alen is&nbsp;</span>
                                    <span style={{ color: ACCENT }}>{word}</span>
                                    {suffix && <span style={{ color: suffixColor }}>{suffix}</span>}
                                </>
                            ) : (
                                <>
                                    <span style={{ color: FG }}>alen</span>
                                    <span style={{ color: ACCENT }}>.is</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Red string + pins tying the exhibits to the hypothesis */}
                <svg width="1200" height="630" viewBox="0 0 1200 630" style={{ position: 'absolute', inset: 0 }}>
                    <g stroke={RED} strokeWidth="3" fill="none" opacity="0.55">
                        <path d="M303,226 Q450,400 600,340" />
                        <path d="M877,229 Q745,400 600,340" />
                    </g>
                    <circle cx="303" cy="226" r="7" fill={RED} />
                    <circle cx="877" cy="229" r="7" fill={RED} />
                    <circle cx="600" cy="340" r="8" fill={RED} />
                </svg>

                {/* Verdict stamp — adjectives stay an open question, no verdict */}
                {stamp && (
                    <div
                        style={{
                            position: 'absolute',
                            right: 110,
                            top: 462,
                            display: 'flex',
                            border: `3px solid ${stampColor}`,
                            color: stampColor,
                            backgroundColor: 'rgba(255, 255, 255, 0.65)',
                            padding: '10px 22px',
                            fontSize: 30,
                            fontWeight: 700,
                            letterSpacing: 8,
                            transform: 'rotate(-8deg)',
                            opacity: 0.9
                        }}
                    >
                        {stamp}
                    </div>
                )}
            </div>
        ),
        {
            ...OG_SIZE,
            fonts: [
                { name: 'JetBrains Mono', data: bold, weight: 700, style: 'normal' },
                { name: 'JetBrains Mono', data: regular, weight: 400, style: 'normal' }
            ]
        }
    )
}

export interface BlogOgInput {
    title: string
    date: string
    readingMinutes: number
    tags: string[]
    transmissionNumber: string
}

/** Small saucer glyph used as the ticket's letterhead mark */
function TicketUfo() {
    return (
        <svg width="40" height="22" viewBox="0 0 40 22">
            <ellipse cx="20" cy="8" rx="7" ry="5" fill={ACCENT} opacity="0.5" />
            <ellipse cx="20" cy="12" rx="19" ry="5" fill={ACCENT} />
        </svg>
    )
}

/**
 * Blog-post OG card — a printed dispatch ticket, distinct from the
 * investigation-board look used for the rest of the site. Perforated top
 * edge, transmission number + date letterhead, the post title (wraps up to
 * two lines), and a footer with a reading-time signal meter and tags.
 */
export async function renderBlogOgImage({ title, date, readingMinutes, tags, transmissionNumber }: BlogOgInput) {
    const [bold, regular] = await Promise.all([
        readFile(join(process.cwd(), 'src/fonts/JetBrainsMono-Bold.ttf')),
        readFile(join(process.cwd(), 'src/fonts/JetBrainsMono-Regular.ttf'))
    ])

    const titleSize = title.length > 60 ? 46 : title.length > 40 ? 56 : title.length > 22 ? 66 : 76
    const barHeights = [10, 16, 24, 16, 10]
    const litBars = Math.max(1, Math.min(5, Math.round((readingMinutes / 10) * 5)))

    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: BG,
                    fontFamily: 'JetBrains Mono',
                    position: 'relative'
                }}
            >
                {/* Graph-paper grid, same family as the rest of the site's OG cards */}
                <svg width="1200" height="630" viewBox="0 0 1200 630" style={{ position: 'absolute', inset: 0 }}>
                    <g stroke={ACCENT} strokeWidth="1" opacity="0.07">
                        {Array.from({ length: 49 }, (_, i) => (
                            <line key={`fv${i}`} x1={(i + 1) * 24} y1={0} x2={(i + 1) * 24} y2={630} />
                        ))}
                        {Array.from({ length: 26 }, (_, i) => (
                            <line key={`fh${i}`} x1={0} y1={(i + 1) * 24} x2={1200} y2={(i + 1) * 24} />
                        ))}
                    </g>
                    <g stroke={ACCENT} strokeWidth="1" opacity="0.16">
                        {Array.from({ length: 12 }, (_, i) => (
                            <line key={`cv${i}`} x1={(i + 1) * 96} y1={0} x2={(i + 1) * 96} y2={630} />
                        ))}
                        {Array.from({ length: 6 }, (_, i) => (
                            <line key={`ch${i}`} x1={0} y1={(i + 1) * 96} x2={1200} y2={(i + 1) * 96} />
                        ))}
                    </g>
                </svg>

                {/* The dispatch ticket */}
                <div
                    style={{
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        width: 1000,
                        backgroundColor: CARD,
                        border: `1px solid ${BORDER}`,
                        boxShadow: '10px 12px 0 rgba(16, 26, 29, 0.08)',
                        padding: '46px 60px',
                        transform: 'rotate(-1deg)'
                    }}
                >
                    {/* Perforation dots along the top edge */}
                    <div
                        style={{
                            position: 'absolute',
                            top: -5,
                            left: 30,
                            right: 30,
                            display: 'flex',
                            justifyContent: 'space-between'
                        }}
                    >
                        {Array.from({ length: 26 }, (_, i) => (
                            <div key={i} style={{ width: 8, height: 8, borderRadius: 9999, backgroundColor: BG }} />
                        ))}
                    </div>

                    {/* Letterhead */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: 34
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                            <TicketUfo />
                            <span style={{ display: 'flex', fontSize: 19, letterSpacing: 4, color: MUTED }}>
                                TRANSMISSION // {transmissionNumber}
                            </span>
                        </div>
                        <span style={{ display: 'flex', fontSize: 18, color: MUTED }}>{date}</span>
                    </div>

                    {/* Title — wraps up to two lines */}
                    <div
                        style={{
                            display: 'flex',
                            fontSize: titleSize,
                            fontWeight: 700,
                            color: FG,
                            lineHeight: 1.12,
                            letterSpacing: -1.5,
                            marginBottom: 36
                        }}
                    >
                        {title}
                    </div>

                    {/* Footer: reading-time signal meter + tags */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4 }}>
                                {barHeights.map((h, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            width: 7,
                                            height: h,
                                            backgroundColor: ACCENT,
                                            opacity: i < litBars ? 0.9 : 0.15
                                        }}
                                    />
                                ))}
                            </div>
                            <span style={{ display: 'flex', fontSize: 19, color: ACCENT }}>
                                {readingMinutes} min read
                            </span>
                        </div>
                        {tags.length > 0 && (
                            <div style={{ display: 'flex', gap: 10 }}>
                                {tags.slice(0, 3).map((tag) => (
                                    <div
                                        key={tag}
                                        style={{
                                            display: 'flex',
                                            fontSize: 17,
                                            color: MUTED,
                                            border: `1px solid ${BORDER}`,
                                            borderRadius: 9999,
                                            padding: '6px 16px'
                                        }}
                                    >
                                        {tag}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Watermark */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: 40,
                        right: 96,
                        display: 'flex',
                        fontSize: 17,
                        letterSpacing: 2,
                        color: MUTED,
                        opacity: 0.7
                    }}
                >
                    alen.is/blogging
                </div>
            </div>
        ),
        {
            ...OG_SIZE,
            fonts: [
                { name: 'JetBrains Mono', data: bold, weight: 700, style: 'normal' },
                { name: 'JetBrains Mono', data: regular, weight: 400, style: 'normal' }
            ]
        }
    )
}
