import { api } from '@/trpc/server'
import { Metadata } from 'next'
import { PageTransition } from '@/components/ui/page-transition'

export const metadata: Metadata = {
    title: 'Gay',
    description: 'Am I gay?'
}

const FloatingHeart = ({ delay, x, y }: { delay: number; x: string; y: string }) => (
    <div 
        className="absolute animate-float opacity-20 text-2xl select-none pointer-events-none"
        style={{ 
            animationDelay: `${delay}s`,
            left: x,
            top: y,
            animationDuration: '3s'
        }}
    >
        💖
    </div>
)

const PrideFlag = () => (
    <div className="group cursor-default">
        <div className="flex shadow-2xl shadow-purple-500/20 rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-3xl hover:shadow-purple-500/30 hover:scale-105">
            {/* Bisexual Pride Flag */}
            <div className="flex flex-col w-32 transition-all duration-500 group-hover:w-36 relative">
                <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[#D60270] animate-fill-right" style={{ animationDelay: '0s' }}></div>
                </div>
                <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[#9B4F96] animate-fill-right" style={{ animationDelay: '0.5s' }}></div>
                </div>
                <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[#0038A8] animate-fill-right" style={{ animationDelay: '1s' }}></div>
                </div>
            </div>
            {/* Pansexual Pride Flag */}
            <div className="flex flex-col w-32 transition-all duration-500 group-hover:w-36 relative">
                <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[#FF218C] animate-fill-right" style={{ animationDelay: '1.5s' }}></div>
                </div>
                <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[#FFD800] animate-fill-right" style={{ animationDelay: '2s' }}></div>
                </div>
                <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[#21B1FF] animate-fill-right" style={{ animationDelay: '2.5s' }}></div>
                </div>
            </div>
        </div>
    </div>
)

export default async function Gay() {
    return (
        <PageTransition>
            <div className="flex flex-col items-center justify-center min-h-[80vh] gap-12 py-12 pt-24 relative overflow-hidden">
                {/* Floating hearts background */}
                <div className="fixed inset-0 pointer-events-none">
                    <FloatingHeart delay={0} x="10%" y="20%" />
                    <FloatingHeart delay={1} x="80%" y="15%" />
                    <FloatingHeart delay={2} x="15%" y="70%" />
                    <FloatingHeart delay={3} x="85%" y="60%" />
                    <FloatingHeart delay={4} x="50%" y="10%" />
                    <FloatingHeart delay={2.5} x="30%" y="80%" />
                    <FloatingHeart delay={1.5} x="70%" y="75%" />
                </div>

                <div className="flex flex-col items-center gap-8">
                    {/* Pride Flag */}
                    <div>
                        <PrideFlag />
                    </div>
                    
                    {/* Main Message */}
                    <div className="text-center space-y-4">
                        <div className="text-3xl md:text-4xl font-bold leading-tight">
                            <div className="mb-2">
                                <span className="bg-gradient-to-r from-[#D60270] via-[#9B4F96] to-[#0038A8] bg-clip-text text-transparent">
                                    I don't{' '}
                                </span>
                            </div>
                            <div>
                                <span className="bg-gradient-to-r from-[#FF218C] via-[#FFD800] to-[#21B1FF] bg-clip-text text-transparent">
                                    discriminate
                                </span>
                            </div>
                        </div>
                        
                        <div className="w-24 h-1 bg-gradient-to-r from-pink-400 via-yellow-400 to-blue-400 mx-auto rounded-full animate-pulse"></div>
                    </div>                   
                </div>

                {/* Background decoration */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-1/4 left-0 w-96 h-96 bg-gradient-to-r from-pink-400/5 to-blue-400/5 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-gradient-to-r from-purple-400/5 to-yellow-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>
            </div>
        </PageTransition>
    )
}
