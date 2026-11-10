import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'

const config = {
    darkMode: ['class'],
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
            fontFamily: {
                sans: ['var(--font-display)'],
                mono: ['var(--font-jetbrains-mono)', 'monospace'],
                serif: ['var(--font-display)'],
                'mono-ui': ['var(--font-ui)'],
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
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius))',
                sm: 'calc(var(--radius))',
                xl: 'calc(var(--radius) + 4px)',
                '2xl': 'calc(var(--radius) + 8px)'
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
