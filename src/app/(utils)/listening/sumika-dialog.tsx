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
                className="inline font-medium underline decoration-green-500 decoration-2 underline-offset-4 hover:text-green-500 transition-colors cursor-pointer"
            >
                a whole year only listening to sumika
            </span>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-[300px] m-0">
                    <DialogTitle className="text-lg font-semibold mb-4">Sumika Wrapped</DialogTitle>
                    <Image
                        src="/sumika-wrapped.png"
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
