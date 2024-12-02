import '@/styles/globals.css'
import { GeistSans } from 'geist/font/sans'
import { type Metadata } from 'next'
import { TRPCReactProvider } from '@/trpc/react'
import { Toaster } from 'sonner'
import AnimatedNavbar from '@/components/AnimatedNavbar'
import { ThemeProvider } from '@/components/theme/provider'
import CustomCursor from '@/components/CustomCursor'

export const metadata: Metadata = {
    title: 'Alen is WHAT?',
    description: 'Erm',
    icons: [{ rel: 'icon', url: '/favicon.ico' }]
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" className={`${GeistSans.variable}`}>
            <body>
                <TRPCReactProvider>
                    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
                        <CustomCursor />
                        <div className="flex min-h-[100dvh] flex-col transition-colors duration-200">
                            <AnimatedNavbar />
                            <main className="flex-grow">{children}</main>
                        </div>
                        <Toaster />
                    </ThemeProvider>
                </TRPCReactProvider>
            </body>
        </html>
    )
}
