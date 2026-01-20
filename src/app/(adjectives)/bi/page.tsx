'use client'

import { CenteredPage } from '@/components/ui/centered-page'
import { useState } from 'react'

const Heart = ({ delay, color }: { delay: string; color: string }) => (
    <span 
        className="inline-block animate-float opacity-0"
        style={{ 
            animationDelay: delay, 
            animationFillMode: 'forwards',
            color 
        }}
    >
        ♥
    </span>
)

const PrideStripe = ({ color, delay, width = "w-full" }: { color: string; delay: string; width?: string }) => (
    <div 
        className={`h-3 ${width} rounded-full animate-fade-in-up opacity-0`}
        style={{ backgroundColor: color, animationDelay: delay, animationFillMode: 'forwards' }}
    />
)

const fingerGunPhrases = [
    "can't sit straight, won't sit straight",
    "i contain multitudes (of crushes)",
    "my type? yes",
    "gender? irrelevant.",
    "50/50? more like 100/100",
    "equal opportunity admirer",
]

export default function Bi() {
    const [clickCount, setClickCount] = useState(0)
    const [currentPhrase, setCurrentPhrase] = useState<string | null>(null)
    
    const handleClick = () => {
        setClickCount(prev => prev + 1)
        setCurrentPhrase(fingerGunPhrases[Math.floor(Math.random() * fingerGunPhrases.length)])
    }

    return (
        <CenteredPage className="gap-8 overflow-hidden !min-h-0 h-[calc(100dvh-5rem)]">
            {/* Floating hearts */}
            <div className="flex gap-3 text-2xl">
                <Heart delay="0s" color="#D60270" />
                <Heart delay="0.1s" color="#9B4F96" />
                <Heart delay="0.2s" color="#0038A8" />
                <Heart delay="0.3s" color="#D60270" />
                <Heart delay="0.4s" color="#9B4F96" />
                <Heart delay="0.5s" color="#0038A8" />
            </div>

            {/* Bisexual flag */}
            <div 
                className="flex flex-col gap-1.5 w-40 cursor-pointer transition-transform hover:scale-105 active:scale-95"
                onClick={handleClick}
                title="click me 👀"
            >
                <PrideStripe color="#D60270" delay="0.1s" />
                <PrideStripe color="#9B4F96" delay="0.2s" />
                <PrideStripe color="#0038A8" delay="0.3s" />
            </div>
    
            {/* Interactive phrase - fixed height to prevent layout shift */}
            <div className="h-7 flex items-center justify-center">
                {currentPhrase && (
                    <p 
                        key={clickCount}
                        className="text-lg font-medium animate-fade-in-up bg-gradient-to-r from-[#D60270] via-[#9B4F96] to-[#0038A8] bg-clip-text text-transparent"
                    >
                        {currentPhrase}
                    </p>
                )}
            </div>
            
            {/* Message */}
            <div className="text-center space-y-4 animate-fade-in-up" style={{ animationDelay: '0.7s', animationFillMode: 'forwards', opacity: 0 }}>
                <h1 className="text-3xl md:text-4xl font-bold">
                    <span className="bg-gradient-to-r from-[#D60270] via-[#9B4F96] to-[#0038A8] bg-clip-text text-transparent">
                        everyone's cute{' '}
                    </span>
                    <span className="text-muted-foreground font-normal text-2xl">
                        not my fault
                    </span>
                </h1>
                
                <p className="text-muted-foreground text-sm italic">
                    (no I will not pick a side)
                </p>
                
                <div className="flex items-center justify-center gap-2 text-muted-foreground/70 text-xs">
                    <span>chronically indecisive</span>
                    <span>•</span>
                    <span>cannot sit properly</span>
                    <span>•</span>
                    <span>too many hoodies</span>
                </div>
                
                <div className="w-20 h-1.5 bg-gradient-to-r from-pink-400 via-yellow-400 to-blue-400 mx-auto rounded-full" />
                
                {/* Fixed height to prevent layout shift */}
                <div className="h-4">
                    {clickCount > 0 && (
                        <p className="text-xs text-muted-foreground/50 animate-fade-in">
                            finger guns deployed: {clickCount}
                        </p>
                    )}
                </div>
            </div>
        </CenteredPage>
    )
}

