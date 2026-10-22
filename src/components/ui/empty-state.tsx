import * as React from "react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

/* ── Empty state ─────────────────────────────────────────────── */

export function EmptyState({
    icon: Icon,
    title,
    description,
    action,
    className,
}: {
    icon?: LucideIcon
    title: string
    description?: React.ReactNode
    action?: React.ReactNode
    className?: string
}) {
    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-line-strong bg-surface-sunken/50 px-6 py-12 text-center",
                className
            )}
        >
            {Icon && (
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-surface-sunken text-fg-subtle">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
            )}
            <div className="max-w-sm space-y-1">
                <p className="text-sm font-semibold text-fg">{title}</p>
                {description && (
                    <p className="text-[13px] leading-relaxed text-fg-muted">{description}</p>
                )}
            </div>
            {action}
        </div>
    );
}

/* ── Error state ─────────────────────────────────────────────── */

export function ErrorState({
    title = "Something went wrong",
    description,
    action,
    className,
}: {
    title?: string
    description?: React.ReactNode
    action?: React.ReactNode
    className?: string
}) {
    return (
        <div
            role="alert"
            className={cn(
                "flex flex-col items-center justify-center gap-3 rounded-xl border border-danger-border bg-danger-soft px-6 py-12 text-center",
                className
            )}
        >
            <div className="max-w-sm space-y-1">
                <p className="text-sm font-semibold text-danger-text">{title}</p>
                {description && (
                    <p className="text-[13px] leading-relaxed text-fg-muted">{description}</p>
                )}
            </div>
            {action}
        </div>
    );
}

/* ── Skeletons ───────────────────────────────────────────────── */

export function Skeleton({ className }: { className?: string }) {
    return <div className={cn("skeleton rounded-md", className)} aria-hidden="true" />;
}

export function SkeletonText({
    lines = 3,
    className,
}: {
    lines?: number
    className?: string
}) {
    return (
        <div className={cn("space-y-2", className)} aria-hidden="true">
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton
                    key={i}
                    className={cn("h-3", i === lines - 1 ? "w-2/3" : "w-full")}
                />
            ))}
        </div>
    );
}

export function SkeletonCard({ className }: { className?: string }) {
    return (
        <div
            className={cn(
                "rounded-xl border border-line bg-surface p-4 shadow-xs",
                className
            )}
            aria-hidden="true"
        >
            <div className="flex items-start gap-3.5">
                <Skeleton className="h-9 w-9 rounded-lg" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-2.5 w-24" />
                    <Skeleton className="h-5 w-16" />
                </div>
            </div>
        </div>
    );
}
