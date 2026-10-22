import * as React from "react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export interface KpiCardProps {
    label: string
    value: React.ReactNode
    /** Short supporting line, only when the data supports it. */
    hint?: React.ReactNode
    icon?: LucideIcon
    tone?: "neutral" | "brand" | "success" | "warning" | "danger" | "info"
    className?: string
}

const TONE_STYLES = {
    neutral: { icon: "bg-surface-sunken text-fg-muted", value: "text-fg" },
    brand: { icon: "bg-brand-soft text-brand-text", value: "text-fg" },
    success: { icon: "bg-success-soft text-success-text", value: "text-fg" },
    warning: { icon: "bg-warning-soft text-warning-text", value: "text-fg" },
    danger: { icon: "bg-danger-soft text-danger-text", value: "text-danger-text" },
    info: { icon: "bg-info-soft text-info-text", value: "text-fg" },
} as const;

export function KpiCard({
    label,
    value,
    hint,
    icon: Icon,
    tone = "neutral",
    className,
}: KpiCardProps) {
    const styles = TONE_STYLES[tone];

    return (
        <div
            className={cn(
                "group relative flex items-start gap-3.5 rounded-xl border border-line bg-surface p-4 shadow-xs",
                "transition-[border-color,box-shadow] duration-200 hover:border-line-strong hover:shadow-sm",
                className
            )}
        >
            {Icon && (
                <span
                    className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                        styles.icon
                    )}
                >
                    <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                </span>
            )}
            <div className="min-w-0 flex-1">
                <p className="label-eyebrow truncate">{label}</p>
                <p
                    className={cn(
                        "num mt-1.5 text-[26px] font-semibold leading-none tracking-tight",
                        styles.value
                    )}
                >
                    {value}
                </p>
                {hint && (
                    <p className="mt-1.5 text-[12px] leading-snug text-fg-muted">{hint}</p>
                )}
            </div>
        </div>
    );
}
