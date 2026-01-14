'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'

export function SumikaDialog() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <span
                onClick={() => setIsOpen(true)}
                className="font-medium underline decoration-accent/50 decoration-2 underline-offset-4 hover:decoration-accent transition-colors cursor-pointer"
            >
                a whole year only listening to sumika
            </span>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-[300px] p-6">
                    <DialogTitle className="text-lg font-semibold mb-4">Sumika Wrapped</DialogTitle>
                    <Image
                        src="/images/sumika-wrapped.png"
                        alt="My year of sumika listening statistics"
                        width={250}
                        height={250}
                        className="rounded-lg"
                    />
                </DialogContent>
            </Dialog>
        </>
    )
}
