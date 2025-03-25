"use client"

import type React from "react"

import { Inter } from "next/font/google"
import "./globals.css"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Toaster } from "sonner"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

const inter = Inter({ subsets: ["latin"] })

function MainNav() {
  const pathname = usePathname()
  const [isMobile, setIsMobile] = useState(false)
  
  // Check if current path is home, experience or projects
  const isMainPath = pathname === "/" || pathname === "/experience" || pathname === "/projects"
  
  // Handle responsive detection
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)
    
    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  // Hide nav on mobile for non-main pages
  if (isMobile && !isMainPath) {
    return null
  }

  return (
    <nav className="flex gap-6">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <Link
          href="/experience"
          className={cn(
            "text-sm transition-colors hover:text-foreground/80 hover:underline hover:decoration-green-500 hover:decoration-2",
            pathname === "/experience"
              ? "text-foreground underline decoration-green-500 decoration-2"
              : "text-foreground/60",
          )}
        >
          Experience
        </Link>
      </motion.div>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <Link
          href="/projects"
          className={cn(
            "text-sm transition-colors hover:text-foreground/80 hover:underline hover:decoration-green-500 hover:decoration-2",
            pathname === "/projects"
              ? "text-foreground underline decoration-green-500 decoration-2"
              : "text-foreground/60",
          )}
        >
          Projects
        </Link>
      </motion.div>
    </nav>
  )
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [isMobile, setIsMobile] = useState(false)
  
  // Get current page name with proper formatting
  const getPageName = () => {
    if (pathname === "/") return ""
    
    // Remove trailing slash if present and get the part after the first slash
    let pagePath = pathname.endsWith("/") ? pathname.slice(1, -1) : pathname.slice(1)
    
    // Capitalize first letter
    return pagePath.charAt(0).toUpperCase() + pagePath.slice(1)
  }

  // Check if current path is main nav path (home, experience or projects)
  const isMainPath = pathname === "/" || pathname === "/experience" || pathname === "/projects"
  
  // Handle responsive detection
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)
    
    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  return (
    <div className={inter.className}>
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-50 w-full border-b bg-background">
          <div className="container flex h-16 items-center justify-between">
            <motion.div 
              className="mr-4 font-semibold"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Link href="/">
                <span className="transition-all duration-300 hover:text-green-500">Alen.Is</span>
                {pathname !== "/" && !isMainPath && (
                  <motion.span
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <span className="ml-1">/</span>
                    <motion.span 
                      className="ml-1 text-green-500"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      {getPageName()}
                    </motion.span>
                  </motion.span>
                )}
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <MainNav />
            </motion.div>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t py-6 md:py-0">
          <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Alen.Is. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
      <Toaster position="top-right" />
    </div>
  )
}

