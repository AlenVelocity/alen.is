'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { Github, Linkedin, Twitter } from 'lucide-react'
import Link from 'next/link'
import { NameAnimation } from '@/components/NameAnimation'
import TechStackCard from '@/components/TechStackCard'
import InterestsCard from '@/components/InterestsCard'
import { ExperienceTimeline } from '@/components/ExperienceTimeline'
import { api } from '@/trpc/server'
import CoolPoll from '@/components/CoolPoll'

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: [0.25, 0.25, 0, 1]
        }
    }
}

const clientData = [
    {
        name: 'Paragon',
        description:
            'Collaborated on Valdle, an arcade game for the official Valorant Discord server with over 600k members',
        side: 'left',
        image: '/paragon.jpg'
    },
    {
        name: 'RealmChat',
        description: 'Built superfast WhatsApp e-commerce solutions',
        side: 'right',
        image: '/realmchat.jpg'
    }
] as const

export default function Home() {
    const { scrollYProgress } = useScroll()
    const experienceY = useTransform(scrollYProgress, [0, 0.3], [0, -200])
    const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.3])

    return (
        <div className="relative scroll-smooth">
            <motion.section className="relative z-10 min-h-screen bg-background" style={{ opacity: heroOpacity }}>
                <div className="mx-auto max-w-7xl px-6 pb-16 pt-20 md:px-8 md:pt-32">
                    <div className="grid min-h-[calc(100vh-12rem)] grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
                        {/* Left Rectangle - Introduction */}
                        <motion.div
                            variants={cardVariants}
                            initial="hidden"
                            animate="visible"
                            className="flex h-full flex-col justify-between rounded-3xl bg-background p-8 lg:p-12"
                        >
                            <div className="space-y-8">
                                <h1 className="text-4xl font-bold leading-tight md:text-5xl">
                                    Hey there, I'm <NameAnimation />
                                </h1>
                                <p className="text-lg leading-relaxed text-muted-foreground">
                                    I like to make stuff. Hope you find my page{' '}
                                    <Link href="/cool" className="italic underline">
                                        cool
                                    </Link>
                                    .
                                </p>
                                <div className="mt-12 flex gap-6">
                                    <Link
                                        href="https://twitter.com/alenvelocity"
                                        className="transition-colors hover:text-primary"
                                    >
                                        <Twitter className="h-6 w-6" />
                                    </Link>
                                    <Link
                                        href="https://github.com/alenvelocity"
                                        className="transition-colors hover:text-primary"
                                    >
                                        <Github className="h-6 w-6" />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>

                        {/* Right Column - Stacked Rectangles */}
                        <div className="flex h-full flex-col">
                            <TechStackCard />
                        </div>
                    </div>
                </div>
            </motion.section>

            <motion.div
                className="relative z-20 bg-background"
                style={{
                    y: experienceY
                }}
            >
                <ExperienceTimeline />
            </motion.div>
        </div>
    )
}
