"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Droplet, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { districtScope, navGroups } from "@/lib/navigation";
import { tnHospitals } from "@/lib/tn-data";

export function BrandMark({ className }: { className?: string }) {
    return (
        <span
            className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand text-brand-fg",
                className
            )}
            aria-hidden="true"
        >
            <Droplet className="h-[18px] w-[18px] fill-current stroke-[1.5]" />
        </span>
    );
}

export function SidebarNav({ onNavigate, collapsed = false }: { onNavigate?: () => void; collapsed?: boolean }) {
    const pathname = usePathname();

    return (
        <nav aria-label="Operational sections" className="flex-1 space-y-6 overflow-y-auto py-1">
            {navGroups.map((group) => (
                <div key={group.label}>
                    {collapsed ? <p className="sr-only">{group.label}</p> : <p className="label-eyebrow px-3 pb-2">{group.label}</p>}
                    <ul className="space-y-0.5">
                        {group.items.map((item) => {
                            const active = pathname === item.href;
                            const Icon = item.icon;

                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        onClick={onNavigate}
                                        aria-current={active ? "page" : undefined}
                                        title={collapsed ? item.name : undefined}
                                        className={cn(
                                            "group relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium",
                                            collapsed && "justify-center px-2",
                                            "transition-colors duration-150",
                                            active
                                                ? "bg-brand-soft text-brand-text"
                                                : "text-fg-muted hover:bg-surface-hover hover:text-fg"
                                        )}
                                    >
                                        {active && (
                                            <motion.span
                                                layoutId="sidebar-active-rail"
                                                className="absolute inset-y-1.5 left-0 w-[3px] rounded-full bg-brand"
                                                transition={{
                                                    type: "spring",
                                                    stiffness: 380,
                                                    damping: 32,
                                                }}
                                            />
                                        )}
                                        <Icon
                                            className={cn(
                                                "h-[15px] w-[15px] shrink-0",
                                                active
                                                    ? "text-brand-text"
                                                    : "text-fg-subtle group-hover:text-fg-muted"
                                            )}
                                            aria-hidden="true"
                                        />
                                        <span className={collapsed ? "sr-only" : "truncate"}>{item.name}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            ))}
        </nav>
    );
}

export function Sidebar({ className, collapsed = false, onToggle }: { className?: string; collapsed?: boolean; onToggle?: () => void }) {
    const ScopeIcon = districtScope.icon;

    return (
        <div
            className={cn(
                "flex h-full flex-col gap-5 border-r border-line bg-surface py-5",
                collapsed ? "px-3" : "px-4",
                className
            )}
        >
            <Link
                href="/"
                className={cn("flex items-center gap-2.5 rounded-lg px-1 py-0.5 transition-opacity hover:opacity-85", collapsed && "justify-center")}
                aria-label={collapsed ? "TN LifeBlood home" : undefined}
            >
                <BrandMark />
                {!collapsed && <span className="min-w-0">
                    <span className="block text-[15px] font-semibold leading-tight tracking-tight text-fg">
                        TN LifeBlood
                    </span>
                    <span className="block text-[10px] font-medium uppercase leading-tight tracking-[0.08em] text-fg-subtle">
                        District Blood Network
                    </span>
                </span>}
            </Link>

            <SidebarNav collapsed={collapsed} />

            {!collapsed && <div className="rounded-lg border border-line bg-surface-sunken p-3">
                <div className="flex items-start gap-2.5">
                    <ScopeIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand-text" aria-hidden="true" />
                    <div className="min-w-0">
                        <p className="text-[12px] font-semibold leading-tight text-fg">
                            {districtScope.name}
                        </p>
                        <p className="mt-0.5 text-[11px] leading-snug text-fg-muted">
                            {districtScope.state} · {tnHospitals.length} blood banks
                        </p>
                    </div>
                </div>
            </div>}
            {onToggle && <button type="button" onClick={onToggle} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"} title={collapsed ? "Expand sidebar" : "Collapse sidebar"} className={cn("flex h-10 items-center gap-2 rounded-lg border border-line px-3 text-[12px] font-medium text-fg-muted transition-colors hover:bg-surface-hover hover:text-fg", collapsed && "justify-center px-2")}>
                {collapsed ? <PanelLeftOpen className="h-4 w-4" aria-hidden="true" /> : <PanelLeftClose className="h-4 w-4" aria-hidden="true" />}
                {!collapsed && "Collapse sidebar"}
            </button>}
        </div>
    );
}
