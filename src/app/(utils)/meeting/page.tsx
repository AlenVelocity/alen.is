'use client'

import Cal, { getCalApi } from '@calcom/embed-react'
import { useEffect } from 'react'
import { useTheme } from 'next-themes'
import { PageTransition } from '@/components/ui/page-transition'
import { PageHeader } from '@/components/ui/page-header'
import { Persona } from '@/components/persona'
import { usePersona } from '@/hooks/use-persona'

const CAL_LINK = 'xlxnyx/20-min'
// The embed and every instruction sent to it have to name the same namespace,
// or the instruction goes to a default embed that is not on the page
const CAL_NAMESPACE = '20-min-meeting'

type Hsl = [h: number, s: number, l: number]

/** A colour token off <html>. globals.css stores them as "152 100% 50%". */
function readToken(name: string): Hsl | null {
    const parts = getComputedStyle(document.documentElement)
        .getPropertyValue(name)
        .trim()
        .split(/\s+/)
        .map((part) => parseFloat(part))
    if (parts.length < 3 || parts.slice(0, 3).some(Number.isNaN)) return null
    return [parts[0], parts[1], parts[2]]
}

/** The same colour as "#00ff88". It crosses into Cal's iframe, where the site's variables do not exist. */
function toHex([h, s, l]: Hsl): string {
    const light = l / 100
    const a = (s / 100) * Math.min(light, 1 - light)
    const channel = (n: number) => {
        const k = (n + h / 30) % 12
        const value = light - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))
        return Math.round(value * 255)
            .toString(16)
            .padStart(2, '0')
    }
    return `#${channel(0)}${channel(8)}${channel(4)}`
}

export default function MeetingPage() {
    // resolvedTheme, not theme: with theme="system" the latter never equals 'dark'.
    // It is undefined until the client knows, and the embed waits for it, so the
    // calendar never loads in the wrong theme and then flips.
    const { resolvedTheme } = useTheme()
    const theme = resolvedTheme === 'dark' ? 'dark' : resolvedTheme === 'light' ? 'light' : null
    const persona = usePersona()

    // Light or dark, and whose accent: sent again whenever either changes, so
    // the booking button is green for Alen and red for Ban without a reload
    useEffect(() => {
        if (!theme) return
        let stale = false
        ;(async function () {
            const cal = await getCalApi({ namespace: CAL_NAMESPACE })
            if (stale) return
            // Read after the await: by then the theme class and the persona attribute are on <html>
            const accent = readToken('--accent')
            const onAccent = readToken('--accent-foreground')
            const vars: Record<string, string> = {}
            if (accent) {
                const [h, s, l] = accent
                vars['cal-brand'] = toHex(accent)
                // Cal's hover shade for its own buttons: the accent, a little darker
                vars['cal-brand-emphasis'] = toHex([h, s, l * 0.86])
            }
            if (onAccent) vars['cal-brand-text'] = toHex(onAccent)
            cal('ui', {
                theme,
                hideEventTypeDetails: false,
                layout: 'month_view',
                cssVarsPerTheme: { light: vars, dark: vars }
            })
        })()
        return () => {
            stale = true
        }
    }, [theme, persona])

    return (
        <PageTransition>
            <div className="container max-w-3xl pt-10 md:pt-14 px-4">
                <PageHeader eyebrow="the formal route" title="Meeting" banTitle="A word">
                    <p className="text-[0.9rem] text-muted-foreground mb-4">
                        <Persona alen="Pick a time and I'll be on the call." ban="You're coming. Pick a time." />
                    </p>
                    {/* The same calendar without the embed, for when a blocker eats the iframe */}
                    <a
                        href={`https://cal.com/${CAL_LINK}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 font-mono-ui text-xs text-muted-foreground hover:text-accent transition-colors duration-150"
                    >
                        open it on cal.com
                        <span className="text-muted-foreground/40" aria-hidden="true">
                            ↗
                        </span>
                    </a>
                </PageHeader>
            </div>

            {/* Wider than the text column: the month view wants the room. The height is
                held open before the embed arrives, and it grows with what Cal puts in it. */}
            <div className="container max-w-4xl pb-10">
                <div className="min-h-[32rem]">
                    {theme && (
                        <Cal
                            namespace={CAL_NAMESPACE}
                            calLink={CAL_LINK}
                            style={{ width: '100%', minHeight: 'inherit' }}
                            config={{ layout: 'month_view', theme }}
                        />
                    )}
                </div>
            </div>
        </PageTransition>
    )
}
