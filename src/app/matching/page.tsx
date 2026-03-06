"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Activity, Users, Heart, Zap, MapPin, CheckCircle2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"
import { PageTransition } from "@/components/page-transition"
import { tnHospitals, tnDonors, bloodCompatibility, getCompatibleDonors } from "@/lib/tn-data"

const bloodGroups = [
    { label: "A+", value: "A+" }, { label: "A-", value: "A-" },
    { label: "B+", value: "B+" }, { label: "B-", value: "B-" },
    { label: "O+", value: "O+" }, { label: "O-", value: "O-" },
    { label: "AB+", value: "AB+" }, { label: "AB-", value: "AB-" },
]

export default function AutomatedMatching() {
    const [selectedGroup, setSelectedGroup] = useState("")
    const [matchStatus, setMatchStatus] = useState<"idle" | "scanning" | "matched">("idle")
    const [matchedDonors, setMatchedDonors] = useState<typeof tnDonors>([])
    const [scanProgress, setScanProgress] = useState(0)
    const [alertedDonors, setAlertedDonors] = useState<string[]>([])

    const startMatching = () => {
        if (!selectedGroup) return
        setMatchStatus("scanning")
        setScanProgress(0)

        const progressInterval = setInterval(() => {
            setScanProgress(prev => {
                if (prev >= 100) {
                    clearInterval(progressInterval)
                    return 100
                }
                return prev + 2
            })
        }, 60)

        setTimeout(() => {
            const donors = getCompatibleDonors(selectedGroup)
            setMatchedDonors(donors)
            setMatchStatus("matched")
            clearInterval(progressInterval)
            setScanProgress(100)
        }, 3500)
    }

    const resetMatch = () => {
        setMatchStatus("idle")
        setMatchedDonors([])
        setScanProgress(0)
        setSelectedGroup("")
        setAlertedDonors([])
    }

    const compatibleGroupsForSelected = selectedGroup
        ? Object.entries(bloodCompatibility)
            .filter(([_, canDonateTo]) => canDonateTo.includes(selectedGroup))
            .map(([group]) => group)
        : []

    return (
        <PageTransition>
            <div className="container mx-auto px-4 py-20 min-h-screen relative">
                {/* Animated background */}
                <div className="fixed top-1/3 left-1/4 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[150px] pointer-events-none animate-pulse" />
                <div className="fixed bottom-1/3 right-1/4 w-[400px] h-[400px] bg-rose-600/5 rounded-full blur-[120px] pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12 mt-10"
                >
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
                        <Zap className="w-4 h-4" /> AI-Powered Matching Engine
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/60">
                        Automated Donor Matching
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Instantly pairs compatible donors with critical patients across Tamil Nadu using spatial proximity and AI algorithms.
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto relative z-10">
                    {/* Left: Control Panel */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass-card p-8 rounded-3xl"
                    >
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                            <Activity className="w-6 h-6 text-primary" /> Match Control
                        </h2>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Required Blood Group</label>
                                <Select
                                    value={selectedGroup}
                                    onChange={(e) => setSelectedGroup(e.target.value)}
                                    options={bloodGroups}
                                    placeholder="Select Blood Group"
                                />
                            </div>

                            {selectedGroup && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    className="bg-primary/5 p-4 rounded-xl border border-primary/10"
                                >
                                    <p className="text-sm font-medium mb-2">Compatible Donor Groups:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {compatibleGroupsForSelected.map(g => (
                                            <span key={g} className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-bold animate-float">
                                                {g}
                                            </span>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            <Button
                                onClick={matchStatus === "matched" ? resetMatch : startMatching}
                                disabled={!selectedGroup || matchStatus === "scanning"}
                                className="w-full h-14 text-lg rounded-full gap-2"
                            >
                                {matchStatus === "idle" && <><Zap className="w-5 h-5" /> Start AI Matching</>}
                                {matchStatus === "scanning" && "Scanning Network..."}
                                {matchStatus === "matched" && <><ArrowRight className="w-5 h-5" /> New Search</>}
                            </Button>

                            {matchStatus === "scanning" && (
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm text-muted-foreground">
                                        <span>Scanning TN Donor Network</span>
                                        <span>{scanProgress}%</span>
                                    </div>
                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-primary to-red-400 rounded-full"
                                            animate={{ width: `${scanProgress}%` }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Compatibility Matrix */}
                        <div className="mt-8">
                            <h3 className="text-lg font-bold mb-4">Blood Compatibility Matrix</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs">
                                    <thead>
                                        <tr className="border-b border-border">
                                            <th className="p-2 text-left">Donor →</th>
                                            {Object.keys(bloodCompatibility).map(g => (
                                                <th key={g} className="p-2 text-center font-bold">{g}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.keys(bloodCompatibility).map(recipient => (
                                            <tr key={recipient} className="border-b border-border/50">
                                                <td className="p-2 font-bold">{recipient}</td>
                                                {Object.keys(bloodCompatibility).map(donor => {
                                                    const canDonate = bloodCompatibility[donor]?.includes(recipient)
                                                    return (
                                                        <td key={donor} className="p-2 text-center">
                                                            <span className={`inline-block w-5 h-5 rounded-full ${canDonate ? 'bg-emerald-500/30 text-emerald-500' : 'bg-red-500/10 text-red-500/30'} flex items-center justify-center text-[10px]`}>
                                                                {canDonate ? '✓' : '✗'}
                                                            </span>
                                                        </td>
                                                    )
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right: Results */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <AnimatePresence mode="wait">
                            {matchStatus === "idle" && (
                                <motion.div
                                    key="idle"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="h-full flex flex-col items-center justify-center text-center p-12 border border-dashed border-white/20 rounded-3xl bg-white/5 min-h-[500px]"
                                >
                                    <motion.div
                                        animate={{ y: [0, -10, 0] }}
                                        transition={{ duration: 3, repeat: Infinity }}
                                    >
                                        <Users className="w-20 h-20 text-muted-foreground mb-6 opacity-40" />
                                    </motion.div>
                                    <p className="text-muted-foreground text-lg">Select a blood group and start the AI matching engine to find compatible donors across Tamil Nadu</p>
                                </motion.div>
                            )}

                            {matchStatus === "scanning" && (
                                <motion.div
                                    key="scanning"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="h-full flex flex-col items-center justify-center p-12 rounded-3xl glass-card relative overflow-hidden min-h-[500px]"
                                >
                                    {/* Radar effect */}
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        {[0, 0.5, 1].map((delay) => (
                                            <motion.div
                                                key={delay}
                                                animate={{ scale: [1, 2.5, 4], opacity: [0.6, 0.3, 0] }}
                                                transition={{ duration: 2.5, delay, repeat: Infinity, ease: "linear" }}
                                                className="w-24 h-24 border-2 border-primary/40 rounded-full absolute"
                                            />
                                        ))}
                                        <div className="w-[350px] h-[350px] absolute bg-[conic-gradient(from_0deg,transparent_0deg,transparent_270deg,rgba(185,28,28,0.15)_360deg)] rounded-full animate-spin [animation-duration:3s]" />
                                    </div>

                                    <div className="z-10 text-center">
                                        <h3 className="text-3xl font-bold mb-3 text-primary drop-shadow-[0_0_10px_rgba(185,28,28,0.6)]">
                                            Scanning Tamil Nadu
                                        </h3>
                                        <p className="text-foreground/70 mb-2 font-mono text-sm">
                                            Analyzing {tnDonors.length.toLocaleString()} registered donors
                                        </p>
                                        <p className="text-foreground/50 text-xs">Across {tnHospitals.length} partner hospitals</p>
                                        <div className="flex gap-2 justify-center mt-6">
                                            {[0, 1, 2].map(i => (
                                                <motion.span
                                                    key={i}
                                                    className="w-3 h-3 bg-primary rounded-full"
                                                    animate={{ y: [0, -12, 0] }}
                                                    transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {matchStatus === "matched" && (
                                <motion.div
                                    key="matched"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex flex-col gap-4"
                                >
                                    <motion.div
                                        initial={{ scale: 0.9 }}
                                        animate={{ scale: 1 }}
                                        className="glass-card p-6 rounded-2xl bg-emerald-500/10 border-emerald-500/20"
                                    >
                                        <div className="flex items-center gap-3">
                                            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                                            <div>
                                                <h3 className="font-bold text-lg text-emerald-500">Match Found!</h3>
                                                <p className="text-emerald-500/70 text-sm">{matchedDonors.length} compatible donors in proximity for {selectedGroup}</p>
                                            </div>
                                        </div>
                                    </motion.div>

                                    <div className="space-y-3 max-h-[450px] overflow-y-auto pr-2">
                                        {matchedDonors.map((donor, i) => (
                                            <motion.div
                                                key={donor.id}
                                                initial={{ opacity: 0, x: 30 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                                className="glass-card p-5 rounded-2xl hover:bg-white/10 transition-all group"
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="font-bold text-lg">{donor.name}</span>
                                                            <span className="px-2 py-0.5 bg-primary/20 text-primary rounded-full text-xs font-bold">{donor.bloodGroup}</span>
                                                        </div>
                                                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{donor.city}</span>
                                                            <span>{donor.distance}</span>
                                                            <span>ETA: {donor.eta}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1 mt-2">
                                                            {Array.from({ length: 5 }).map((_, j) => (
                                                                <Heart key={j} className={`w-3 h-3 ${j < Math.floor(donor.rating) ? 'fill-red-500 text-red-500' : 'text-muted-foreground/30'}`} />
                                                            ))}
                                                            <span className="text-xs text-muted-foreground ml-1">{donor.rating}</span>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        onClick={() => setAlertedDonors(prev => [...prev, donor.id])}
                                                        disabled={alertedDonors.includes(donor.id)}
                                                        className={alertedDonors.includes(donor.id) ? "rounded-full gap-2 bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30" : "opacity-0 group-hover:opacity-100 transition-opacity rounded-full gap-2"}
                                                    >
                                                        {alertedDonors.includes(donor.id) ? "Alerted" : "Alert Donor"}
                                                    </Button>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </PageTransition>
    )
}
