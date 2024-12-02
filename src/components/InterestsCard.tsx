import { motion } from 'framer-motion'
import { GamepadIcon, Music2Icon, UtensilsIcon, MoonIcon } from 'lucide-react'

const InterestsCard = () => {
    const interests = [
        { icon: GamepadIcon, name: 'Overwatch' },
        { icon: Music2Icon, name: 'Sumika' },
        { icon: UtensilsIcon, name: 'Chicken' },
        { icon: MoonIcon, name: 'Sleeping' }
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
            <h2 className="mb-8 text-2xl font-bold">Things I like...</h2>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                {interests.map((interest, index) => (
                    <motion.div
                        key={index}
                        variants={itemVariants}
                        className="flex flex-col items-center justify-center rounded-xl bg-muted/50 p-4 transition-colors hover:bg-muted"
                    >
                        <interest.icon className="mb-2 h-8 w-8" />
                        <span className="text-center text-sm text-muted-foreground">{interest.name}</span>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    )
}

export default InterestsCard
