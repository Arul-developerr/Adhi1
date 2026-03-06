"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Droplet, Moon, Sun, Menu, X, ChevronDown, Activity, Bell, Brain, Zap } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"

export function Navbar() {
    const { setTheme, theme } = useTheme()
    const pathname = usePathname()
    const [isOpen, setIsOpen] = React.useState(false)
    const [scrolled, setScrolled] = React.useState(false)
    const [featuresOpen, setFeaturesOpen] = React.useState(false)

    React.useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const mainLinks = [
        { name: "Home", href: "/" },
        { name: "Register Donor", href: "/register" },
        { name: "Request Blood", href: "/request" },
        { name: "Dashboard", href: "/dashboard" },
    ]

    const featureLinks = [
        { name: "Automated Matching", href: "/matching", icon: Activity, desc: "AI-powered donor pairing" },
        { name: "Real-Time Inventory", href: "/inventory", icon: Droplet, desc: "Live blood stock levels" },
        { name: "Emergency Alerts", href: "/alerts", icon: Bell, desc: "SMS & push notifications" },
        { name: "AI Predictions", href: "/predictions", icon: Brain, desc: "Demand forecasting" },
    ]

    const isFeaturePage = featureLinks.some(l => pathname === l.href)

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className={cn(
                "fixed top-0 w-full z-50 transition-all duration-300 border-b border-transparent",
                scrolled ? "bg-background/80 backdrop-blur-md border-border shadow-sm" : "bg-transparent"
            )}
        >
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <motion.div
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        className="text-primary"
                    >
                        <Droplet className="w-8 h-8 fill-primary stroke-none blood-drop" />
                    </motion.div>
                    <div className="flex flex-col">
                        <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-400 dark:from-red-400 dark:to-red-600 leading-tight">
                            TN LifeBlood
                        </span>
                        <span className="text-[9px] text-muted-foreground leading-tight tracking-wider uppercase">Tamil Nadu Blood Network</span>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-5">
                    {mainLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-primary relative",
                                pathname === link.href ? "text-primary" : "text-muted-foreground"
                            )}
                        >
                            {link.name}
                            {pathname === link.href && (
                                <motion.div
                                    layoutId="navbar-indicator"
                                    className="absolute -bottom-[21px] left-0 w-full h-[2px] bg-primary"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                        </Link>
                    ))}

                    {/* Features Dropdown */}
                    <div className="relative"
                        onMouseEnter={() => setFeaturesOpen(true)}
                        onMouseLeave={() => setFeaturesOpen(false)}
                    >
                        <button className={cn(
                            "text-sm font-medium transition-colors hover:text-primary flex items-center gap-1",
                            isFeaturePage ? "text-primary" : "text-muted-foreground"
                        )}>
                            Features <ChevronDown className={cn("w-3 h-3 transition-transform", featuresOpen && "rotate-180")} />
                            {isFeaturePage && (
                                <motion.div
                                    layoutId="navbar-indicator"
                                    className="absolute -bottom-[21px] left-0 w-full h-[2px] bg-primary"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                        </button>
                        <AnimatePresence>
                            {featuresOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute top-full right-0 mt-2 w-72 bg-background/95 backdrop-blur-xl rounded-2xl border border-border shadow-2xl overflow-hidden p-2"
                                >
                                    {featureLinks.map((fl) => (
                                        <Link
                                            key={fl.href}
                                            href={fl.href}
                                            className={cn(
                                                "flex items-center gap-3 p-3 rounded-xl hover:bg-primary/10 transition-all group",
                                                pathname === fl.href && "bg-primary/10"
                                            )}
                                        >
                                            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                                <fl.icon className="w-4 h-4 text-primary" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-semibold">{fl.name}</div>
                                                <div className="text-xs text-muted-foreground">{fl.desc}</div>
                                            </div>
                                        </Link>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="rounded-full"
                    >
                        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                </nav>

                {/* Mobile Menu Toggle */}
                <div className="flex md:hidden items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="rounded-full"
                    >
                        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X /> : <Menu />}
                    </Button>
                </div>
            </div>

            {/* Mobile Nav */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-background/95 backdrop-blur-md border-b overflow-hidden"
                    >
                        <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
                            {mainLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "text-sm font-medium p-2 rounded-md transition-colors",
                                        pathname === link.href ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
                                    )}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="border-t border-border my-2 pt-2">
                                <span className="text-xs text-muted-foreground px-2 uppercase tracking-wider">Features</span>
                            </div>
                            {featureLinks.map((fl) => (
                                <Link
                                    key={fl.href}
                                    href={fl.href}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "text-sm font-medium p-2 rounded-md transition-colors flex items-center gap-2",
                                        pathname === fl.href ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
                                    )}
                                >
                                    <fl.icon className="w-4 h-4" /> {fl.name}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    )
}
