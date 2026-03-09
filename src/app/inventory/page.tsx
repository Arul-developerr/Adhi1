"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Droplet, Filter, Building2, RefreshCw, TrendingDown, TrendingUp, AlertTriangle } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"
import { PageTransition } from "@/components/page-transition"
import { tnHospitals, tnDistricts, type Hospital, type BloodInventory } from "@/lib/tn-data"

const bloodGroups: (keyof BloodInventory)[] = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]

const getStockColor = (units: number) => {
    if (units >= 200) return "text-emerald-500"
    if (units >= 100) return "text-yellow-500"
    if (units >= 50) return "text-orange-500"
    return "text-red-500"
}

const getStockBg = (units: number) => {
    if (units >= 200) return "bg-emerald-500"
    if (units >= 100) return "bg-yellow-500"
    if (units >= 50) return "bg-orange-500"
    return "bg-red-500"
}

const getStockLabel = (units: number) => {
    if (units >= 200) return "Adequate"
    if (units >= 100) return "Moderate"
    if (units >= 50) return "Low"
    return "Critical"
}

export default function RealTimeInventory() {
    const [filterDistrict, setFilterDistrict] = useState("")
    const [filterType, setFilterType] = useState("")
    const [filterBloodGroup, setFilterBloodGroup] = useState("")
    const [hospitals, setHospitals] = useState<Hospital[]>(tnHospitals)

    useEffect(() => {
        let filtered = [...tnHospitals]
        if (filterDistrict) filtered = filtered.filter(h => h.district === filterDistrict)
        if (filterType) filtered = filtered.filter(h => h.type === filterType)
        setHospitals(filtered)
    }, [filterDistrict, filterType])

    const totalByGroup = bloodGroups.map(group => ({
        group,
        total: hospitals.reduce((acc, h) => acc + h.inventory[group], 0)
    }))

    const districtOptions = tnDistricts.map(d => ({ label: d, value: d }))
    const typeOptions = [
        { label: "Government", value: "government" },
        { label: "Private", value: "private" }
    ]

    return (
        <PageTransition>
            <div className="container mx-auto px-4 py-20 min-h-screen relative">
                <div className="fixed top-1/4 right-1/4 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12 mt-10"
                >
                    <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-500 px-4 py-2 rounded-full text-sm font-medium mb-6">
                        <RefreshCw className="w-4 h-4 animate-spin [animation-duration:3s]" /> Live Data Feed
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/60">
                        Real-Time Blood Inventory
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Live integration with blood banks across Namakkal District ensuring accurate unit availability for {tnHospitals.length} blood banks.
                    </p>
                </motion.div>

                {/* Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card p-6 rounded-2xl mb-8 max-w-5xl mx-auto"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <Filter className="w-5 h-5 text-primary" />
                        <h2 className="font-bold text-lg">Filters</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Select
                            value={filterDistrict}
                            onChange={e => setFilterDistrict(e.target.value)}
                            options={districtOptions}
                            placeholder="All Districts"
                        />
                        <Select
                            value={filterType}
                            onChange={e => setFilterType(e.target.value)}
                            options={typeOptions}
                            placeholder="All Types"
                        />
                        <Button variant="outline" onClick={() => { setFilterDistrict(""); setFilterType(""); }} className="gap-2">
                            <RefreshCw className="w-4 h-4" /> Reset Filters
                        </Button>
                    </div>
                </motion.div>

                {/* Overview Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card p-6 rounded-3xl mb-8 max-w-5xl mx-auto"
                >
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Droplet className="w-5 h-5 text-primary" /> Aggregate Stock by Blood Group
                    </h2>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={totalByGroup} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                                <XAxis dataKey="group" stroke="#888" fontSize={13} tickLine={false} axisLine={false} />
                                <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.85)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                                <Bar dataKey="total" radius={[8, 8, 0, 0]}>
                                    {totalByGroup.map((entry, i) => (
                                        <Cell key={i} fill={entry.total > 2000 ? '#10b981' : entry.total > 1000 ? '#eab308' : entry.total > 500 ? '#f97316' : '#ef4444'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Hospital Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                    {hospitals.map((hospital, i) => (
                        <motion.div
                            key={hospital.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + i * 0.05 }}
                            className="glass-card p-6 rounded-2xl hover:shadow-[0_0_30px_rgba(185,28,28,0.1)] transition-all duration-300"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Building2 className="w-4 h-4 text-primary" />
                                        <h3 className="font-bold text-sm">{hospital.name}</h3>
                                    </div>
                                    <p className="text-xs text-muted-foreground">{hospital.city}, {hospital.district}</p>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${hospital.type === 'government' ? 'bg-blue-500/20 text-blue-500' : 'bg-purple-500/20 text-purple-500'}`}>
                                    {hospital.type === 'government' ? 'Govt' : 'Private'}
                                </span>
                            </div>

                            <div className="grid grid-cols-4 gap-2">
                                {bloodGroups.map(group => {
                                    const units = hospital.inventory[group]
                                    return (
                                        <div key={group} className="text-center p-2 rounded-lg bg-background/50 border border-border/50">
                                            <div className="text-xs text-muted-foreground font-medium">{group}</div>
                                            <div className={`text-lg font-black ${getStockColor(units)}`}>{units}</div>
                                            <div className={`h-1 rounded-full mt-1 ${getStockBg(units)} opacity-60`} />
                                        </div>
                                    )
                                })}
                            </div>

                            <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
                                <span className="text-xs text-muted-foreground">📞 {hospital.contact}</span>
                                <span className="text-xs text-muted-foreground">Capacity: {hospital.bloodBankCapacity.toLocaleString()} units</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </PageTransition>
    )
}
