import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'

const config = {
    darkMode: ['class'],
    // `hover:` only applies where there is a real hover. On a touch screen a tap
    // used to leave links and rows stuck in their hover colour until the next tap.
    future: { hoverOnlyWhenSupported: true },
    content: ['./pages/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
    theme: {
        container: {
            center: true,
            padding: '1rem',
            screens: {
                '2xl': '1200px'
            }
        },
        extend: {
            // --font-display and --font-ui change with the person (globals.css), so
            // these follow whoever is in. `mono` stays a real monospace for code.
            // (`mono-ui` is the reading face. The name is from when Alen's was a
            // monospace; it is used in too many places to be worth renaming.)
            fontFamily: {
                sans: ['var(--font-display)'],
                mono: ['var(--font-jetbrains-mono)', 'monospace'],
                serif: ['var(--font-display)'],
                'mono-ui': ['var(--font-ui)'],
                // Things that are measured or typed: dates, counts, keys, paths.
                // Alen's is the monospace; Ban's is his text face.
                data: ['var(--font-data)'],
                display: ['var(--font-display)']
            },
            colors: {
                // "happening right now": the nav cursor, the current job, a playing track.
                // Alen's signal is his accent; Ban's is amber (see globals.css)
                signal: 'hsl(var(--signal))',
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))'
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))'
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))'
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))'
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))'
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))'
                },
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))'
                }
            },
            // Everything scales from --radius, so Ban (whose radius is 0) is square
            // at every size without a single override
            borderRadius: {
                sm: 'calc(var(--radius) * 0.4)',
                md: 'calc(var(--radius) * 0.7)',
                lg: 'var(--radius)',
                xl: 'calc(var(--radius) * 1.6)',
                '2xl': 'calc(var(--radius) * 2.4)'
            },
            transitionTimingFunction: {
                out: 'var(--ease-out)',
                'in-out': 'var(--ease-in-out)'
            }
        }
    },
    plugins: [
        require('tailwindcss-animate'),
        // `ban:` and `alen:` style one element differently per person, e.g.
        // `text-left ban:text-center`. For different words, use <Persona>.
        plugin(({ addVariant }) => {
            addVariant('ban', 'html[data-persona="ban"] &')
            addVariant('alen', 'html:not([data-persona="ban"]) &')
        })
    ]
} satisfies Config

export default config
