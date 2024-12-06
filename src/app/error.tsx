'use client'

import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RotateCcw } from 'lucide-react'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center space-y-8 text-center"
            >
                <AlertTriangle className="h-16 w-16 text-destructive" />
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold">Something went wrong!</h1>
                    <p className="text-muted-foreground">{error.message || 'An unexpected error occurred'}</p>
                </div>
                <Button onClick={reset} className="gap-2">
                    <RotateCcw className="h-4 w-4" />
                    Try again
                </Button>
            </motion.div>
        </div>
    )
}
