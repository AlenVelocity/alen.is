'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { getPersona } from '@/lib/persona'

interface DiscordCopyProps {
    username: string
    className?: string
    children?: React.ReactNode
}

/** A Discord handle in running text. Looks like the links beside it; a click copies it. */
export function DiscordCopy({ username, className, children }: DiscordCopyProps) {
    const [copied, setCopied] = useState(false)

    const handleCopyToClipboard = () => {
        // A toast is made at the moment of the click, so this asks who is in right now
        const ban = getPersona() === 'ban'
        // No clipboard on an insecure origin: fail into the toast that spells the name out
        const written = navigator.clipboard?.writeText(username) ?? Promise.reject(new Error('no clipboard'))
        written
            .then(() => {
                setCopied(true)
                toast.success(ban ? "Copied. You're welcome." : 'copied')
                setTimeout(() => setCopied(false), 2000)
            })
            .catch((err) => {
                console.error('Failed to copy: ', err)
                toast.error(
                    ban
                        ? `Your browser refused. It's ${username}. Type it.`
                        : `couldn't copy, the username is ${username}`
                )
            })
    }

    return (
        <button
            type="button"
            onClick={handleCopyToClipboard}
            className={cn(
                'font-medium text-foreground underline decoration-accent/40 decoration-1 underline-offset-4 hover:decoration-accent hover:text-accent transition-colors duration-200 cursor-pointer',
                copied && 'text-accent decoration-accent',
                className
            )}
        >
            {children || username}
        </button>
    )
}
