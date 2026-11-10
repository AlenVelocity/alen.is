'use client'

import { useTheme } from 'next-themes'
import { Toaster as Sonner } from 'sonner'

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
    const { resolvedTheme = 'dark' } = useTheme()

    return (
        <Sonner
            theme={resolvedTheme as ToasterProps['theme']}
            className="toaster group"
            toastOptions={{
                classNames: {
                    // font-mono-ui and rounded-sm: sonner ships its own sans and an 8px
                    // radius, which made toasts the one thing on the site in neither voice
                    toast: 'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:font-mono-ui group-[.toaster]:text-[0.8rem] group-[.toaster]:rounded-sm',
                    description: 'group-[.toast]:text-muted-foreground',
                    actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
                    cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground'
                }
            }}
            {...props}
        />
    )
}

export { Toaster }
