import { Metadata } from 'next'
import Image from 'next/image'
import { PageTransition } from '@/components/ui/page-transition'
import { DecodeText } from '@/components/ui/decode-text'

import { constructMetadata } from '@/lib/metadata'

export const metadata: Metadata = constructMetadata({
    title: 'Using',
    description: 'My hardware setup',
    slug: 'using',
    ogTitle: 'Alen is Using',
    openGraph: { description: 'My gear and setup' }
})

type GearItem = {
    name: string
    specs: string
    type: string
    badge?: string
    inactive?: boolean
    href?: string
    image?: string
}

type GearSection = {
    title: string
    items: GearItem[]
}

const gearSections: GearSection[] = [
    {
        title: 'PC Build',
        items: [
            {
                name: 'AMD Ryzen 9 9950X',
                specs: '16C/32T · 5.7GHz Boost',
                type: 'CPU',
                href: 'https://www.amd.com/en/products/processors/desktops/ryzen/9000-series/amd-ryzen-9-9950x.html'
            },
            {
                name: 'MSI B850 Gaming Plus WiFi',
                specs: 'AMD B850 · AM5 · DDR5 · ATX',
                type: 'Motherboard',
                href: 'https://www.msi.com/Motherboard/B850-GAMING-PLUS-WIFI'
            },
            {
                name: 'G.Skill RipJaws 5 DDR5',
                specs: '32GB (2×16GB) · 5600MHz',
                type: 'RAM',
                href: 'https://www.gskill.com/product/165/377/1648538953/F5-5600J3636D32GX2-RS5K-F5-5600J3636D32GA2-RS5K'
            },
            {
                name: 'Deepcool LD360',
                specs: '360mm AIO Liquid Cooler',
                type: 'Cooler',
                href: 'https://www.deepcool.com/products/Cooling/cpuliquidcoolers/LD360-Liquid-Cooler-with-a-Multi-Line-Display-1851-1700-AM5/2024/17717.shtml'
            },
            {
                name: 'Colorful RTX 5070',
                specs: '12GB GDDR7X · Gaming OC',
                type: 'GPU',
                href: 'https://www.colorfulgroup.com/en/home/product?mid=102&id=28406f28-c515-4150-902a-66092a882095'
            },
            {
                name: 'Adata XPG Gammix S60',
                specs: '1TB · M.2 NVMe Gen4',
                type: 'SSD',
                href: 'https://www.xpg.com/us/xpg/solid-state-drive-gammix-s60?tab=spec'
            },
            {
                name: 'Deepcool CG530 4F',
                specs: '4 Fans · Mid Tower ATX',
                type: 'Case',
                href: 'https://www.deepcool.com/products/Cases/CG530-Panoramic-Tempered-Glass-Panels-Dual-Chamber-ATX-FISHTANK-Case-with-4-ARGB-PWM-Fans/2024/19604.shtml'
            },
            {
                name: 'Thermaltake Toughpower GF3',
                specs: '850W · 80+ Gold · Full Modular',
                type: 'PSU',
                href: 'https://thermaltakeusa.com/products/toughpower-gf3-850w-gold-tt-premium-edition-ps-tpd-0850fnfagu-4'
            }
        ]
    },
    {
        title: 'Gaming',
        items: [
            {
                name: 'Nintendo Switch 2',
                specs: '7.9" 1080p 120Hz · 256GB',
                type: 'Console',
                href: 'https://www.nintendo.com/us/gaming-systems/switch-2/'
            },
            {
                name: 'Meta Quest 3S',
                specs: '128GB · Mixed Reality · XR2 Gen 2',
                type: 'VR Headset',
                href: 'https://www.meta.com/quest/quest-3s/',
                image: '/gear/meta-quest-3s.webp'
            },
            {
                name: 'Sony DualSense 5',
                specs: 'Midnight Black · BT / USB-C',
                type: 'Controller',
                href: 'https://www.playstation.com/en-us/accessories/dualsense-wireless-controller/'
            },
            {
                name: 'GameSir Cyclone 2',
                specs: 'TMR Sticks · Hall Triggers · BT/2.4G',
                type: 'Controller',
                href: 'https://gamesir.com/products/gamesir-cyclone2-black',
                image: '/gear/gamesir-cyclone2.png'
            }
        ]
    },
    {
        title: 'Computing',
        items: [
            {
                name: 'MacBook Pro M4 Pro',
                specs: '14-core M4 Pro · 24GB · 1TB',
                type: 'Laptop',
                href: 'https://www.apple.com/macbook-pro/',
                image: '/gear/macbook-pro-m4.png',
                inactive: true
            }
        ]
    },
    {
        title: 'Display',
        items: [
            {
                name: 'Alienware AW2726DM',
                specs: 'QD-OLED · QHD 1440p · 240Hz',
                type: 'Monitor',
                href: 'https://www.dell.com/en-us/shop/alienware-27-240hz-qd-oled-gaming-monitor-aw2726dm/apd/210-bvrc/monitors-monitor-accessories',
                badge: 'Primary'
            },
            {
                name: 'Lenovo Legion R27qc-30',
                specs: '27" QHD 1440p · 180Hz · 1500R VA',
                type: 'Monitor',
                href: 'https://www.lenovo.com/us/en/p/accessories-and-software/monitors/gaming/67c6gac2us',
                image: '/gear/lenovo-r27qc.png',
                badge: 'Secondary'
            }
        ]
    },
    {
        title: 'Peripherals',
        items: [
            {
                name: 'Cosmic Byte Phantom TKL',
                specs: 'Hot-swap · Gasket Mount · TKL',
                type: 'Keyboard',
                href: 'https://www.thecosmicbyte.com/product/cosmic-byte-phantom-tkl-gasket-mechanical-wired-swappable-keyboard-with-prelubed-switches/'
            },
            {
                name: 'CybeArt Artemis x Batman',
                specs: 'Batman Edition',
                type: 'Mouse'
            },
            {
                name: 'CybeArt Ghost Mousepad XXL',
                specs: 'XXL',
                type: 'Mousepad'
            },
            {
                name: 'Logitech G304',
                specs: 'Lightspeed Wireless · 12000 DPI',
                type: 'Mouse',
                href: 'https://www.logitechg.com/en-hk/shop/p/g304-lightspeed-wireless-gaming-mouse',
                inactive: true
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
                href: 'https://www.samsung.com/us/smartphones/galaxy-z-fold7/',
                image: '/gear/galaxy-z-fold7.png',
                badge: 'Daily Driver'
            }
        ]
    },
    {
        title: 'Audio',
        items: [
            {
                name: 'JCALLY JM6 Pro 2',
                specs: 'Dual CS43198 · Balanced 4.4mm + 3.5mm · USB-C',
                type: 'DAC/Amp',
                href: 'https://www.headphonezone.in/products/jcally-jm6pro-2'
            },
            {
                name: '7Hz x Crinacle Divine',
                specs: 'Planar · Crinacle Collab Tuning · 3.5mm Wired',
                type: 'IEM · Wired',
                href: 'https://www.linsoul.com/products/7hz-x-crinacle-divine',
                badge: 'Daily Driver'
            },
            {
                name: 'Simgot EW300 DSP',
                specs: 'Tribrid DD+Planar+PZT · USB-C DSP',
                type: 'IEM · Wired',
                href: 'https://www.headphonezone.in/products/simgot-ew300',
                image: '/gear/simgot-ew300-dsp.png',
                badge: 'Broken'
            },
            {
                name: 'Moondrop Chu 2 DSP',
                specs: '10mm Dynamic · USB-C DSP',
                type: 'IEM · Wired',
                href: 'https://www.headphonezone.in/products/moondrop-chu-ii',
                image: '/gear/moondrop-chu-2-dsp.png',
                badge: 'Broken',
                inactive: true
            },
            {
                name: "HZ Zones × Tangzu Wan'er S.G 2",
                specs: '10mm LCP · 3.5mm Wired',
                type: 'IEM · Wired',
                href: 'https://www.headphonezone.in/products/headphone-zone-x-tangzu-waner-s-g-2',
                image: '/gear/headphone-zone-x-tangzu-waner-s-g-2.png',
                badge: 'Broken',
                inactive: true
            },
            {
                name: '7Hz Salnotes Zero',
                specs: '10mm Dynamic · 3.5mm Wired',
                type: 'IEM · Wired',
                href: 'https://www.linsoul.com/products/7hz-salnotes-zero',
                image: '/gear/7hz-salnotes-zero.png',
                badge: 'Broken',
                inactive: true
            },
            {
                name: 'Realme TechLife Studio H1',
                specs: '40mm Drivers · 43dB ANC',
                type: 'Over-ear · Wireless',
                href: 'https://buy.realme.com/in/goods/729',
                image: '/gear/realme-studio-h1.png',
                inactive: true
            },
            {
                name: 'boAt Airdopes 161',
                specs: 'BT 5.3 · ENx™ ENC',
                type: 'Earbuds · Wireless',
                href: 'https://www.boat-lifestyle.com/products/airdopes-161',
                image: '/gear/boat-airdopes-161.png',
                inactive: true
            }
        ]
    }
]

