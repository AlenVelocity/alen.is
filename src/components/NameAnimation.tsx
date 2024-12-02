'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useState } from 'react'

export const NameAnimation = () => {
    const [isHovered, setIsHovered] = useState(false)

    return (
        <span
            className="relative inline-block align-baseline"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <span className="invisible inline-block">Alen</span>
            <AnimatePresence mode="wait">
                {!isHovered ? (
                    <motion.span
                        key="text"
                        className="absolute left-0 top-0 inline-block italic"
                        initial={{ rotate: 720, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -720, opacity: 0 }}
                        transition={{
                            duration: 0.6,
                            ease: 'easeOut'
                        }}
                    >
                        Alen
                    </motion.span>
                ) : (
                    <motion.div
                        key="logo"
                        initial={{ rotate: 720, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -720, opacity: 0 }}
                        transition={{
                            duration: 0.6,
                            ease: 'easeOut'
                        }}
                        className="absolute left-0 top-0 pt-1"
                    >
                        <Image
                            src="/logo.png"
                            alt="Logo"
                            width={90}
                            height={90}
                            className="scale-125 object-cover"
                            priority
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </span>
    )
}
