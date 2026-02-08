'use client'

import { cn } from '@/lib/utils'
import { useEffect, useState, useRef } from 'react'
import { useTheme } from 'next-themes'

interface SignatureProps {
    name: string
    className?: string
}

export function Signature({ name, className }: SignatureProps) {
    const [writing, setWriting] = useState(false)
    const [visible, setVisible] = useState(false)
    const [mounted, setMounted] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const { theme } = useTheme()

    // Ensure component is mounted on client before using theme
    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (!mounted) return

        // Skip animation in dark mode
        if (theme === 'dark') {
            setVisible(true)
            setWriting(true)
            return
        }

        // First make the element visible with opacity
        const visibleTimer = setTimeout(() => {
            setVisible(true)
        }, 300)

        // Then start the writing animation
        const writingTimer = setTimeout(() => {
            setWriting(true)
        }, 800)

        return () => {
            clearTimeout(visibleTimer)
            clearTimeout(writingTimer)
        }
    }, [theme, mounted])

    // Show a basic version until mounted to prevent hydration mismatch
    if (!mounted) {
        return (
            <div
                ref={containerRef}
                className={cn(
                    'signature-text text-6xl relative overflow-hidden',
                    'text-foreground/80 mt-4 pr-2',
                    'opacity-100',
                    className
                )}
                style={{
                    fontFamily: "'Better Signature', cursive",
                    fontWeight: 'normal',
                    fontStyle: 'normal'
                }}
            >
                <div className="relative inline-block">
                    <span className="relative">{name}</span>
                </div>
            </div>
        )
    }

    return (
        <div
            ref={containerRef}
            className={cn(
                'signature-text text-6xl relative overflow-hidden',
                'text-foreground/80 mt-4 pr-2',
                visible ? 'opacity-100' : 'opacity-0',
                'transition-opacity duration-500 ease-in-out',
                className
            )}
            style={{
                fontFamily: "'Better Signature', cursive",
                fontWeight: 'normal',
                fontStyle: 'normal'
            }}
        >
            <div className="relative inline-block">
                <span className="relative">{name}</span>
                {/* Masking overlay that hides then reveals the text from right to left */}
                {theme !== 'dark' && (
                    <span
                        className="absolute top-0 right-0 h-full transition-all ease-out bg-background"
                        style={{
                            width: writing ? '0%' : '100%',
                            transitionDuration: '1.8s',
                            transformOrigin: 'right',
                            transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)'
                        }}
                    ></span>
                )}
                {/* Cursor effect that follows the text appearing */}
                {writing && theme !== 'dark' && (
                    <span
                        className="absolute top-1 w-[3px] h-[80%] bg-green-500/70 rounded-full"
                        style={{
                            right: '0%',
                            animation: 'signatureCursorMove 1.8s cubic-bezier(0.22, 1, 0.36, 1) forwards'
                        }}
                    ></span>
                )}
            </div>
        </div>
    )
}