function GearRow({ item }: { item: GearItem }) {
    const badgeColor =
        item.badge === 'Daily Driver' || item.badge === 'Primary'
            ? 'text-accent border-accent/30'
            : item.badge === 'Broken'
              ? 'text-destructive border-destructive/30'
              : 'text-muted-foreground border-border/50'

    // Inactive rows dim their contents, not the row itself. Row opacity would also
    // dim the hover preview, which should always show the item at full strength
    const rowClassName = `group relative flex items-baseline gap-2 md:gap-3 py-3 border-b border-dashed border-border/40 ${item.inactive ? '[&>*:not(.gear-preview)]:opacity-35' : ''}`

    const content = (
        <>
            {/* Type, name and specs: stacked on mobile, one line from md up */}
            <div className="flex min-w-0 flex-1 flex-col gap-1 md:flex-row md:items-baseline md:gap-3">
                {/* Type label */}
                <span className="mono-label text-muted-foreground/55 md:text-muted-foreground/40 shrink-0 md:w-28 md:text-right">
                    {item.type}
                </span>

                {/* Dot separator */}
                <span className="text-border/60 hidden md:block shrink-0">·</span>

                {/* Name */}
                <span
                    className={`font-mono-ui text-sm font-medium md:flex-1 transition-colors duration-150 ${item.inactive ? '' : 'group-hover:text-accent'}`}
                >
                    {item.name}
                </span>

                {/* Dot trail */}
                <span className="flex-1 border-b border-dotted border-muted-foreground/10 translate-y-[-4px] hidden md:block" />

                {/* Specs */}
                <span className="mono-label text-muted-foreground/60 md:text-muted-foreground/45 shrink-0 md:max-w-[220px] md:text-right">
                    {item.specs}
                </span>
            </div>

            {/* Badge */}
            {item.badge && (
                <span className={`mono-label border px-1.5 py-0.5 rounded-sm shrink-0 ${badgeColor}`}>
                    {item.badge.toLowerCase()}
                </span>
            )}

            {/* Leaves the site */}
            {item.href && (
                <span className="mono-label text-muted-foreground/40 shrink-0" aria-hidden="true">
                    ↗
                </span>
            )}

            {/* Hover image preview */}
            {item.image && (
                <div
                    className="gear-preview pointer-events-none absolute right-0 bottom-full z-30 mb-2 hidden translate-y-1 opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-y-0 group-hover:opacity-100 md:block"
                    aria-hidden="true"
                >
                    <div className="relative w-36 h-36 overflow-hidden rounded-lg border border-border/50 bg-card shadow-xl ring-1 ring-black/5">
                        <Image src={item.image} alt="" fill sizes="144px" className="object-contain p-3" />
                    </div>
                </div>
            )}
        </>
    )

    if (item.href) {
        return (
            <a href={item.href} target="_blank" rel="noopener noreferrer" className={rowClassName}>
                {content}
            </a>
        )
    }

    return <div className={rowClassName}>{content}</div>
}

