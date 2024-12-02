'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface ClientCardProps {
    name: string
    description: string
    side: 'left' | 'right'
    image: string
}

export function ClientCard({ name, description, side, image }: ClientCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: side === 'left' ? -100 : 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{
                duration: 0.8,
                ease: [0.25, 0.25, 0, 1]
            }}
            className={`flex ${
                side === 'left' ? 'justify-center lg:justify-end lg:pr-12' : 'justify-center lg:justify-start lg:pl-12'
            }`}
        >
            <Card className="w-full max-w-xl overflow-hidden bg-card/95">
                <CardHeader className="relative h-48 p-0">
                    <Image src={image} alt={name} fill className="object-cover" />
                </CardHeader>
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={{
                        hidden: {
                            clipPath: 'circle(0% at 50% 50%)',
                            opacity: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.1)'
                        },
                        visible: {
                            clipPath: 'circle(100% at 50% 50%)',
                            opacity: 1,
                            backgroundColor: 'rgba(0, 0, 0, 0)',
                            transition: {
                                duration: 1.2,
                                delay: 0.3,
                                ease: [0.4, 0, 0.2, 1]
                            }
                        }
                    }}
                >
                    <CardContent className="p-8">
                        <CardTitle className="mb-4 text-2xl">{name}</CardTitle>
                        <CardDescription className="text-base">{description}</CardDescription>
                    </CardContent>
                </motion.div>
            </Card>
        </motion.div>
    )
}
