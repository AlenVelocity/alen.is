import { Metadata } from 'next'
import { PageTransition } from '@/components/ui/page-transition'

export const metadata: Metadata = {
    title: 'My Gear',
    description: 'My hardware setup',
    openGraph: {
        title: 'Alen is Using',
        description: 'My gear and setup',
        images: [{ url: '/api/og?is=using', width: 1200, height: 630, alt: 'alen is using' }]
    },
    alternates: { canonical: '/using' }
}

type GearItem = {
    name: string
    specs: string
    type: string
    badge?: string
    inactive?: boolean
}

type GearSection = {
    title: string
    items: GearItem[]
}

const gearSections: GearSection[] = [
    {
        title: 'PC Build',
        items: [
            { name: 'AMD Ryzen 9 9950X', specs: '16C/32T · 5.7GHz Boost', type: 'CPU' },
            { name: 'Deepcool LD360', specs: '360mm AIO Liquid Cooler', type: 'Cooler' },
            { name: 'MSI B850 Gaming Plus WiFi', specs: 'AMD B850 · AM5 · DDR5 · ATX', type: 'Motherboard' },
            { name: 'G.Skill RipJaws 5 DDR5', specs: '32GB (2×16GB) · 5600MHz', type: 'RAM' },
            { name: 'Adata XPG Gammix S60', specs: '1TB · M.2 NVMe Gen4', type: 'SSD' },
            { name: 'Colorful RTX 5070', specs: '12GB GDDR7X · Gaming OC', type: 'GPU' },
            { name: 'Deepcool CG530 4F', specs: '4 Fans · Mid Tower ATX', type: 'Case' },
            { name: 'Thermaltake Toughpower GF3', specs: '850W · 80+ Gold · Full Modular', type: 'PSU' }
        ]
    },
    {
        title: 'Computing',
        items: [{ name: 'MacBook Pro M4 Pro', specs: '14-core M4 Pro · 24GB · 1TB', type: 'Laptop', inactive: true }]
    },
    {
        title: 'Display',
        items: [
            {
                name: 'Lenovo Legion R27qc-30',
                specs: '27" QHD 1440p · 180Hz · 1500R VA',
                type: 'Monitor',
                badge: 'Daily Driver'
            }
        ]
    },
    {
        title: 'Mobile',
        items: [
            {
                name: 'Samsung Galaxy Z Fold 7',
                specs: 'Snapdragon 8 Elite · 6.5" + 8" · Android 16',
                type: 'Phone',
                badge: 'Daily Driver'
            }
        ]
    },
    {
        title: 'Audio',
        items: [
            {
                name: '7Hz x Crinacle Divine',
                specs: 'Planar · Crinacle Collab Tuning · 3.5mm Wired',
                type: 'IEM · Wired',
                badge: 'Daily Driver'
            },
            {
                name: 'Simgot EW300 DSP',
                specs: 'Tribrid DD+Planar+PZT · USB-C DSP',
                type: 'IEM · Wired',
                badge: 'Broken'
            },
            { name: 'Realme TechLife Studio H1', specs: '40mm Drivers · 43dB ANC', type: 'Over-ear · Wireless' },
            { name: 'boAt Airdopes 161', specs: 'BT 5.3 · ENx™ ENC', type: 'Earbuds · Wireless' },
            { name: 'Moondrop Chu 2 DSP', specs: '10mm Dynamic · USB-C DSP', type: 'IEM · Wired', inactive: true },
            {
                name: "HZ Zones × Tangzu Wan'er S.G 2",
                specs: '10mm LCP · 3.5mm Wired',
                type: 'IEM · Wired',
                inactive: true
            },
            { name: '7Hz Salnotes Zero', specs: '10mm Dynamic · 3.5mm Wired', type: 'IEM · Wired', inactive: true }
        ]
    },
    {
        title: 'Gaming',
        items: [
            { name: 'Meta Quest 3S', specs: '128GB · Mixed Reality · XR2 Gen 2', type: 'VR Headset' },
            { name: 'Sony DualSense 5', specs: 'Midnight Black · BT / USB-C', type: 'Controller' },
            { name: 'GameSir Cyclone 2', specs: 'TMR Sticks · Hall Triggers · BT/2.4G', type: 'Controller' }
        ]
    }
]

function GearRow({ item }: { item: GearItem }) {
    const badgeColor =
        item.badge === 'Daily Driver'
            ? 'text-accent border-accent/30'
            : item.badge === 'Broken'
                ? 'text-destructive border-destructive/30'
                : 'text-muted-foreground border-border/50'

    return (
        <div
            className={`group flex items-baseline gap-3 py-3 border-b border-dashed border-border/40 transition-colors duration-150 ${item.inactive ? 'opacity-35' : 'hover:border-accent/30'}`}
        >
            {/* Type label */}
            <span className="mono-label text-muted-foreground/40 w-28 shrink-0 text-right hidden sm:block">
                {item.type}
            </span>

            {/* Dot separator */}
            <span className="text-border/60 hidden sm:block shrink-0">·</span>

            {/* Name */}
            <span
                className={`font-mono-ui text-sm font-medium flex-1 transition-colors duration-150 ${item.inactive ? '' : 'group-hover:text-accent'}`}
            >
                {item.name}
            </span>

            {/* Dot trail */}
            <span className="flex-1 border-b border-dotted border-muted-foreground/10 translate-y-[-4px] hidden md:block" />

            {/* Specs */}
            <span className="mono-label text-muted-foreground/45 text-right hidden sm:block shrink-0 max-w-[220px]">
                {item.specs}
            </span>

            {/* Badge */}
            {item.badge && (
                <span className={`mono-label border px-1.5 py-0.5 rounded-sm shrink-0 ${badgeColor}`}>
                    {item.badge.toLowerCase()}
                </span>
            )}
        </div>
    )
}

export default function Using() {
    return (
        <PageTransition>
            <div className="container max-w-2xl py-12 md:py-20 px-4">
                {/* Header */}
                <div className="mb-16">
                    <p className="mono-label text-muted-foreground/50 mb-4">// setup</p>
                    <h1 className="text-display text-5xl md:text-6xl mb-3">Gear</h1>
                    <p className="text-[0.9rem] text-muted-foreground">My current hardware setup.</p>
                </div>

                {/* Sections */}
                <div className="space-y-12">
                    {gearSections.map((section) => (
                        <section key={section.title}>
                            <div className="section-label mb-3">{section.title.toLowerCase()}</div>
                            <div>
                                {section.items.map((item) => (
                                    <GearRow key={item.name} item={item} />
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            </div>
        </PageTransition>
    )
}
