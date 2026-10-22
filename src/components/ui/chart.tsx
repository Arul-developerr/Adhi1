"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Chart colour tokens.
 *
 * Series colours are defined once here so that a chart never invents its own
 * palette, and so the same series keeps the same meaning across screens.
 */
export const CHART_COLORS = {
    brand: "var(--brand)",
    forest: "var(--forest)",
    gold: "var(--gold)",
    success: "var(--success)",
    warning: "var(--warning)",
    danger: "var(--danger)",
    info: "var(--info)",
    muted: "var(--fg-subtle)",
} as const;

export type ChartColor = keyof typeof CHART_COLORS;

/** Common axis/grid styling so every chart reads as one system. */
export const AXIS_PROPS = {
    stroke: "var(--fg-subtle)",
    fontSize: 11,
    tickLine: false,
    axisLine: false,
} as const;

export const GRID_PROPS = {
    stroke: "var(--grid)",
    strokeDasharray: "3 3",
    vertical: false,
} as const;

export const CHART_MARGIN = { top: 8, right: 8, bottom: 0, left: -12 } as const;

/** Shared surface styling for Recharts tooltip popovers. */
export const TOOLTIP_STYLE = {
    backgroundColor: "var(--surface-raised)",
    border: "1px solid var(--border)",
    borderRadius: 10,
    boxShadow: "var(--shadow-pop)",
    fontSize: 12,
    color: "var(--fg)",
    padding: "8px 10px",
} as const;

export function ChartTooltip({
    active,
    payload,
    label,
    labelFormatter,
    valueFormatter,
    unit,
}: {
    active?: boolean
    payload?: Array<{ name?: string; value?: number | string; color?: string; dataKey?: string }>
    label?: string | number
    labelFormatter?: (label: string | number) => string
    valueFormatter?: (value: number | string) => string
    unit?: string
}) {
    if (!active || !payload || payload.length === 0) return null;

    const heading = labelFormatter ? labelFormatter(label ?? "") : String(label ?? "");

    return (
        <div style={TOOLTIP_STYLE} className="min-w-[9rem]">
            {heading && (
                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-fg-subtle">
                    {heading}
                </p>
            )}
            <ul className="space-y-1">
                {payload.map((entry, index) => {
                    const formatted = valueFormatter
                        ? valueFormatter(entry.value ?? "")
                        : `${entry.value ?? ""}${unit ? ` ${unit}` : ""}`;
                    return (
                        <li
                            key={`${entry.dataKey ?? index}`}
                            className="flex items-center gap-2 text-[12px]"
                        >
                            <span
                                className="h-2 w-2 shrink-0 rounded-[2px]"
                                style={{ background: entry.color }}
                                aria-hidden="true"
                            />
                            <span className="text-fg-muted">{entry.name}</span>
                            <span className="num ml-auto font-semibold text-fg">
                                {formatted}
                            </span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

/** Legend rendered outside the SVG so it stays legible on small screens. */
export function ChartLegend({
    items,
    className,
}: {
    items: Array<{ label: string; color: string; group?: string }>
    className?: string
}) {
    // Items sharing a `group` are rendered as one labelled cluster, so a
    // chart that encodes two things in colour can explain both.
    const groups: Array<{ name?: string; items: typeof items }> = [];
    for (const item of items) {
        const last = groups[groups.length - 1];
        if (last && last.name === item.group) last.items.push(item);
        else groups.push({ name: item.group, items: [item] });
    }

    return (
        <ul className={cn("flex flex-wrap items-center gap-x-4 gap-y-1.5", className)}>
            {groups.map((group, index) => (
                <li key={group.name ?? `group-${index}`} className="flex items-center gap-2">
                    {group.name && (
                        <span className="text-[11px] font-semibold uppercase tracking-[0.07em] text-fg-subtle">
                            {group.name}
                        </span>
                    )}
                    <ul className="flex flex-wrap items-center gap-x-3.5 gap-y-1.5">
                        {group.items.map((item) => (
                            <li
                                key={item.label}
                                className="flex items-center gap-1.5 text-[12px] text-fg-muted"
                            >
                                <span
                                    className="h-2 w-2 rounded-[2px]"
                                    style={{ background: item.color }}
                                    aria-hidden="true"
                                />
                                {item.label}
                            </li>
                        ))}
                    </ul>
                </li>
            ))}
        </ul>
    );
}

/**
 * Chart frame — title, optional description, the plot area, and a caption
 * that states what the chart shows in words for screen-reader users.
 */
export function ChartCard({
    title,
    description,
    legend,
    caption,
    action,
    className,
    bodyClassName,
    children,
}: {
    title: string
    description?: React.ReactNode
    legend?: Array<{ label: string; color: string; group?: string }>
    /** Plain-language summary of the chart's finding. */
    caption?: React.ReactNode
    action?: React.ReactNode
    className?: string
    bodyClassName?: string
    children: React.ReactNode
}) {
    return (
        <section
            className={cn(
                "rounded-xl border border-line bg-surface shadow-xs",
                className
            )}
        >
            <div className="flex flex-wrap items-start justify-between gap-3 px-5 pt-5">
                <div className="min-w-0">
                    <h2 className="text-sm font-semibold leading-tight tracking-tight text-fg">
                        {title}
                    </h2>
                    {description && (
                        <p className="mt-1 text-[12px] leading-relaxed text-fg-muted">
                            {description}
                        </p>
                    )}
                </div>
                {action}
            </div>

            {legend && legend.length > 0 && (
                <ChartLegend items={legend} className="px-5 pt-3" />
            )}

            <div className={cn("px-2 pb-4 pt-3 sm:px-3", bodyClassName)}>{children}</div>

            {caption && (
                <p className="border-t border-line px-5 py-3 text-[12px] leading-relaxed text-fg-muted">
                    {caption}
                </p>
            )}
        </section>
    );
}
