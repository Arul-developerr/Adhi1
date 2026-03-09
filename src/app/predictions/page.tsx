"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Brain, TrendingUp, TrendingDown, AlertTriangle, BarChart3, Droplet, MapPin } from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, LineChart, Line, Legend } from "recharts"
import { Button } from "@/components/ui/button"
import { PageTransition } from "@/components/page-transition"
import { tnPredictionZones, monthlyTrendData, type PredictionZone } from "@/lib/tn-data"

const getRiskColor = (risk: string) => {
    switch (risk) {
        case "critical": return "text-red-500"
        case "high": return "text-orange-500"
        case "medium": return "text-yellow-500"
        case "low": return "text-emerald-500"
        default: return "text-muted-foreground"
    }
}

const getRiskBg = (risk: string) => {
    switch (risk) {
        case "critical": return "bg-red-500/20 border-red-500/30"
        case "high": return "bg-orange-500/20 border-orange-500/30"
        case "medium": return "bg-yellow-500/20 border-yellow-500/30"
        case "low": return "bg-emerald-500/20 border-emerald-500/30"
        default: return "bg-muted"
    }
}

const getRiskBarColor = (risk: string) => {
    switch (risk) {
        case "critical": return "#ef4444"
        case "high": return "#f97316"
        case "medium": return "#eab308"
        case "low": return "#10b981"
        default: return "#888"
    }
}

const seasonalData = [
    { season: "Jan-Mar", monsoon: 15, festival: 25, summer: 10, normal: 50 },
    { season: "Apr-Jun", monsoon: 5, festival: 10, summer: 45, normal: 40 },
    { season: "Jul-Sep", monsoon: 50, festival: 15, summer: 5, normal: 30 },
    { season: "Oct-Dec", monsoon: 20, festival: 45, summer: 5, normal: 30 },
]

