'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function CustomCursor() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const [isHovering, setIsHovering] = useState(false)
    const [isVisible, setIsVisible] = useState(false)
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        // Check if device is mobile
        const checkMobile = () => {
            setIsMobile(window.matchMedia('(pointer: coarse)').matches)
        }

        checkMobile()
        window.addEventListener('resize', checkMobile)

        const updateMousePosition = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY })
            setIsVisible(true)
        }

        const handleMouseEnter = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            if (target.closest('a, button, [role="button"]')) {
                setIsHovering(true)
            }
        }

        const handleMouseLeave = () => {
            setIsHovering(false)
        }

        window.addEventListener('mousemove', updateMousePosition)
        document.addEventListener('mouseover', handleMouseEnter)
        document.addEventListener('mouseout', handleMouseLeave)

        return () => {
            window.removeEventListener('mousemove', updateMousePosition)
            document.removeEventListener('mouseover', handleMouseEnter)
            document.removeEventListener('mouseout', handleMouseLeave)
            window.removeEventListener('resize', checkMobile)
        }
    }, [])

    if (isMobile || !isVisible) return null

    return (
        <>
            <motion.div
                className="pointer-events-none fixed left-0 top-0 z-[100] h-6 w-6 rounded-full bg-white mix-blend-difference"
                animate={{
                    x: mousePosition.x - 12,
                    y: mousePosition.y - 12,
                    scale: isHovering ? 2 : 1
                }}
                transition={{
                    type: 'tween',
                    ease: 'linear',
                    duration: 0
                }}
            />
            <motion.div
                className="pointer-events-none fixed left-0 top-0 z-[100] h-12 w-12 rounded-full border-2 border-white mix-blend-difference"
                animate={{
                    x: mousePosition.x - 24,
                    y: mousePosition.y - 24,
                    scale: isHovering ? 1.5 : 1
                }}
                transition={{
                    type: 'tween',
                    ease: 'linear',
                    duration: 0.1
                }}
            />
        </>
    )
}
