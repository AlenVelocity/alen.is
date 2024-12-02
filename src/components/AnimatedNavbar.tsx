'use client'

import { motion, Variants, useAnimationControls } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { ModeToggle } from './theme/toggle'

const navItems = [
    {
        path: '/#works',
        name: 'WORKS'
    },
    {
        path: '/#experience',
        name: 'EXPERIENCE'
    }
]

// Navbar animation variants
const navbarVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.5,
            ease: 'easeOut',
            staggerChildren: 0.1
        }
    }
}

// Nav item animation variants
const itemVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.5 }
    },
    hover: {
        scale: 1.05,
        transition: { duration: 0.2 }
    }
}

const generateRandomValues = (index: number) => ({
    x: (Math.random() - 0.5) * 50,
    y: (Math.random() - 0.5) * 40 - 10,
    rotate: (Math.random() - 0.5) * 45,
    scale: 0.8 + Math.random() * 0.6
})

const letterVariants: Variants = {
    hidden: {
        opacity: 0,
        y: 20,
        rotate: 10
    },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        rotate: 0,
        transition: {
            delay: i * 0.1,
            duration: 0.5,
            ease: [0.2, 0.65, 0.3, 0.9]
        }
    }),
    hovered: ({ x, y, rotate, scale }: any) => ({
        x,
        y,
        rotate,
        scale,
        transition: {
            duration: 0.4,
            ease: [0.2, 0.65, 0.3, 0.9]
        }
    })
}

const menuVariants: Variants = {
    closed: {
        opacity: 0,
        x: '100%',
        transition: {
            duration: 0.2,
            staggerChildren: 0.1,
            staggerDirection: -1,
            when: 'afterChildren'
        }
    },
    open: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.3,
            staggerChildren: 0.1,
            when: 'beforeChildren'
        }
    }
}

const menuItemVariants: Variants = {
    closed: {
        opacity: 0,
        x: 50
    },
    open: {
        opacity: 1,
        x: 0
    }
}

const hamburgerVariants: Variants = {
    closed: {
        rotate: 0
    },
    open: {
        rotate: 180
    }
}

export default function AnimatedNavbar() {
    const pathname = usePathname()
    const logoText = 'Alen.Is'
    const [randomValues, setRandomValues] = useState<any[]>([])
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const controls = useAnimationControls()
    const [isScrolled, setIsScrolled] = useState(false)
    const [isAtTop, setIsAtTop] = useState(true)

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY
            setIsScrolled(scrollPosition > 20)
            setIsAtTop(scrollPosition < 5)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const regenerateRandomValues = () => {
        const newValues = Array.from({ length: logoText.length }, (_, i) => generateRandomValues(i))
        setRandomValues(newValues)
    }

    const handleHoverStart = () => {
        regenerateRandomValues()
    }

    return (
        <div className="fixed left-0 top-0 z-50 w-full">
            <motion.nav
                className={`mx-auto transition-all duration-300 ${
                    isAtTop
                        ? 'w-full rounded-none border-b-0'
                        : 'relative mx-auto mt-4 w-[95%] max-w-[1400px] rounded-2xl border shadow-lg md:w-[90%]'
                } ${
                    isScrolled
                        ? 'border-border bg-background/80 backdrop-blur-md dark:bg-background/70'
                        : 'bg-transparent backdrop-blur-sm'
                }`}
                initial="hidden"
                animate="visible"
                variants={navbarVariants}
            >
                <div className="mx-auto flex items-center justify-between px-4 py-4 md:px-6">
                    <motion.div
                        variants={itemVariants}
                        className="flex items-center"
                        whileHover="hovered"
                        onHoverStart={handleHoverStart}
                    >
                        <Link href="/" className="flex overflow-visible px-4 py-2 text-2xl font-bold tracking-tight">
                            {logoText.split('').map((letter, i) => (
                                <motion.span
                                    key={i}
                                    custom={randomValues[i] || { x: 0, y: 0, rotate: 0, scale: 1 }}
                                    variants={letterVariants}
                                    className="relative inline-block"
                                    style={{
                                        originX: 0.5,
                                        originY: 0.7,
                                        textShadow: '0 0 10px rgba(0,0,0,0.1)'
                                    }}
                                >
                                    {letter}
                                </motion.span>
                            ))}
                        </Link>

                        {pathname !== '/' && (
                            <div className="flex items-center gap-4">
                                <span className="text-2xl text-muted-foreground">/</span>
                                <span className="text-2xl">{pathname.split('/')[1]}</span>
                            </div>
                        )}
                    </motion.div>

                    {/* Desktop Navigation */}
                    <div className="hidden items-center gap-8 md:flex">
                        {navItems.map((item) => {
                            const isActive = pathname === item.path
                            return (
                                <motion.div
                                    key={item.path}
                                    variants={itemVariants}
                                    whileHover="hover"
                                    className="flex items-center"
                                >
                                    <Link
                                        href={item.path}
                                        className="relative flex items-center justify-center px-3 py-2"
                                    >
                                        <span className="relative z-10 text-sm font-medium tracking-wide">
                                            {item.name}
                                        </span>
                                        {isActive && (
                                            <motion.div
                                                className="absolute inset-0 rounded-md bg-muted/50"
                                                layoutId="navbar-active"
                                                transition={{
                                                    type: 'spring',
                                                    stiffness: 350,
                                                    damping: 30
                                                }}
                                            />
                                        )}
                                    </Link>
                                </motion.div>
                            )
                        })}
                        <motion.div variants={itemVariants} className="hidden md:block">
                            <ModeToggle />
                        </motion.div>
                    </div>
                    <motion.div variants={itemVariants} className="md:hidden">
                        <ModeToggle />
                    </motion.div>
                </div>
            </motion.nav>
        </div>
    )
}
