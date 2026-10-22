"use client";

import * as React from "react";
import { Sidebar } from "./app-sidebar";
import { AppTopbar } from "./app-topbar";
import { MobileNav } from "./mobile-nav";
import { MobileBottomNav } from "./mobile-bottom-nav";

/**
 * Operational workspace shell.
 *
 * A fixed desktop sidebar carries the route hierarchy, a compact top bar
 * carries page context and utilities, and the content region below holds
 * the active screen. On small screens the sidebar becomes a drawer so the
 * operational layout is genuinely mobile-first rather than a shrunken one.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
    const [navOpen, setNavOpen] = React.useState(false);
    const [collapsed, setCollapsed] = React.useState(false);

    return (
        <div className="min-h-screen bg-bg">
            <aside className={`fixed inset-y-0 left-0 z-40 hidden transition-[width] duration-200 lg:block ${collapsed ? "w-[72px]" : "w-[248px]"}`}>
                <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((value) => !value)} />
            </aside>

            <MobileNav open={navOpen} onClose={() => setNavOpen(false)} />
            <MobileBottomNav />

            <div className={`transition-[padding] duration-200 ${collapsed ? "lg:pl-[72px]" : "lg:pl-[248px]"}`}>
                <AppTopbar onOpenNav={() => setNavOpen(true)} />
                <main id="main-content" className="px-4 pb-24 pt-6 sm:px-6 sm:pt-8 lg:pb-8">
                    <div className="mx-auto w-full max-w-[1400px]">{children}</div>
                </main>
            </div>
        </div>
    );
}
