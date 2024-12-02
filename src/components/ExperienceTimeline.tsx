'use client'

import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

interface Experience {
    title: string
    company: string
    period: string
}

const experiences: Experience[] = [
    {
        title: 'Founding Engineer',
        company: 'Plazza',
        period: 'March 2024 - Present'
    },
    {
        title: 'Software Development Engineer',
        company: 'xAGI (PocoAI)',
        period: 'March 2024 - Present'
    },
    {
        title: 'Founding Software Engineer - AI',
        company: 'EquivoxAI',
        period: 'May 2023 - Jan 2024'
    },
    {
        title: 'Software Development Engineer',
        company: 'DataEquinox',
        period: 'Dec 2021 - Sep 2022'
    },
    {
        title: 'Founder',
        company: 'Synthesized Infinity',
        period: 'July 2020 - Present'
    }
]

function ExperienceCard({ experience, index }: { experience: Experience; index: number }) {
    const [isFlipped, setIsFlipped] = useState(false)
    const cardRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent | TouchEvent) {
            if (cardRef.current && !cardRef.current.contains(event.target as Node) && isFlipped) {
                setIsFlipped(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        document.addEventListener('touchstart', handleClickOutside)

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            document.removeEventListener('touchstart', handleClickOutside)
        }
    }, [isFlipped])

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="perspective-1000 relative h-32"
            onHoverStart={() => setIsFlipped(true)}
            onHoverEnd={() => setIsFlipped(false)}
            onTap={(e) => {
                e.stopPropagation()
                setIsFlipped(!isFlipped)
            }}
        >
            <motion.div
                className="absolute h-full w-full"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                style={{ transformStyle: 'preserve-3d' }}
            >
                {/* Front of card */}
                <div
                    className={`backface-hidden absolute flex h-full w-full items-center justify-center rounded-xl border border-border p-6 shadow-lg ${
                        index % 2 === 0 ? 'bg-card' : 'bg-card/50'
                    }`}
                    style={{ WebkitBackfaceVisibility: 'hidden' }}
                >
                    <h3 className="text-2xl font-bold">{experience.company}</h3>
                </div>

                {/* Back of card */}
                <div
                    className="backface-hidden absolute flex h-full w-full flex-col items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 p-6 text-white shadow-lg [transform:rotateY(180deg)] dark:border-zinc-200 dark:bg-white dark:text-zinc-900"
                    style={{ WebkitBackfaceVisibility: 'hidden' }}
                >
                    <h4 className="text-xl font-semibold text-white dark:text-zinc-900">{experience.title}</h4>
                    <p className="text-sm text-zinc-400 dark:text-zinc-600">{experience.period}</p>
                </div>
            </motion.div>
        </motion.div>
    )
}

export function ExperienceTimeline() {
    return (
        <div className="mx-auto max-w-md px-4">
            <div className="space-y-4">
                {experiences.map((experience, index) => (
                    <ExperienceCard key={experience.company} experience={experience} index={index} />
                ))}
            </div>
        </div>
    )
}
