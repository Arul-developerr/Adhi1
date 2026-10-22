import Link from "next/link";
import { tnHospitals } from "@/lib/tn-data";
import { BrandMark } from "./app-sidebar";

const platformLinks = [
    { name: "Operational dashboard", href: "/dashboard" },
    { name: "Blood inventory", href: "/inventory" },
    { name: "Donor matching", href: "/matching" },
    { name: "Emergency requests", href: "/request" },
];

const intelligenceLinks = [
    { name: "Alerts centre", href: "/alerts" },
    { name: "Demand predictions", href: "/predictions" },
    { name: "Donor registration", href: "/register" },
];

export function MarketingFooter() {
    const year = new Date().getFullYear();

    return (
        <footer className="border-t border-line bg-surface">
            <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6">
                <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-2.5">
                            <BrandMark />
                            <span className="min-w-0">
                                <span className="block text-[15px] font-semibold leading-tight tracking-tight text-fg">
                                    TN LifeBlood
                                </span>
                                <span className="block text-[10px] font-medium uppercase leading-tight tracking-[0.08em] text-fg-subtle">
                                    Smart Blood Bank Management
                                </span>
                            </span>
                        </div>
                        <p className="mt-4 max-w-md text-[13px] leading-relaxed text-fg-muted">
                            A blood-bank management interface for the Namakkal District
                            network — covering donor registration, compatibility
                            matching, stock monitoring, emergency alerting and demand
                            forecasting across government and private blood banks.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-[13px] font-semibold text-fg">Platform</h2>
                        <ul className="mt-3 space-y-2">
                            {platformLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-[13px] text-fg-muted transition-colors hover:text-brand-text"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-[13px] font-semibold text-fg">Intelligence</h2>
                        <ul className="mt-3 space-y-2">
                            {intelligenceLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-[13px] text-fg-muted transition-colors hover:text-brand-text"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mt-10 rounded-lg border border-line bg-surface-sunken p-4">
                    <p className="text-[12px] font-semibold text-fg">
                        Demonstration system — no live clinical data
                    </p>
                    <p className="mt-1.5 max-w-3xl text-[12px] leading-relaxed text-fg-muted">
                        TN LifeBlood is a portfolio demonstration built on seeded
                        records for {tnHospitals.length} Namakkal District blood banks.
                        Inventory, donor and alert values are illustrative, and the
                        application has no database, no hospital integration and no
                        outbound messaging. Donor registration, alert broadcasting and
                        request matching operate in the browser only and are not
                        persisted beyond the current session.
                    </p>
                </div>

                <div className="mt-8 flex flex-col gap-2 border-t border-line pt-6 text-[12px] text-fg-subtle sm:flex-row sm:items-center sm:justify-between">
                    <p>&copy; {year} TN LifeBlood. Demonstration project.</p>
                    <p>Namakkal District, Tamil Nadu</p>
                </div>
            </div>
        </footer>
    );
}
