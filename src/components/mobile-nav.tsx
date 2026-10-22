"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { navGroups } from "@/lib/navigation";
import { BrandMark } from "./app-sidebar";
import { ThemeToggle } from "./theme-toggle";

export function MobileNav({
    open,
    onClose,
}: {
    open: boolean
    onClose: () => void
}) {
    const pathname = usePathname();
    const panelRef = React.useRef<HTMLDivElement>(null);
    const previousFocus = React.useRef<HTMLElement | null>(null);

    React.useEffect(() => {
        if (!open) return;

        previousFocus.current = document.activeElement as HTMLElement;
        const panel = panelRef.current;
        panel?.querySelector<HTMLButtonElement>('button[aria-label="Close navigation menu"]')?.focus();

        const handleKey = (event: KeyboardEvent) => {
            if (event.key === "Escape") onClose();
            if (event.key === "Tab" && panel) {
                const controls = Array.from(panel.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'));
                const first = controls[0];
                const last = controls[controls.length - 1];
                if (event.shiftKey && document.activeElement === first) {
                    event.preventDefault();
                    last?.focus();
                } else if (!event.shiftKey && document.activeElement === last) {
                    event.preventDefault();
                    first?.focus();
                }
            }
        };
        document.addEventListener("keydown", handleKey);

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleKey);
            document.body.style.overflow = previousOverflow;
            previousFocus.current?.focus();
        };
    }, [open, onClose]);

    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-black/55 backdrop-blur-[2px] lg:hidden"
                        aria-hidden="true"
                    />
                    <motion.div
                        ref={panelRef}
                        role="dialog"
                        aria-modal="true"
                        aria-label="Navigation menu"
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ type: "spring", stiffness: 320, damping: 34 }}
                        className="fixed inset-y-0 left-0 z-50 flex w-[86%] max-w-[320px] flex-col bg-surface shadow-pop lg:hidden"
                    >
                        <div className="flex items-center justify-between border-b border-line px-4 py-4">
                            <Link
                                href="/"
                                onClick={onClose}
                                className="flex items-center gap-2.5"
                            >
                                <BrandMark />
                                <span className="text-[15px] font-semibold tracking-tight text-fg">
                                    TN LifeBlood
                                </span>
                            </Link>
                            <button
                                type="button"
                                onClick={onClose}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line text-fg-muted transition-colors hover:bg-surface-hover hover:text-fg"
                                aria-label="Close navigation menu"
                            >
                                <X className="h-4 w-4" aria-hidden="true" />
                            </button>
                        </div>

                        <nav
                            aria-label="Operational sections"
                            className="flex-1 space-y-5 overflow-y-auto px-4 py-5"
                        >
                            {navGroups.map((group) => (
                                <div key={group.label}>
                                    <p className="label-eyebrow px-3 pb-2">{group.label}</p>
                                    <ul className="space-y-0.5">
                                        {group.items.map((item) => {
                                            const active = pathname === item.href;
                                            const Icon = item.icon;
                                            return (
                                                <li key={item.href}>
                                                    <Link
                                                        href={item.href}
                                                        onClick={onClose}
                                                        aria-current={active ? "page" : undefined}
                                                        className={cn(
                                                            "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors",
                                                            active
                                                                ? "bg-brand-soft text-brand-text"
                                                                : "text-fg hover:bg-surface-hover"
                                                        )}
                                                    >
                                                        <span
                                                            className={cn(
                                                                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                                                                active
                                                                    ? "bg-brand/15 text-brand-text"
                                                                    : "bg-surface-sunken text-fg-muted"
                                                            )}
                                                        >
                                                            <Icon className="h-4 w-4" aria-hidden="true" />
                                                        </span>
                                                        <span className="min-w-0 flex-1">
                                                            <span className="block text-[13px] font-medium leading-tight">
                                                                {item.name}
                                                            </span>
                                                            <span className="mt-0.5 block truncate text-[11px] leading-tight text-fg-subtle">
                                                                {item.description}
                                                            </span>
                                                        </span>
                                                    </Link>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            ))}
                        </nav>

                        <div className="border-t border-line px-4 py-4">
                            <Link
                                href="/request"
                                onClick={onClose}
                                className="flex h-11 items-center justify-center gap-2 rounded-lg bg-brand text-sm font-medium text-brand-fg transition-colors hover:bg-brand-hover"
                            >
                                Request blood
                                <ArrowRight className="h-4 w-4" aria-hidden="true" />
                            </Link>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
