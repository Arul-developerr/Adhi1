"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, AlertTriangle, CheckCircle2, Clock, Send, Volume2, MapPin, Droplet, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { PageTransition } from "@/components/page-transition"
import { tnAlerts, tnHospitals, type EmergencyAlert } from "@/lib/tn-data"

const urgencyOptions = [
    { label: "Standard", value: "standard" },
    { label: "High", value: "high" },
    { label: "Critical - Life Threatening", value: "critical" },
]

const bloodGroupOptions = [
    { label: "A+", value: "A+" }, { label: "A-", value: "A-" },
    { label: "B+", value: "B+" }, { label: "B-", value: "B-" },
    { label: "O+", value: "O+" }, { label: "O-", value: "O-" },
    { label: "AB+", value: "AB+" }, { label: "AB-", value: "AB-" },
]

const hospitalOptions = tnHospitals.map(h => ({ label: `${h.name}, ${h.city}`, value: h.id }))

const getAlertIcon = (type: EmergencyAlert["type"]) => {
    switch (type) {
        case "critical_shortage": return <AlertTriangle className="w-5 h-5" />
        case "emergency_request": return <Bell className="w-5 h-5" />
        case "expiry_warning": return <Clock className="w-5 h-5" />
        case "donor_match": return <CheckCircle2 className="w-5 h-5" />
    }
}

const getAlertColor = (urgency: string) => {
    switch (urgency) {
        case "critical": return "border-red-500/40 bg-red-500/10"
        case "high": return "border-orange-500/40 bg-orange-500/10"
        default: return "border-blue-500/40 bg-blue-500/10"
    }
}

const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
        case "critical": return "bg-red-500/20 text-red-500"
        case "high": return "bg-orange-500/20 text-orange-500"
        default: return "bg-blue-500/20 text-blue-500"
    }
}

const getStatusBadge = (status: string) => {
    switch (status) {
        case "active": return "bg-red-500 text-white"
        case "pending": return "bg-yellow-500 text-black"
        case "resolved": return "bg-emerald-500 text-white"
        default: return "bg-muted text-muted-foreground"
    }
}

