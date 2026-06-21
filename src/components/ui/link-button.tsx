import Link from 'next/link'
import { cn } from '@/lib/utils'

interface LinkButtonProps {
    href: string
    children: React.ReactNode
    className?: string
    target?: string
}

export function LinkButton({ href, children, className, target }: LinkButtonProps) {
    return (
        <Link
            href={href}
            target={target}
            className={cn(
                'font-medium text-foreground underline decoration-accent/40 decoration-1 underline-offset-4 hover:decoration-accent hover:text-accent transition-all duration-200',
                className
            )}
        >
            {children}
        </Link>
    )
}
