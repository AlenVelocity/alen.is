import { Metadata } from 'next'
import { CenteredPage } from '@/components/ui/centered-page'

export const metadata: Metadata = {
    title: 'bi',
    description: 'Alen is whaaat',
    openGraph: {
        title: 'Alen loves everyone',
        description: 'Love is love'
    }
}

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

export default function Bi() {
    return (
        <CenteredPage className="gap-10">
            {/* Floating hearts */}
            <div className="flex gap-3 text-2xl">
                <Heart delay="0s" color="#D60270" />
                <Heart delay="0.1s" color="#9B4F96" />
                <Heart delay="0.2s" color="#0038A8" />
                <Heart delay="0.3s" color="#FF218C" />
                <Heart delay="0.4s" color="#FFD800" />
                <Heart delay="0.5s" color="#21B1FF" />
            </div>

            {/* Pride flags side by side */}
            <div className="flex gap-8">
                {/* Bisexual */}
                <div className="flex flex-col gap-1.5 w-28">
                    <PrideStripe color="#D60270" delay="0.1s" />
                    <PrideStripe color="#9B4F96" delay="0.2s" />
                    <PrideStripe color="#0038A8" delay="0.3s" />
                </div>
                {/* Pansexual */}
                <div className="flex flex-col gap-1.5 w-28">
                    <PrideStripe color="#FF218C" delay="0.4s" />
                    <PrideStripe color="#FFD800" delay="0.5s" />
                    <PrideStripe color="#21B1FF" delay="0.6s" />
                </div>
            </div>
            
            {/* Message */}
            <div className="text-center space-y-4 animate-fade-in-up" style={{ animationDelay: '0.7s', animationFillMode: 'forwards', opacity: 0 }}>
                <h1 className="text-3xl md:text-4xl font-bold">
                    <span className="bg-gradient-to-r from-[#D60270] via-[#9B4F96] to-[#0038A8] bg-clip-text text-transparent">
                        I don't{' '}
                    </span>
                    <span className="bg-gradient-to-r from-[#FF218C] via-[#FFD800] to-[#21B1FF] bg-clip-text text-transparent">
                        discriminate
                    </span>
                </h1>
                
                <p className="text-muted-foreground text-lg">
                    love who you love 💕
                </p>
                
                <div className="w-20 h-1.5 bg-gradient-to-r from-pink-400 via-yellow-400 to-blue-400 mx-auto rounded-full animate-pulse-subtle" />
            </div>
        </CenteredPage>
    )
}