export default function EmergencyAlerts() {
    const [alerts, setAlerts] = useState<EmergencyAlert[]>(tnAlerts)
    const [showForm, setShowForm] = useState(false)
    const [toastMessage, setToastMessage] = useState("")
    const [formData, setFormData] = useState({
        hospitalId: "",
        bloodGroup: "",
        urgency: "standard",
        message: "",
    })


    useEffect(() => {
        const interval = setInterval(() => {
            const randomEvents = [
                "New platelet donation drive registered at Namakkal Town zone.",
                "Donor match confirmed for pending AB- request in Tiruchengode.",
                "Stock levels restored for O+ at Govt. Hospital, Rasipuram.",
                "Seasonal demand alert: Festival surge predicted in Namakkal District."
            ]
            const newAlert: EmergencyAlert = {
                id: `ALT-LIVE-${Date.now()}`,
                type: ["critical_shortage", "emergency_request", "donor_match", "expiry_warning"][Math.floor(Math.random() * 4)] as EmergencyAlert["type"],
                hospitalId: tnHospitals[Math.floor(Math.random() * tnHospitals.length)].id,
                hospitalName: tnHospitals[Math.floor(Math.random() * tnHospitals.length)].name,
                bloodGroup: bloodGroupOptions[Math.floor(Math.random() * bloodGroupOptions.length)].value,
                message: randomEvents[Math.floor(Math.random() * randomEvents.length)],
                urgency: ["critical", "high", "standard"][Math.floor(Math.random() * 3)] as EmergencyAlert["urgency"],
                timestamp: "Just now",
                status: "active",
                district: tnHospitals[Math.floor(Math.random() * tnHospitals.length)].district,
            }
            setAlerts(prev => [newAlert, ...prev].slice(0, 20))
        }, 8000)
        return () => clearInterval(interval)
    }, [])

    const sendAlert = () => {
        const hospital = tnHospitals.find(h => h.id === formData.hospitalId)
        if (!hospital || !formData.bloodGroup || !formData.message) return

        const newAlert: EmergencyAlert = {
            id: `ALT-USR-${Date.now()}`,
            type: formData.urgency === "critical" ? "emergency_request" : "critical_shortage",
            hospitalId: formData.hospitalId,
            hospitalName: `${hospital.name}, ${hospital.city}`,
            bloodGroup: formData.bloodGroup,
            message: formData.message,
            urgency: formData.urgency as EmergencyAlert["urgency"],
            timestamp: "Just now",
            status: "active",
            district: hospital.district,
        }

        setAlerts(prev => [newAlert, ...prev])
        setFormData({ hospitalId: "", bloodGroup: "", urgency: "standard", message: "" })
        setShowForm(false)
        setToastMessage(`🔔 Emergency alert broadcasted to ${hospital.district} zone!`)
        setTimeout(() => setToastMessage(""), 4000)
    }

    const resolveAlert = (id: string) => {
        setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: "resolved" } : a))
    }

    return (
        <PageTransition>
            <div className="container mx-auto px-4 py-20 min-h-screen relative">
                <div className="fixed top-1/3 left-1/3 w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-[150px] pointer-events-none" />

                <AnimatePresence>
                    {toastMessage && (
                        <motion.div
                            initial={{ y: -100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -100, opacity: 0 }}
                            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3"
                        >
                            <Volume2 className="w-5 h-5 animate-pulse" />
                            <span className="font-medium">{toastMessage}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12 mt-10"
                >
                    <div className="inline-flex items-center gap-2 bg-orange-500/10 text-orange-500 px-4 py-2 rounded-full text-sm font-medium mb-6">
                        <Bell className="w-4 h-4 animate-bounce" /> Push Notification System
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/60">
                        Emergency Alert Center
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Push notifications via SMS & App for high-urgency requirements across Namakkal District medical network.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto mb-8"
                >
                    {[
                        { label: "Active Alerts", value: alerts.filter(a => a.status === "active").length, color: "text-red-500", bg: "bg-red-500/10" },
                        { label: "Pending", value: alerts.filter(a => a.status === "pending").length, color: "text-yellow-500", bg: "bg-yellow-500/10" },
                        { label: "Resolved Today", value: alerts.filter(a => a.status === "resolved").length, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                        { label: "Districts Covered", value: new Set(alerts.map(a => a.district)).size, color: "text-blue-500", bg: "bg-blue-500/10" },
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.1 + i * 0.05 }}
                            className={`${stat.bg} rounded-2xl p-4 text-center border border-white/5`}
                        >
                            <div className={`text-3xl font-black ${stat.color}`}>{stat.value}</div>
                            <div className="text-xs text-muted-foreground font-medium mt-1">{stat.label}</div>
                        </motion.div>
                    ))}
                </motion.div>

                <div className="max-w-5xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                            Live Alert Feed
                        </h2>
                        <Button onClick={() => setShowForm(!showForm)} className="gap-2 rounded-full">
                            {showForm ? <><X className="w-4 h-4" /> Cancel</> : <><Send className="w-4 h-4" /> Broadcast Alert</>}
                        </Button>
                    </div>

                    <AnimatePresence>
                        {showForm && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden mb-6"
                            >
                                <div className="glass-card p-6 rounded-2xl space-y-4 border-primary/20">
                                    <h3 className="font-bold text-lg flex items-center gap-2">
                                        <Send className="w-5 h-5 text-primary" /> New Emergency Broadcast
                                    </h3>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Hospital</Label>
                                            <Select
                                                value={formData.hospitalId}
                                                onChange={e => setFormData({ ...formData, hospitalId: e.target.value })}
                                                options={hospitalOptions}
                                                placeholder="Select Hospital"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Blood Group Needed</Label>
                                            <Select
                                                value={formData.bloodGroup}
                                                onChange={e => setFormData({ ...formData, bloodGroup: e.target.value })}
                                                options={bloodGroupOptions}
                                                placeholder="Select Group"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Urgency Level</Label>
                                        <Select
                                            value={formData.urgency}
                                            onChange={e => setFormData({ ...formData, urgency: e.target.value })}
                                            options={urgencyOptions}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Alert Message</Label>
                                        <Input
                                            value={formData.message}
                                            onChange={e => setFormData({ ...formData, message: e.target.value })}
                                            placeholder="Describe the emergency situation..."
                                        />
                                    </div>
                                    <Button onClick={sendAlert} className="w-full h-12 text-lg gap-2 rounded-full" disabled={!formData.hospitalId || !formData.bloodGroup || !formData.message}>
                                        <Volume2 className="w-5 h-5" /> Broadcast to Network
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="space-y-4">
                        <AnimatePresence>
                            {alerts.map((alert, i) => (
                                <motion.div
                                    key={alert.id}
                                    initial={{ opacity: 0, x: -30, scale: 0.95 }}
                                    animate={{ opacity: 1, x: 0, scale: 1 }}
                                    exit={{ opacity: 0, x: 30 }}
                                    transition={{ delay: i < 5 ? i * 0.05 : 0 }}
                                    className={`glass-card p-5 rounded-2xl border ${getAlertColor(alert.urgency)} transition-all hover:shadow-lg`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`p-2.5 rounded-xl ${getUrgencyBadge(alert.urgency)}`}>
                                            {getAlertIcon(alert.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap mb-1">
                                                <span className="font-bold">{alert.hospitalName}</span>
                                                <span className="px-2 py-0.5 bg-primary/20 text-primary rounded-full text-xs font-bold">
                                                    {alert.bloodGroup}
                                                </span>
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadge(alert.status)}`}>
                                                    {alert.status.toUpperCase()}
                                                </span>
                                            </div>
                                            <p className="text-sm text-foreground/80 mb-2">{alert.message}</p>
                                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{alert.timestamp}</span>
                                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{alert.district}</span>
                                            </div>
                                        </div>
                                        {alert.status === "active" && (
                                            <Button size="sm" variant="outline" onClick={() => resolveAlert(alert.id)} className="text-xs rounded-full shrink-0">
                                                Resolve
                                            </Button>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </PageTransition>
    )
}
