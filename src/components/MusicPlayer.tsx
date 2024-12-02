'use client'

import { motion } from 'framer-motion'

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

export const MusicPlayer = () => {
    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            className="flex-1 rounded-3xl border bg-background p-6 shadow-sm lg:p-8"
        >
            <div className="flex items-center gap-6 lg:gap-8">
                <div className="aspect-square w-1/2">
                    <div className="flex h-full w-full animate-spin-slow items-center justify-center rounded-full bg-muted">
                        <div className="h-4 w-4 rounded-full bg-primary"></div>
                    </div>
                </div>
                <div className="flex-1 space-y-2">
                    <p className="text-sm text-muted-foreground">Now Playing</p>
                    <h3 className="text-xl font-semibold">Song Name</h3>
                    <p className="text-muted-foreground">Artist Name</p>
                </div>
            </div>
        </motion.div>
    )
}
