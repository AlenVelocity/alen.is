import { cn } from '@/lib/utils'

interface CenteredPageProps {
    children: React.ReactNode
    className?: string
}

export function CenteredPage({ children, className }: CenteredPageProps) {
    return (
        <div
            className={cn(
                'min-h-[calc(100dvh-var(--navbar-height))] flex flex-col items-center justify-center px-4 py-8',
                className
            )}
        >
            {children}
        </div>
    )
}
