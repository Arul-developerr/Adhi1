"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, ArrowLeft, CheckCircle2, ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { PageTransition } from "@/components/page-transition"

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

export default function RegisterDonar() {
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState({
        name: "",
        age: "",
        bloodGroup: "",
        location: "",
        weight: "",
        lastDonation: "",
        phone: ""
    })
    const [isDone, setIsDone] = useState(false)

    const handleNext = () => setStep(s => s + 1)
    const handlePrev = () => setStep(s => s - 1)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsDone(true)
    }

    const checkEligibility = () => {
        if (parseInt(formData.age) < 18) return "You must be over 18 to donate."
        if (parseInt(formData.weight) < 50) return "You must weigh at least 50kg."
        return null
    }

    const eligibilityError = step === 3 ? checkEligibility() : null

    return (
        <PageTransition>
            <div className="container mx-auto px-4 py-20 min-h-screen flex items-center justify-center relative">
                {/* Background glow */}
                <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />

                <div className="w-full max-w-xl relative hidden md:block z-0 mb-auto mt-20 absolute top-0 text-center text-muted-foreground">
                    Step {step} of 3
                </div>

                <motion.div
                    layout
                    className="glass-card w-full max-w-xl p-8 rounded-3xl relative z-10 overflow-hidden bg-white/5 dark:bg-black/40 border border-white/10 shadow-2xl"
                >
                    <AnimatePresence mode="wait">
                        {!isDone ? (
                            <motion.div
                                key={step}
                                initial={{ x: 50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -50, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            >
                                <div className="mb-8">
                                    <h1 className="text-3xl font-bold mb-2">Register as a Donor</h1>
                                    <p className="text-muted-foreground">Join our network and help save lives.</p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {step === 1 && (
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Full Name</Label>
                                                <Input id="name" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="John Doe" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="age">Age</Label>
                                                    <Input id="age" type="number" required value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })} placeholder="25" />
                                                </div>
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
                                            </div>
                                        </div>
                                    )}

                                    {step === 2 && (
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="phone">Phone Number</Label>
                                                <Input id="phone" type="tel" required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="+1 (555) 000-0000" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="location">City / Location</Label>
                                                <Input id="location" required value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} placeholder="New York, NY" />
                                            </div>
                                        </div>
                                    )}

                                    {step === 3 && (
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="weight">Weight (kg)</Label>
                                                <Input id="weight" type="number" required value={formData.weight} onChange={e => setFormData({ ...formData, weight: e.target.value })} placeholder="65" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="lastDonation">Last Date of Donation (Optional)</Label>
                                                <Input id="lastDonation" type="date" value={formData.lastDonation} onChange={e => setFormData({ ...formData, lastDonation: e.target.value })} />
                                            </div>

                                            {eligibilityError && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    className="bg-destructive/10 text-destructive p-3 rounded-lg flex items-center gap-2 text-sm mt-4 border border-destructive/20"
                                                >
                                                    <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                                                    <p>{eligibilityError}</p>
                                                </motion.div>
                                            )}
                                        </div>
                                    )}

                                    <div className="flex justify-between pt-6 border-t border-border mt-8">
                                        {step > 1 ? (
                                            <Button type="button" variant="outline" onClick={handlePrev} className="gap-2">
                                                <ArrowLeft className="w-4 h-4" /> Back
                                            </Button>
                                        ) : <div />}

                                        {step < 3 ? (
                                            <Button type="button" onClick={handleNext} disabled={
                                                (step === 1 && (!formData.name || !formData.age || !formData.bloodGroup)) ||
                                                (step === 2 && (!formData.phone || !formData.location))
                                            } className="gap-2">
                                                Continue <ArrowRight className="w-4 h-4" />
                                            </Button>
                                        ) : (
                                            <Button type="submit" disabled={!!eligibilityError || !formData.weight} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                                                Complete Registration <CheckCircle2 className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </div>
                                </form>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="success"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", bounce: 0.5 }}
                                className="text-center py-12 flex flex-col items-center"
                            >
                                <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mb-6">
                                    <CheckCircle2 className="w-10 h-10" />
                                </div>
                                <h2 className="text-3xl font-bold mb-3">Registration Successful!</h2>
                                <p className="text-muted-foreground mb-8 text-lg">
                                    Welcome to LifeBlood. Your data card has been secured and you'll be notified of any nearby emergencies matching your blood group {formData.bloodGroup.replace('_pos', '+').replace('_neg', '-').toUpperCase()}.
                                </p>
                                <Button onClick={() => window.location.href = "/"} variant="outline" className="h-12 px-8 rounded-full">
                                    Return to Dashboard
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </PageTransition>
    )
}
