

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Users, Droplet, Activity, Bell, TrendingUp, AlertTriangle, Building2, MapPin, Brain } from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts"
import { Button } from "@/components/ui/button"
import { PageTransition } from "@/components/page-transition"
import { tnHospitals, tnAlerts, tnPredictionZones } from "@/lib/tn-data"
import Link from "next/link"

const inventoryData = [
    { name: 'Mon', A: 400, B: 240, O: 2400 },
    { name: 'Tue', A: 300, B: 139, O: 2210 },
    { name: 'Wed', A: 200, B: 980, O: 2290 },
    { name: 'Thu', A: 278, B: 390, O: 2000 },
    { name: 'Fri', A: 189, B: 480, O: 2181 },
    { name: 'Sat', A: 239, B: 380, O: 2500 },
    { name: 'Sun', A: 349, B: 430, O: 2100 },
]

const recentRequests = [
    { id: "REQ-01", hospital: "Govt. HQ Hospital, Namakkal", group: "O-", urgency: "Critical", time: "2 mins ago", status: "Matched" },
    { id: "REQ-02", hospital: "Vivekananda Blood Bank, Tiruchengode", group: "A+", urgency: "Standard", time: "15 mins ago", status: "Pending" },
    { id: "REQ-03", hospital: "Govt. Hospital, Rasipuram", group: "B-", urgency: "High", time: "1 hour ago", status: "Fulfilled" },
    { id: "REQ-04", hospital: "Shharc Charity Blood Bank, Namakkal", group: "AB+", urgency: "Critical", time: "2 hours ago", status: "Matched" },
    { id: "REQ-05", hospital: "Govt. Hospital, Tiruchengode", group: "O+", urgency: "High", time: "3 hours ago", status: "Fulfilled" },
]

export default function Dashboard() {
    const [activeDonors, setActiveDonors] = useState(1240)

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveDonors(prev => prev + Math.floor(Math.random() * 3) - 1)
        }, 3000)
        return () => clearInterval(interval)
    }, [])

    const criticalZones = tnPredictionZones.filter(z => z.riskLevel === "critical" || z.riskLevel === "high")

    return (
        <PageTransition>
            <div className="container mx-auto px-4 py-10 relative">
                <div className="flex justify-between items-center mb-10 w-full mt-10">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Namakkal District Blood Network</h1>
                        <p className="text-muted-foreground w-full max-w-lg">
                            Live monitoring of Namakkal District blood inventory, demands, and network health across all zones.
                        </p>
                    </div>
                    <div className="hidden md:flex flex-col items-end">
                        <div className="text-sm text-emerald-500 font-bold flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            SYSTEM ONLINE
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 text-right">Last synced: Just now</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-10">
                    {[
                        { label: "Active Donors", value: activeDonors.toLocaleString(), icon: Users, color: "text-blue-500" },
                        { label: "Total Units", value: "1,120", icon: Droplet, color: "text-red-500" },
                        { label: "Blood Banks", value: tnHospitals.length.toString(), icon: Building2, color: "text-emerald-500" },
                        { label: "Active Alerts", value: tnAlerts.filter(a => a.status === "active").length.toString(), icon: Bell, color: "text-orange-500" },
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-card p-6 rounded-2xl flex items-center gap-4 bg-white/5 dark:bg-black/20 hover:shadow-[0_0_20px_rgba(185,28,28,0.08)] transition-all duration-300"
                        >
                            <div className={`w-14 h-14 rounded-full bg-background flex items-center justify-center border border-white/10 ${stat.color}`}>
                                <stat.icon className="w-7 h-7" />
                            </div>
                            <div>
                                <div className="text-sm font-medium text-muted-foreground">{stat.label}</div>
                                <div className="text-2xl font-black">{stat.value}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="lg:col-span-2 glass-card p-6 rounded-3xl pb-2 bg-background/50 border border-border"
                    >
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <TrendingUp className="text-primary w-5 h-5" /> Weekly Inventory Flow
                            </h2>
                        </div>
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={inventoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorO" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#b91c1c" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#b91c1c" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorA" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.5} />
                                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                                    <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                                    <Area type="monotone" dataKey="O" stroke="#b91c1c" fillOpacity={1} fill="url(#colorO)" />
                                    <Area type="monotone" dataKey="A" stroke="#ef4444" fillOpacity={1} fill="url(#colorA)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    <div className="flex flex-col gap-6">

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                            className="glass-card p-6 rounded-3xl bg-red-600/10 border border-red-500/30"
                        >
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-red-500">
                                <AlertTriangle className="w-5 h-5 animate-pulse" /> Emergency Alerts
                            </h2>
                            <div className="space-y-4">
                                {tnAlerts.filter(a => a.status === "active").slice(0, 2).map((alert) => (
                                    <div key={alert.id} className="bg-background/80 p-4 rounded-xl border border-red-500/20 shadow-sm">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="font-bold text-red-500 text-sm">{alert.hospitalName}</span>
                                            <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                                        </div>
                                        <p className="text-sm text-foreground/80 mb-3">{alert.message}</p>
                                    </div>
                                ))}
                                <Link href="/alerts">
                                    <Button size="sm" variant="destructive" className="w-full text-xs h-8">View All Alerts →</Button>
                                </Link>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 }}
                            className="glass-card p-6 rounded-3xl flex-1 bg-background/50 border border-border"
                        >
                            <h2 className="text-xl font-bold mb-4">Live Requests</h2>
                            <div className="space-y-3">
                                {recentRequests.map((req, i) => (
                                    <div key={i} className="group p-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-semibold text-sm">{req.hospital}</span>
                                            <span className={`text-xs px-2 py-1 rounded-full ${req.urgency === 'Critical' ? 'bg-red-500/20 text-red-500' :
                                                req.urgency === 'High' ? 'bg-orange-500/20 text-orange-500' : 'bg-blue-500/20 text-blue-500'
                                                }`}>
                                                {req.group} • {req.urgency}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-xs text-muted-foreground mt-2">
                                            <span>{req.time}</span>
                                            <span className={req.status === 'Matched' ? 'text-emerald-500' : req.status === 'Pending' ? 'text-orange-500' : 'text-blue-500'}>
                                                {req.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
                >
                    {[
                        { name: "Automated Matching", href: "/matching", icon: Activity, color: "text-red-500" },
                        { name: "Blood Inventory", href: "/inventory", icon: Droplet, color: "text-blue-500" },
                        { name: "Emergency Alerts", href: "/alerts", icon: Bell, color: "text-orange-500" },
                        { name: "AI Predictions", href: "/predictions", icon: Brain, color: "text-purple-500" },
                    ].map((link, i) => (
                        <Link key={i} href={link.href}>
                            <motion.div
                                whileHover={{ scale: 1.02, y: -2 }}
                                className="glass-card p-5 rounded-2xl text-center hover:shadow-lg transition-all cursor-pointer group"
                            >
                                <link.icon className={`w-8 h-8 ${link.color} mx-auto mb-2 group-hover:scale-110 transition-transform`} />
                                <span className="text-sm font-medium">{link.name}</span>
                            </motion.div>
                        </Link>
                    ))}
                </motion.div>
            </div>
        </PageTransition>
    )
}