export default function AIPredictions() {
    const [selectedZone, setSelectedZone] = useState<PredictionZone | null>(null)

    const demandChartData = tnPredictionZones.map(z => ({
        district: z.district.length > 8 ? z.district.substring(0, 8) + "..." : z.district,
        fullDistrict: z.district,
        current: z.currentDemand,
        predicted: z.predictedDemand,
        risk: z.riskLevel,
    }))

    const criticalCount = tnPredictionZones.filter(z => z.riskLevel === "critical").length
    const highCount = tnPredictionZones.filter(z => z.riskLevel === "high").length
    const avgChange = (tnPredictionZones.reduce((a, z) => a + z.changePercent, 0) / tnPredictionZones.length).toFixed(1)

    return (
        <PageTransition>
            <div className="container mx-auto px-4 py-20 min-h-screen relative">
                <div className="fixed bottom-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[150px] pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12 mt-10"
                >
                    <div className="inline-flex items-center gap-2 bg-purple-500/10 text-purple-500 px-4 py-2 rounded-full text-sm font-medium mb-6">
                        <Brain className="w-4 h-4" /> Machine Learning Forecasting
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/60">
                        AI Demand Prediction
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Machine learning models forecasting seasonal shortages across Namakkal District&apos;s {tnPredictionZones.length} zones.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto mb-8"
                >
                    {[
                        { label: "Critical Zones", value: criticalCount, color: "text-red-500", bg: "bg-red-500/10", icon: AlertTriangle },
                        { label: "High-Risk Zones", value: highCount, color: "text-orange-500", bg: "bg-orange-500/10", icon: TrendingUp },
                        { label: "Avg Demand Surge", value: `${avgChange}%`, color: "text-yellow-500", bg: "bg-yellow-500/10", icon: BarChart3 },
                        { label: "Districts Analyzed", value: tnPredictionZones.length, color: "text-purple-500", bg: "bg-purple-500/10", icon: MapPin },
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.15 + i * 0.05 }}
                            className={`${stat.bg} rounded-2xl p-5 text-center border border-white/5`}
                        >
                            <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
                            <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
                            <div className="text-xs text-muted-foreground font-medium mt-1">{stat.label}</div>
                        </motion.div>
                    ))}
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-2 glass-card p-6 rounded-3xl"
                    >
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-primary" /> Monthly Demand vs Supply Trend
                        </h2>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="demandGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="supplyGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="month" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.85)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                                    <Area type="monotone" dataKey="demand" stroke="#ef4444" fillOpacity={1} fill="url(#demandGrad)" name="Demand" />
                                    <Area type="monotone" dataKey="supply" stroke="#10b981" fillOpacity={1} fill="url(#supplyGrad)" name="Supply" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="glass-card p-6 rounded-3xl"
                    >
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Brain className="w-5 h-5 text-purple-500" /> Seasonal Patterns
                        </h2>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={seasonalData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <XAxis dataKey="season" stroke="#888" fontSize={10} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#888" fontSize={11} tickLine={false} axisLine={false} />
                                    <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.85)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                                    <Bar dataKey="monsoon" fill="#3b82f6" name="Monsoon" radius={[2, 2, 0, 0]} stackId="a" />
                                    <Bar dataKey="festival" fill="#f59e0b" name="Festival" radius={[2, 2, 0, 0]} stackId="a" />
                                    <Bar dataKey="summer" fill="#ef4444" name="Summer" radius={[2, 2, 0, 0]} stackId="a" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="glass-card p-6 rounded-3xl mt-8 max-w-6xl mx-auto"
                >
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-primary" /> District-Level Demand Forecast
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border text-left">
                                    <th className="p-3 font-bold">District</th>
                                    <th className="p-3 font-bold">Current Demand</th>
                                    <th className="p-3 font-bold">Predicted</th>
                                    <th className="p-3 font-bold">Change</th>
                                    <th className="p-3 font-bold">Risk Level</th>
                                    <th className="p-3 font-bold">Top Shortage</th>
                                    <th className="p-3 font-bold">Season Factor</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tnPredictionZones.map((zone, i) => (
                                    <motion.tr
                                        key={zone.district}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.5 + i * 0.03 }}
                                        className="border-b border-border/50 hover:bg-white/5 transition-colors cursor-pointer"
                                        onClick={() => setSelectedZone(zone)}
                                    >
                                        <td className="p-3 font-medium">{zone.district}</td>
                                        <td className="p-3 tabular-nums">{zone.currentDemand.toLocaleString()}</td>
                                        <td className="p-3 tabular-nums font-bold">{zone.predictedDemand.toLocaleString()}</td>
                                        <td className="p-3">
                                            <span className={`flex items-center gap-1 font-bold ${zone.changePercent > 15 ? 'text-red-500' : zone.changePercent > 10 ? 'text-orange-500' : 'text-emerald-500'}`}>
                                                {zone.changePercent > 10 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                                +{zone.changePercent}%
                                            </span>
                                        </td>
                                        <td className="p-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold border ${getRiskBg(zone.riskLevel)} ${getRiskColor(zone.riskLevel)}`}>
                                                {zone.riskLevel.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="p-3">
                                            <span className="flex items-center gap-1">
                                                <Droplet className="w-3 h-3 text-primary" />
                                                <span className="font-bold text-primary">{zone.topShortage}</span>
                                            </span>
                                        </td>
                                        <td className="p-3 text-muted-foreground">{zone.season}</td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                {selectedZone && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card p-6 rounded-3xl mt-8 max-w-6xl mx-auto border-primary/20"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-primary" /> {selectedZone.district} - Detailed Analysis
                            </h2>
                            <Button variant="outline" size="sm" onClick={() => setSelectedZone(null)} className="rounded-full">Close</Button>
                        </div>
                        <div className="grid md:grid-cols-4 gap-4">
                            <div className="p-4 bg-background/50 rounded-xl text-center">
                                <div className="text-2xl font-black">{selectedZone.currentDemand}</div>
                                <div className="text-xs text-muted-foreground">Current Demand (units/month)</div>
                            </div>
                            <div className="p-4 bg-background/50 rounded-xl text-center">
                                <div className="text-2xl font-black text-primary">{selectedZone.predictedDemand}</div>
                                <div className="text-xs text-muted-foreground">Predicted Demand</div>
                            </div>
                            <div className="p-4 bg-background/50 rounded-xl text-center">
                                <div className={`text-2xl font-black ${getRiskColor(selectedZone.riskLevel)}`}>{selectedZone.riskLevel.toUpperCase()}</div>
                                <div className="text-xs text-muted-foreground">Risk Assessment</div>
                            </div>
                            <div className="p-4 bg-background/50 rounded-xl text-center">
                                <div className="text-2xl font-black">{selectedZone.topShortage}</div>
                                <div className="text-xs text-muted-foreground">Critical Shortage Group</div>
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-4">
                            📊 AI predicts a <strong className="text-primary">+{selectedZone.changePercent}%</strong> demand surge in {selectedZone.district} district due to <strong>{selectedZone.season}</strong> seasonal patterns.
                            Proactive measures recommended: Increase {selectedZone.topShortage} blood group collection drives and coordinate with neighboring districts for stock redistribution.
                        </p>
                    </motion.div>
                )}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="glass-card p-6 rounded-3xl mt-8 max-w-6xl mx-auto"
                >
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-primary" /> Current vs Predicted Demand by District
                    </h2>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={demandChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <XAxis dataKey="district" stroke="#888" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.85)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                    labelFormatter={(_, payload) => payload?.[0]?.payload?.fullDistrict || ''}
                                />
                                <Bar dataKey="current" fill="#6366f1" name="Current" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="predicted" name="Predicted" radius={[4, 4, 0, 0]}>
                                    {demandChartData.map((entry, i) => (
                                        <Cell key={i} fill={getRiskBarColor(entry.risk)} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>
        </PageTransition>
    )
}
