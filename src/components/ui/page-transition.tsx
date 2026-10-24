interface PageTransitionProps {
    children: React.ReactNode
}

/**
 * Page entrance. A CSS animation rather than framer-motion, so it starts at first
 * paint instead of waiting for hydration (framer ships `opacity: 0` in the server
 * HTML), and it ends on `filter/transform: none` rather than leaving `blur(0px)`
 * behind, which would trap position:fixed children inside the page.
 */
export function PageTransition({ children }: PageTransitionProps) {
    return <div className="animate-page-in">{children}</div>
}
