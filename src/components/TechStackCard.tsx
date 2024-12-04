import { FaReact, FaRust, FaPython } from 'react-icons/fa'
import {
    SiTypescript,
    SiNextdotjs,
    SiTailwindcss,
    SiPostgresql,
    SiTrpc,
    SiDocker,
    SiAmazonwebservices,
    SiPrisma
} from 'react-icons/si'
import { motion } from 'framer-motion'

const TechStackCard = () => {
    const technologies = [
        { icon: SiTypescript, name: 'TypeScript' },
        { icon: SiNextdotjs, name: 'Next.js' },
        { icon: FaReact, name: 'React' },
        { icon: SiTailwindcss, name: 'Tailwind' },
        { icon: SiPrisma, name: 'Prisma' },
        { icon: SiTrpc, name: 'Trpc' },
        { icon: FaRust, name: 'Rust' },
        { icon: SiDocker, name: 'Docker' },
        { icon: SiAmazonwebservices, name: 'AWS' }
    ]

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: [0.25, 0.25, 0, 1],
                staggerChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: [0.25, 0.25, 0, 1]
            }
        }
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex h-full flex-col rounded-3xl bg-background p-8 lg:p-12"
        >
            <h2 className="mb-8 text-2xl font-bold">I mostly work with...</h2>
            <div className="grid grid-cols-3 gap-6 md:grid-cols-4 lg:grid-cols-5">
                {technologies
                    .slice(0, typeof window !== 'undefined' && window.innerWidth < 768 ? 6 : technologies.length)
                    .map((tech, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className="flex flex-col items-center justify-center rounded-xl bg-muted/50 p-5 transition-colors hover:bg-muted md:p-4"
                        >
                            <tech.icon className="mb-2 h-8 w-8" />
                            <span className="text-center text-sm text-muted-foreground">{tech.name}</span>
                        </motion.div>
                    ))}
            </div>
        </motion.div>
    )
}

export default TechStackCard
