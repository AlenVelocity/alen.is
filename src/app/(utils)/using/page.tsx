import { Metadata } from 'next'
import { PageTransition } from '@/components/ui/page-transition'
import { FiArrowUpRight, FiCpu } from 'react-icons/fi'
import Image from 'next/image'

export const metadata: Metadata = {
    title: 'Using',
    description: 'My gear and setup',
    openGraph: {
        title: 'Alen is Using',
        description: 'My gear and setup',
    },
    alternates: { canonical: '/using' },
}

type GearItem = {
    name: string
    specs: string[]
    type: string
    href: string
    image?: string
    badge?: string
    inactive?: boolean
}

type GearSection = {
    title: string
    items: GearItem[]
}

const gearSections: GearSection[] = [
    {
        title: 'Computing',
        items: [
            {
                name: 'ASUS ROG Strix G16 (2025)',
                specs: ['Ryzen 9 8945HX', 'RTX 5070 Ti', '16" QHD+ 240Hz'],
                type: 'Laptop',
                href: 'https://in.store.asus.com/rog/gaming-laptop-rog-strix-g16-g614pr-rv032ws.html',
                image: '/gear/rog-strix-g16.png',
                badge: 'Daily Driver',
            },
            {
                name: 'MacBook Pro M4 Pro',
                specs: ['M4 Pro 14-core', '24GB RAM', '1TB SSD'],
                type: 'Laptop',
                href: 'https://www.apple.com/macbook-pro/',
                image: '/gear/macbook-pro-m4.png',
                badge: 'Inactive',
                inactive: true,
            },
        ],
    },
    {
        title: 'Display',
        items: [
            {
                name: 'Lenovo Legion R27qc-30',
                specs: ['27" QHD 1440p', '180Hz', '1500R Curved VA'],
                type: 'Monitor',
                href: 'https://www.amazon.in/Lenovo-Legion-R32qc-30-FreeSync-3Wx2Speaker-67C8GAC1IN/dp/B0F6C3LP1R',
                image: '/gear/lenovo-r27qc.png',
            },
        ],
    },
    {
        title: 'Mobile',
        items: [
            {
                name: 'Samsung Galaxy Z Fold 7',
                specs: ['Snapdragon 8 Elite', '6.5" cover + 8" inner', 'Android 16'],
                type: 'Phone',
                href: 'https://www.samsung.com/us/smartphones/galaxy-z-fold7/',
                image: '/gear/galaxy-z-fold7.png',
                badge: 'Daily Driver',
            },
        ],
    },
    {
        title: 'Audio',
        items: [
            {
                name: 'Simgot EW300 DSP',
                specs: ['Tribrid DD+Planar+PZT', 'USB-C DSP', 'Detachable Nozzles'],
                type: 'IEM · Wired',
                href: 'https://www.headphonezone.in/products/simgot-ew300',
                image: '/gear/simgot-ew300-dsp.png',
                badge: 'Daily Driver',
            },
            {
                name: 'Realme TechLife Studio H1',
                specs: ['40mm Drivers', '43dB ANC'],
                type: 'Over-ear · Wireless',
                href: 'https://buy.realme.com/in/goods/729',
                image: '/gear/realme-studio-h1.png',
            },
            {
                name: 'boAt Airdopes 161',
                specs: ['BT 5.3', 'ENx™ ENC'],
                type: 'Earbuds · Wireless',
                href: 'https://www.boat-lifestyle.com/products/airdopes-161',
                image: '/gear/boat-airdopes-161.png',
            },
            {
                name: 'Moondrop Chu 2 DSP',
                specs: ['10mm Dynamic Driver', 'USB-C DSP', 'Detachable Cable'],
                type: 'IEM · Wired',
                href: 'https://www.headphonezone.in/products/moondrop-chu-ii',
                image: '/gear/moondrop-chu-2-dsp.png',
                inactive: true,
            },
            {
                name: 'Headphone Zone X Tangzu Wan\'er S.G 2',
                specs: ['10mm LCP Diaphragm', '3.5mm Wired', 'Detachable Cable'],
                type: 'IEM · Wired',
                href: 'https://www.headphonezone.in/products/headphone-zone-x-tangzu-waner-s-g-2',
                image: '/gear/headphone-zone-x-tangzu-waner-s-g-2.png',
                inactive: true,
            },
            {
                name: '7Hz Salnotes Zero',
                specs: ['10mm Dynamic Driver', '3.5mm Wired', 'Flat Sound'],
                type: 'IEM · Wired',
                href: 'https://www.linsoul.com/products/7hz-salnotes-zero',
                image: '/gear/7hz-salnotes-zero.png',
                inactive: true,
            },
        ],
    },
    {
        title: 'Gaming',
        items: [
            {
                name: 'Meta Quest 3S',
                specs: ['128GB', 'Mixed Reality', 'Snapdragon XR2 Gen 2'],
                type: 'VR Headset',
                href: 'https://www.meta.com/quest/quest-3s/',
                image: '/gear/meta-quest-3s.webp',
            },
            {
                name: 'GameSir Cyclone 2',
                specs: ['Mag-Res TMR Sticks', 'Hall Effect Triggers', 'BT / 2.4G / USB-C'],
                type: 'Controller · Wireless',
                href: 'https://gamesir.com/collections/hot-sale/products/gamesir-cyclone2-black',
                image: '/gear/gamesir-cyclone2.png',
            },
        ],
    },
]

