"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { Droplet, Activity, Bell, Brain, ChevronRight, UserPlus, Heart, Search, Zap, Building2, MapPin, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TiltCard } from "@/components/ui/3d-card"
import { PageTransition } from "@/components/page-transition"

function Counter({ end, suffix = "" }: { end: number, suffix?: string }) {
    const [count, setCount] = useState(0)

    useEffect(() => {
        let start = 0
        const duration = 2000
        const increment = end / (duration / 16)

        const timer = setInterval(() => {
            start += increment
            if (start >= end) {
                setCount(end)
                clearInterval(timer)
            } else {
                setCount(Math.floor(start))
            }
        }, 16)

        return () => clearInterval(timer)
    }, [end])

    return <span className="tabular-nums font-bold">{count.toLocaleString()}{suffix}</span>
}

const features = [
    { title: "Automated Matching", desc: "Instantly pairs compatible donors with critical patients using spatial proximity across Tamil Nadu.", icon: Activity, href: "/matching", color: "from-red-600 to-rose-500" },
    { title: "Real-Time Inventory", desc: "Live integration with 20+ blood banks ensuring accurate unit availability across all districts.", icon: Droplet, href: "/inventory", color: "from-blue-600 to-cyan-500" },
    { title: "Emergency Alerts", desc: "Push notifications via SMS & App for high-urgency requirements to hospitals statewide.", icon: Bell, href: "/alerts", color: "from-orange-600 to-amber-500" },
    { title: "AI Demand Prediction", desc: "Machine learning models forecasting seasonal shortages in 12+ Tamil Nadu zones.", icon: Brain, href: "/predictions", color: "from-purple-600 to-violet-500" }
]

const partnerHospitals = [
    "Rajiv Gandhi GGH, Chennai",
    "Apollo Hospitals, Chennai",
    "CMC Vellore",
    "Govt. Rajaji Hospital, Madurai",
    "Kauvery Hospital, Trichy",
    "PSG Hospitals, Coimbatore",
    "MIOT International, Chennai",
    "Meenakshi Mission, Madurai",
]