export default function Using() {
    return (
        <PageTransition>
            <div className="container max-w-2xl py-12 md:py-20 px-4">
                {/* Header */}
                <div className="mb-16">
                    <p className="mono-label text-muted-foreground/50 mb-4">// setup</p>
                    <h1 className="text-display text-5xl md:text-6xl mb-3">
                        <DecodeText text="Gear" onMount />
                    </h1>
                    <p className="text-[0.9rem] text-muted-foreground">The stuff I actually use.</p>
                </div>

                {/* My Setup */}
                <div className="mb-12">
                    <div className="section-label mb-3">my setup</div>
                    <div className="relative p-2 rounded border border-border/50 bg-muted/10 shadow-sm">
                        {/* Corner brackets, matching the schematic feel of the rest of the page */}
                        <span className="absolute left-0 top-0 w-3 h-3 border-l border-t border-accent/40 -translate-x-px -translate-y-px" />
                        <span className="absolute right-0 top-0 w-3 h-3 border-r border-t border-accent/40 translate-x-px -translate-y-px" />
                        <span className="absolute left-0 bottom-0 w-3 h-3 border-l border-b border-accent/40 -translate-x-px translate-y-px" />
                        <span className="absolute right-0 bottom-0 w-3 h-3 border-r border-b border-accent/40 translate-x-px translate-y-px" />

                        {/* scanline-hover: the saucer runs a scan over the desk when you hover it */}
                        <div className="relative w-full aspect-[4/3] rounded-md overflow-hidden ring-1 ring-border/40 shadow-inner scanline-hover">
                            <Image
                                src="/images/setup.jpg"
                                alt="My desk setup"
                                fill
                                sizes="(min-width: 768px) 672px, 100vw"
                                className="object-cover brightness-[1.05]"
                                quality={90}
                                priority
                            />
                            {/* Tints the whole photo toward the page background while keeping its own color, follows light/dark mode */}
                            <div className="absolute inset-0 bg-background/40 mix-blend-soft-light pointer-events-none" />
                            <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.25)] pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Sections */}
                <div className="space-y-12">
                    {gearSections.map((section, i) => (
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