function GearCard({ item }: { item: GearItem }) {
    return (
        <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`group relative flex flex-col rounded-xl border bg-card overflow-hidden transition-all duration-300 hover:-translate-y-0.5 ${item.inactive
                ? 'opacity-50 grayscale border-border/30 hover:opacity-60'
                : 'border-border/50 hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5'
                }`}
        >
            {/* Badge */}
            {item.badge && (
                <span
                    className={`absolute top-2.5 left-2.5 z-10 text-[10px] font-semibold px-2 py-0.5 rounded-full border backdrop-blur-sm ${item.inactive
                        ? 'text-muted-foreground/70 border-border/40 bg-background/60'
                        : 'text-accent border-accent/40 bg-accent/10'
                        }`}
                >
                    {item.badge}
                </span>
            )}

            {/* Image */}
            <div className="relative w-full aspect-[4/3] bg-muted/20 overflow-hidden">
                {item.image ? (
                    <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain p-5 group-hover:scale-[1.04] transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <p className="text-xs text-muted-foreground/30 italic">image coming soon</p>
                    </div>
                )}
            </div>

            {/* Divider */}
            <div className="h-px bg-border/40 mx-4" />

            {/* Content */}
            <div className="flex flex-col p-4 gap-2.5">
                {/* Name + Arrow */}
                <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-sm leading-snug group-hover:text-accent transition-colors duration-200">
                        {item.name}
                    </p>
                    <FiArrowUpRight className="w-3.5 h-3.5 text-muted-foreground/30 group-hover:text-accent shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-all duration-200" />
                </div>

                {/* Spec chips */}
                <div className="flex flex-wrap gap-1">
                    {item.specs.map((spec) => (
                        <span
                            key={spec}
                            className="text-[10px] font-medium text-muted-foreground/70 bg-muted/50 px-1.5 py-0.5 rounded-md border border-border/30"
                        >
                            {spec}
                        </span>
                    ))}
                </div>

                {/* Type label */}
                <p className="text-[10px] text-muted-foreground/40 uppercase tracking-widest font-medium">
                    {item.type}
                </p>
            </div>
        </a>
    )
}

export default function Using() {
    return (
        <PageTransition>
            <div className="container max-w-3xl py-12 md:py-20">
                {/* Header */}
                <div className="flex items-center gap-3 mb-3">
                    <FiCpu className="w-6 h-6 text-muted-foreground" />
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                        Using
                    </h1>
                </div>

                {/* About */}
                <section className="mb-12 text-muted-foreground leading-relaxed">
                    <p>My current hardware setup. Click any card to visit the product page.</p>
                </section>

                {/* Gear Sections */}
                <div className="space-y-12">
                    {gearSections.map((section) => (
                        <section key={section.title}>
                            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider border-l-2 border-accent pl-3 mb-5">
                                {section.title}
                            </h2>
                            <div
                                className={`grid gap-4 ${section.items.length === 1
                                    ? 'grid-cols-1 max-w-xs'
                                    : section.items.length === 2
                                        ? 'grid-cols-2'
                                        : 'grid-cols-2 sm:grid-cols-3'
                                    }`}
                            >
                                {section.items.map((item) => (
                                    <GearCard key={item.name} item={item} />
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            </div>
        </PageTransition>
    )
}
