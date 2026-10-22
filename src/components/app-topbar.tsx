"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Menu, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { allNavItems, districtScope } from "@/lib/navigation";
import { BrandMark } from "./app-sidebar";
import { ThemeToggle } from "./theme-toggle";

export function AppTopbar({ onOpenNav }: { onOpenNav: () => void }) {
    const pathname = usePathname();
    const current = allNavItems.find((item) => item.href === pathname);
    const ScopeIcon = districtScope.icon;

    return (
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-line bg-surface/85 px-4 backdrop-blur-md sm:px-6">
            <button
                type="button"
                onClick={onOpenNav}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line text-fg-muted transition-colors hover:bg-surface-hover hover:text-fg lg:hidden"
                aria-label="Open navigation menu"
            >
                <Menu className="h-4 w-4" aria-hidden="true" />
            </button>

            <Link
                href="/"
                className="flex items-center gap-2 lg:hidden"
                aria-label="TN LifeBlood home"
            >
                <BrandMark className="h-7 w-7" />
            </Link>

            <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold leading-tight text-fg">
                    {current?.name ?? "Workspace"}
                </p>
                <p className="hidden truncate text-[11px] leading-tight text-fg-subtle sm:block">
                    {current?.description ?? "District blood network operations"}
                </p>
            </div>

            <div className="hidden items-center gap-2 md:flex">
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface-sunken px-2.5 py-1.5 text-[12px] font-medium text-fg-muted">
                    <ScopeIcon className="h-3.5 w-3.5" aria-hidden="true" />
                    {districtScope.name}
                </span>
            </div>

            <Link
                href="/matching"
                className="hidden h-9 items-center gap-2 rounded-lg border border-line bg-surface px-3 text-[13px] text-fg-subtle transition-colors hover:border-line-strong hover:text-fg xl:inline-flex"
                aria-label="Go to donor matching"
            >
                <Search className="h-3.5 w-3.5" aria-hidden="true" />
                Find donors
            </Link>

            <Link
                href="/alerts"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-surface text-fg-muted transition-colors hover:border-line-strong hover:text-fg"
                aria-label="Go to alerts"
            >
                <Bell className="h-4 w-4" aria-hidden="true" />
            </Link>

            <ThemeToggle />
        </header>
    );
}
