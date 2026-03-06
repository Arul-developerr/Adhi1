"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, MapPin, Phone, Activity, AlertTriangle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { PageTransition } from "@/components/page-transition"
import { cn } from "@/lib/utils"

const bloodGroups = [
    { label: "A+", value: "a_pos" },
    { label: "A-", value: "a_neg" },
    { label: "B+", value: "b_pos" },
    { label: "B-", value: "b_neg" },
    { label: "O+", value: "o_pos" },
    { label: "O-", value: "o_neg" },
    { label: "AB+", value: "ab_pos" },
    { label: "AB-", value: "ab_neg" },
]

const urgencyLevels = [
    { label: "Standard (within 24 hours)", value: "standard" },
    { label: "High (within 6 hours)", value: "high" },
    { label: "Critical (Immediate - Life Threatening)", value: "critical" }
]

const mockDonors = [
    { id: 1, name: "Alexander C.", distance: "2.4 km", time: "10 mins", status: "Available", rating: 4.9 },
    { id: 2, name: "Sarah W.", distance: "3.8 km", time: "16 mins", status: "Available", rating: 5.0 },
    { id: 3, name: "Michael T.", distance: "5.1 km", time: "22 mins", status: "Available", rating: 4.8 },
]

export default function RequestBlood() {
    const [formData, setFormData] = useState({
        hospitalName: "",
        patientId: "",
        bloodGroup: "",
        units: "1",
        urgency: "standard",
        location: ""
    })

    const [status, setStatus] = useState<"idle" | "searching" | "found">("idle")
    const [alertedDonors, setAlertedDonors] = useState<number[]>([])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        setStatus("searching")

        // Simulate AI Search Time
        setTimeout(() => {
            setStatus("found")
        }, 4500)
    }

    return (
        <PageTransition>
            <div className="container mx-auto px-4 py-20 min-h-[calc(100vh-100px)] flex flex-col items-center relative">
                <div className="text-center mb-12 max-w-2xl mt-10">
                    <h1 className="text-4xl font-bold mb-4">Emergency Blood Request</h1>
                    <p className="text-muted-foreground text-lg">
                        Our AI-powered network scans thousands of active donors in your vicinity within seconds.
                    </p>
                </div>

                <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 relative z-10">
                    {/* LEFT: Request Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass-card p-6 md:p-8 space-y-6"
                    >
                        <div className="flex items-center gap-3 border-b border-border pb-4 mb-4">
                            <Activity className="text-primary w-6 h-6" />
                            <h2 className="text-xl font-bold">Request Details</h2>
                        </div>

                        <form onSubmit={handleSearch} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="hospital">Hospital / Clinic Name</Label>
                                <Input required id="hospital" value={formData.hospitalName} onChange={e => setFormData({ ...formData, hospitalName: e.target.value })} placeholder="City General Hospital" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="bloodGroup">Blood Group</Label>
                                    <Select
                                        required
                                        value={formData.bloodGroup}
                                        onChange={e => setFormData({ ...formData, bloodGroup: e.target.value })}
                                        options={bloodGroups}
                                        placeholder="Select Type"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="units">Units Required</Label>
                                    <Input required id="units" type="number" min="1" max="10" value={formData.units} onChange={e => setFormData({ ...formData, units: e.target.value })} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="location">Exact Location / Ward</Label>
                                <Input required id="location" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} placeholder="ICU Ward 3, Building A" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="urgency">Urgency Level</Label>
                                <Select
                                    required
                                    value={formData.urgency}
                                    onChange={e => setFormData({ ...formData, urgency: e.target.value })}
                                    options={urgencyLevels}
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={status === "searching" || status === "found"}
                                className={cn(
                                    "w-full h-12 text-lg mt-4 transition-all duration-300",
                                    formData.urgency === "critical" ? "bg-red-600 hover:bg-red-700 animate-pulse" : ""
                                )}
                            >
                                {status === "idle" ? "Initiate AI Search" : status === "searching" ? "Scanning Network..." : "Match Found"}
                            </Button>
                        </form>
                    </motion.div>

                    {/* RIGHT: Results / Loading */}
                    <div className="relative">
                        <AnimatePresence mode="wait">
                            {status === "idle" && (
                                <motion.div
                                    key="idle"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="h-full flex flex-col items-center justify-center text-center p-8 border border-dashed border-white/20 rounded-2xl bg-white/5"
                                >
                                    <Search className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
                                    <p className="text-muted-foreground">Fill in the request details and initialize the smart matching algorithm to find donors.</p>
                                </motion.div>
                            )}

                            {status === "searching" && (
                                <motion.div
                                    key="searching"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="h-full flex flex-col items-center justify-center p-8 rounded-2xl glass-card relative overflow-hidden"
                                >
                                    {/* Radar effect */}
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <motion.div
                                            animate={{ scale: [1, 2, 3], opacity: [0.8, 0.4, 0] }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                            className="w-32 h-32 border border-primary/50 rounded-full"
                                        />
                                        <motion.div
                                            animate={{ scale: [1, 2, 3], opacity: [0.8, 0.4, 0] }}
                                            transition={{ duration: 2, delay: 0.6, repeat: Infinity, ease: "linear" }}
                                            className="w-32 h-32 border border-primary/50 rounded-full absolute"
                                        />
                                        <motion.div
                                            animate={{ scale: [1, 2, 3], opacity: [0.8, 0.4, 0] }}
                                            transition={{ duration: 2, delay: 1.2, repeat: Infinity, ease: "linear" }}
                                            className="w-32 h-32 border border-primary/50 rounded-full absolute"
                                        />
                                        <div className="w-[300px] h-[300px] absolute bg-[conic-gradient(from_0deg,transparent_0deg,transparent_270deg,rgba(185,28,28,0.2)_360deg)] rounded-full animate-spin [animation-duration:3s]" />
                                    </div>

                                    <div className="z-10 text-center">
                                        <h3 className="text-2xl font-bold mb-2 text-primary drop-shadow-[0_0_8px_rgba(185,28,28,0.8)]">Scanning Sector...</h3>
                                        <p className="text-sm text-foreground/80 mb-6 font-mono">Analyzing 12,403 profiles within 10km</p>
                                        <div className="flex gap-2 justify-center">
                                            <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                                            <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                                            <span className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {status === "found" && (
                                <motion.div
                                    key="found"
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex flex-col gap-4 h-full"
                                >
                                    <div className="glass-card p-6 rounded-2xl bg-emerald-500/10 border-emerald-500/20 text-emerald-500 flex items-start gap-4 mb-2">
                                        <CheckCircle2 className="w-8 h-8 flex-shrink-0 mt-1" />
                                        <div>
                                            <h3 className="font-bold text-lg text-emerald-600 dark:text-emerald-400">Match Successful</h3>
                                            <p className="text-emerald-600/80 dark:text-emerald-400/80 text-sm">Found {mockDonors.length} compatible donors in high proximity.</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar">
                                        {mockDonors.map((donor, i) => (
                                            <motion.div
                                                key={donor.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.15 }}
                                                className="glass-card p-4 rounded-xl hover:bg-white/10 transition-colors flex items-center justify-between group"
                                            >
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-lg">{donor.name}</span>
                                                    <span className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                                        <MapPin className="w-3 h-3" /> {donor.distance} • ETA: {donor.time}
                                                    </span>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    onClick={() => setAlertedDonors(prev => [...prev, donor.id])}
                                                    disabled={alertedDonors.includes(donor.id)}
                                                    className={alertedDonors.includes(donor.id) ? "gap-2 bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30" : "opacity-0 group-hover:opacity-100 transition-opacity gap-2"}
                                                >
                                                    <Phone className="w-3 h-3" /> {alertedDonors.includes(donor.id) ? "Alerted" : "Alert"}
                                                </Button>
                                            </motion.div>
                                        ))}
                                    </div>

                                    <Button variant="outline" className="w-full mt-auto" onClick={() => setStatus("idle")}>
                                        Start New Request
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </PageTransition>
    )
}
