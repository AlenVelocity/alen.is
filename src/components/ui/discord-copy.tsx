'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface DiscordCopyProps {
    username: string
    className?: string
    children?: React.ReactNode
}

export function DiscordCopy({ username, className, children }: DiscordCopyProps) {
    const [copied, setCopied] = useState(false)

    const handleCopyToClipboard = () => {
        navigator.clipboard
            .writeText(username)
            .then(() => {
                setCopied(true)
                toast.success('Discord username copied to clipboard!')

                // Reset copied state after a delay
                setTimeout(() => {
                    setCopied(false)
                }, 2000)
            })
            .catch((err) => {
                console.error('Failed to copy: ', err)
                toast.error('Failed to copy to clipboard')
            })
    }

    return (
        <button
            onClick={handleCopyToClipboard}
            className={cn(
                'text-sm font-medium underline decoration-green-500 decoration-2 underline-offset-4 hover:text-green-500 transition-colors',
                copied && 'text-green-500',
                className
            )}
        >
            {children || username}
        </button>
    )
}
