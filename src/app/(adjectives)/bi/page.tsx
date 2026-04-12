const PrideStripe = ({ color, delay }: { color: string; delay: string }) => (
    <div
        className="h-3 w-full rounded-sm animate-fade-in-up opacity-0"
        style={{ backgroundColor: color, animationDelay: delay, animationFillMode: 'forwards' }}
    />
)

export default function Bi() {
    return (
        <div className="flex flex-col items-center gap-6 sm:gap-8 px-4">
            {/* Bisexual flag */}
            <div className="flex flex-col gap-1.5 w-44" style={{ rotate: '-1deg' }}>
                <PrideStripe color="#D60270" delay="0.1s" />
                <PrideStripe color="#9B4F96" delay="0.2s" />
                <PrideStripe color="#0038A8" delay="0.3s" />
            </div>

            {/* Message */}
            <div className="text-center space-y-3 animate-fade-in-up" style={{ animationDelay: '0.5s', animationFillMode: 'forwards', opacity: 0 }}>
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

                <div className="flex items-center justify-center gap-2 text-muted-foreground/70 text-xs flex-wrap">
                    <span>can't sit straight</span>
                    <span className="text-accent">~</span>
                    <span>foldable phone for split screen (ykwim)</span>
                    <span className="text-accent">~</span>
                    <span>too many hoodies</span>
                </div>
            </div>
        </div>
    )
}
