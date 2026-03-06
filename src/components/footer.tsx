"use client"

import Link from "next/link"
import { Droplet, Activity, Bell, Brain } from "lucide-react"

export function Footer() {
    return (
        <footer className="border-t border-border/50 bg-background/50 backdrop-blur-sm mt-20">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <Droplet className="w-6 h-6 fill-primary text-primary" />
                            <div>
                                <span className="font-bold text-lg block leading-tight">TN LifeBlood System</span>
                                <span className="text-[10px] text-muted-foreground tracking-wider uppercase">Tamil Nadu Blood Bank Network</span>
                            </div>
                        </div>
                        <p className="text-muted-foreground text-sm max-w-sm mb-4">
                            Smart blood bank management system for Tamil Nadu Government and Private hospitals. Leveraging automated donor matching, AI demand prediction, and real-time inventory tracking to ensure zero blood shortage across the state.
                        </p>
                        <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg border border-border/50 max-w-sm">
                            <p className="font-medium text-foreground/70 mb-1">Government of Tamil Nadu Initiative</p>
                            <p>In collaboration with Directorate of Medical & Rural Health Services, Govt. of Tamil Nadu and partner private hospitals across all 38 districts.</p>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
                            <li><Link href="/register" className="hover:text-primary transition-colors">Register as Donor</Link></li>
                            <li><Link href="/request" className="hover:text-primary transition-colors">Request Blood</Link></li>
                            <li><Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>
                        </ul>
                        <h4 className="font-semibold mt-6 mb-4">Features</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/matching" className="hover:text-primary transition-colors flex items-center gap-1"><Activity className="w-3 h-3" /> Automated Matching</Link></li>
                            <li><Link href="/inventory" className="hover:text-primary transition-colors flex items-center gap-1"><Droplet className="w-3 h-3" /> Real-Time Inventory</Link></li>
                            <li><Link href="/alerts" className="hover:text-primary transition-colors flex items-center gap-1"><Bell className="w-3 h-3" /> Emergency Alerts</Link></li>
                            <li><Link href="/predictions" className="hover:text-primary transition-colors flex items-center gap-1"><Brain className="w-3 h-3" /> AI Predictions</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Partner Hospitals</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>Rajiv Gandhi GGH, Chennai</li>
                            <li>Apollo Hospitals, Chennai</li>
                            <li>CMC Vellore</li>
                            <li>Govt. Rajaji Hospital, Madurai</li>
                            <li>Kauvery Hospital, Trichy</li>
                            <li className="text-primary text-xs font-medium">+ 15 more across Tamil Nadu</li>
                        </ul>
                        <h4 className="font-semibold mt-6 mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground flex flex-col items-center gap-2">
                    <p>&copy; {new Date().getFullYear()} TN LifeBlood System. All rights reserved.</p>
                    <p className="text-xs">An initiative by the Government of Tamil Nadu • Directorate of Medical & Rural Health Services</p>
                </div>
            </div>
        </footer>
    )
}
