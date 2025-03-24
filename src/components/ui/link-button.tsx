import Link from "next/link"
import { cn } from "@/lib/utils"

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
        "text-sm font-medium underline decoration-green-500 decoration-2 underline-offset-4 hover:text-green-500 transition-colors",
        className
      )}
    >
      {children}
    </Link>
  )
} 