import * as React from "react";
import { cn } from "@/lib/utils";
import {
    ALERT_TYPE_LABEL,
    RISK_LABEL,
    SCARCITY_CONFIG,
    URGENCY_LABEL,
    type ScarcityTier,
} from "@/lib/operations";
import type { EmergencyAlert, PredictionZone } from "@/lib/tn-data";

export type Tone = "neutral" | "success" | "info" | "warning" | "danger" | "brand";

const TONE_CLASSES: Record<Tone, string> = {
    neutral: "bg-surface-sunken text-fg-muted border-line",
    success: "bg-success-soft text-success-text border-success-border",
    info: "bg-info-soft text-info-text border-info-border",
    warning: "bg-warning-soft text-warning-text border-warning-border",
    danger: "bg-danger-soft text-danger-text border-danger-border",
    brand: "bg-brand-soft text-brand-text border-brand-border",
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    tone?: Tone
    /** Renders a small leading status dot. */
    dot?: boolean
}

export function Badge({ className, tone = "neutral", dot, children, ...props }: BadgeProps) {
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-semibold leading-5",
                TONE_CLASSES[tone],
                className
            )}
            {...props}
        >
            {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />}
            {children}
        </span>
    );
}

/* ── Blood group badge ──────────────────────────────────────── */

export function BloodGroupBadge({
    group,
    className,
    size = "default",
}: {
    group: string
    className?: string
    size?: "sm" | "default"
}) {
    return (
        <span
            className={cn(
                "inline-flex items-center justify-center rounded-md border border-brand-border bg-brand-soft font-bold text-brand-text",
                size === "sm" ? "h-5 min-w-[2.1rem] px-1 text-[11px]" : "h-6 min-w-[2.4rem] px-1.5 text-xs",
                className
            )}
        >
            {group}
        </span>
    );
}

/* ── Scarcity / stock indicator ─────────────────────────────── */

const SCARCITY_TONE: Record<ScarcityTier, Tone> = {
    adequate: "success",
    moderate: "info",
    low: "warning",
    critical: "danger",
};

export function StockBadge({
    tier,
    className,
    showLabel = true,
}: {
    tier: ScarcityTier
    className?: string
    showLabel?: boolean
}) {
    return (
        <Badge tone={SCARCITY_TONE[tier]} className={className} dot>
            {showLabel ? SCARCITY_CONFIG[tier].label : null}
        </Badge>
    );
}

export const SCARCITY_TONE_MAP = SCARCITY_TONE;

/* ── Risk indicator ─────────────────────────────────────────── */

const RISK_TONE: Record<PredictionZone["riskLevel"], Tone> = {
    low: "success",
    medium: "info",
    high: "warning",
    critical: "danger",
};

export function RiskBadge({
    risk,
    className,
}: {
    risk: PredictionZone["riskLevel"]
    className?: string
}) {
    return (
        <Badge tone={RISK_TONE[risk]} className={className} dot>
            {RISK_LABEL[risk]} risk
        </Badge>
    );
}

export const RISK_TONE_MAP = RISK_TONE;

/* ── Alert status / urgency ─────────────────────────────────── */

const URGENCY_TONE: Record<EmergencyAlert["urgency"], Tone> = {
    critical: "danger",
    high: "warning",
    standard: "info",
};

export function UrgencyBadge({
    urgency,
    className,
}: {
    urgency: EmergencyAlert["urgency"]
    className?: string
}) {
    return (
        <Badge tone={URGENCY_TONE[urgency]} className={className} dot>
            {URGENCY_LABEL[urgency]}
        </Badge>
    );
}

const STATUS_TONE: Record<EmergencyAlert["status"], Tone> = {
    active: "danger",
    pending: "warning",
    resolved: "success",
};

export function AlertStatusBadge({
    status,
    className,
}: {
    status: EmergencyAlert["status"]
    className?: string
}) {
    return (
        <Badge tone={STATUS_TONE[status]} className={className}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
    );
}

export function AlertTypeBadge({
    type,
    className,
}: {
    type: EmergencyAlert["type"]
    className?: string
}) {
    return (
        <span className={cn("text-[11px] font-medium text-fg-subtle", className)}>
            {ALERT_TYPE_LABEL[type]}
        </span>
    );
}
