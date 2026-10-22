"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Droplet, LayoutDashboard, Siren } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "Inventory", href: "/inventory", icon: Droplet },
    { label: "Request", href: "/request", icon: Siren },
    { label: "Alerts", href: "/alerts", icon: Bell },
] as const;

export function MobileBottomNav() {
    const pathname = usePathname();
    return (
        <nav aria-label="Quick navigation" className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden">
            <ul className="grid grid-cols-4">
                {items.map(({ label, href, icon: Icon }) => {
                    const active = pathname === href;
                    return <li key={href}>
                        <Link href={href} aria-current={active ? "page" : undefined} className={cn("flex min-h-14 flex-col items-center justify-center gap-1 px-1 text-[10px] font-medium transition-colors", active ? "text-brand-text" : "text-fg-muted hover:text-fg")}>
                            <Icon className="h-5 w-5" aria-hidden="true" />
                            <span>{label}</span>
                        </Link>
                    </li>;
                })}
            </ul>
        </nav>
    );
}