export default function Home() {
    const { scrollY } = useScroll()
    const y1 = useTransform(scrollY, [0, 1000], [0, 200])
    const y2 = useTransform(scrollY, [0, 1000], [0, -150])

    return (
        <PageTransition>
            <div className="flex flex-col gap-24 pb-20 overflow-hidden relative">

                {/* HERO SECTION */}
                <section className="relative pt-20 lg:pt-32 min-h-[90vh] flex items-center justify-center">
                    <motion.div
                        style={{ y: y1 }}
                        className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/20 rounded-full blur-[100px] pointer-events-none"
                    />
                    <motion.div
                        style={{ y: y2 }}
                        className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-rose-600/10 rounded-full blur-[120px] pointer-events-none"
                    />

                    <div className="container mx-auto px-4 z-10 text-center flex flex-col items-center">
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", duration: 1, bounce: 0.5 }}
                            className="mb-6 relative"
                        >
                            <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
                            <Droplet className="w-24 h-24 fill-primary text-primary blood-drop relative z-10" />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                            className="mb-4"
                        >
                            <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium">
                                <Building2 className="w-4 h-4" /> Government of Tamil Nadu Initiative
                            </span>
                        </motion.div>

                        <motion.h1
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70 dark:from-white dark:to-white/50"
                        >
                            Save Lives with <br className="hidden md:block" />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-400">Smart Blood Matching</span>
                        </motion.h1>

                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10"
                        >
                            A futuristic platform connecting donors to patients across Tamil Nadu in real-time. Serving 20+ government & private hospitals with automated matchmaking, AI prediction, and zero wastage.
                        </motion.p>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="flex flex-col sm:flex-row gap-4"
                        >
                            <Link href="/register">
                                <Button size="lg" className="w-full sm:w-auto text-lg gap-2 h-14 px-8 rounded-full">
                                    <UserPlus className="w-5 h-5" />
                                    Register as Donor
                                </Button>
                            </Link>
                            <Link href="/request">
                                <Button size="lg" variant="glass" className="w-full sm:w-auto text-lg gap-2 h-14 px-8 rounded-full border-primary/20 hover:border-primary/50 text-primary dark:text-red-400">
                                    <Search className="w-5 h-5" />
                                    Request Blood
                                </Button>
                            </Link>
                        </motion.div>
                    </div>
                </section>

                {/* LIVE STOCK METRICS */}
                <section className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8"
                    >
                        {[
                            { label: "Active Donors", val: 15420, icon: <Heart className="w-6 h-6 text-primary" /> },
                            { label: "Lives Saved", val: 42890, icon: <Activity className="w-6 h-6 text-emerald-500" /> },
                            { label: "TN Hospitals", val: 20, icon: <Building2 className="w-6 h-6 text-blue-500" /> },
                            { label: "Units Available", val: 8940, icon: <Droplet className="w-6 h-6 text-rose-500" /> }
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="glass rounded-2xl p-6 text-center shadow-lg border-white/10 flex flex-col items-center hover:shadow-[0_0_30px_rgba(185,28,28,0.1)] transition-all duration-300"
                            >
                                <div className="mb-4 bg-background/50 p-3 rounded-full">{stat.icon}</div>
                                <div className="text-3xl md:text-4xl font-black text-foreground mb-1"><Counter end={stat.val} suffix="+" /></div>
                                <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</div>
                            </motion.div>
                        ))}
                    </motion.div>
                </section>

                {/* FEATURES - Now with links to functional pages */}
                <section className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
                                <Zap className="w-4 h-4" /> Fully Functional Features
                            </span>
                            <h2 className="text-3xl md:text-5xl font-bold mb-4">Intelligent Infrastructure</h2>
                            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Powered by next-gen algorithms to handle critical healthcare demands across Tamil Nadu seamlessly.</p>
                        </motion.div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ delay: i * 0.1 }}
                                className="h-full"
                            >
                                <Link href={feature.href} className="block h-full group">
                                    <TiltCard className="h-full">
                                        <div className="glass-card h-full p-8 rounded-2xl flex flex-col bg-white/5 hover:bg-white/10 transition-all border-white/10 group-hover:border-primary/30 group-hover:shadow-[0_0_30px_rgba(185,28,28,0.15)]">
                                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 opacity-80 group-hover:opacity-100 transition-opacity group-hover:scale-110 transform duration-300`}>
                                                <feature.icon className="w-7 h-7 text-white" />
                                            </div>
                                            <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{feature.title}</h3>
                                            <p className="text-muted-foreground leading-relaxed flex-1">{feature.desc}</p>
                                            <div className="flex items-center gap-1 text-primary text-sm font-medium mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                Explore <ArrowRight className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </TiltCard>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* PARTNER HOSPITALS MARQUEE */}
                <section className="container mx-auto px-4">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl md:text-3xl font-bold mb-2">Trusted by Leading TN Hospitals</h2>
                        <p className="text-muted-foreground">Government & Private hospitals across Tamil Nadu</p>
                    </div>
                    <div className="overflow-hidden relative">
                        <motion.div
                            animate={{ x: ["0%", "-50%"] }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="flex gap-6 whitespace-nowrap"
                        >
                            {[...partnerHospitals, ...partnerHospitals].map((name, i) => (
                                <div key={i} className="glass rounded-xl px-6 py-3 text-sm font-medium text-muted-foreground flex items-center gap-2 shrink-0">
                                    <Building2 className="w-4 h-4 text-primary" />
                                    {name}
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* HOW IT WORKS TIMELINE */}
                <section className="container mx-auto px-4 py-12 relative">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">How It Works</h2>
                    </div>
                    <div className="max-w-4xl mx-auto relative hidden md:block">
                        {/* Connecting line */}
                        <div className="absolute top-1/2 left-0 right-0 h-1 bg-border -translate-y-1/2 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: "100%" }}
                                viewport={{ once: true }}
                                transition={{ duration: 1.5, ease: "easeInOut" }}
                                className="h-full bg-primary"
                            />
                        </div>

                        <div className="grid grid-cols-4 gap-4 relative z-10">
                            {["Register Profile", "Notification Match", "Donate Blood", "Save a Life"].map((step, i) => (
                                <div key={i} className="flex flex-col items-center group">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        whileInView={{ scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.5 + i * 0.2, type: "spring" }}
                                        className="w-12 h-12 rounded-full bg-background border-4 border-primary flex items-center justify-center font-bold text-lg mb-4 shadow-[0_0_15px_rgba(185,28,28,0.5)] group-hover:scale-110 transition-transform"
                                    >
                                        {i + 1}
                                    </motion.div>
                                    <p className="font-semibold text-center mt-2">{step}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Mobile view timeline */}
                    <div className="md:hidden flex flex-col gap-8 items-center border-l-2 border-primary/30 pl-8 ml-4 relative">
                        {["Register Profile", "Notification Match", "Donate Blood", "Save a Life"].map((step, i) => (
                            <div key={i} className="relative w-full">
                                <div className="absolute -left-[45px] top-0 w-8 h-8 rounded-full bg-background border-4 border-primary flex items-center justify-center font-bold shadow-[0_0_10px_rgba(185,28,28,0.5)]">
                                    {i + 1}
                                </div>
                                <h3 className="font-semibold text-lg">{step}</h3>
                            </div>
                        ))}
                    </div>
                </section>

            </div>
        </PageTransition>
    )
}
