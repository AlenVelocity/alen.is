'use client'

import { motion } from 'framer-motion'
import { Github, Linkedin, Twitter } from 'lucide-react'
import Link from 'next/link'
import { NameAnimation } from '@/components/NameAnimation'
import TechStackCard from '@/components/TechStackCard'
import InterestsCard from '@/components/InterestsCard'
import { ExperienceTimeline } from '@/components/ExperienceTimeline'

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
    return (
        <section className="min-h-screen px-6 pb-16 pt-32 md:px-8">
            <div className="mx-auto max-w-7xl">
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
                        </div>

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
                    </motion.div>

                    {/* Right Column - Stacked Rectangles */}
                    <div className="flex h-full flex-col">
                        <TechStackCard />
                        <InterestsCard />
                    </div>
                </div>

                {/* Experience Section */}
                <div className="mt-32">
                    <h2 className="mb-16 text-center text-3xl font-bold">Experience</h2>
                    <ExperienceTimeline />
                </div>
            </div>
        </section>
    )
}
