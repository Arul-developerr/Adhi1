"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Activity,
    Bell,
    Building2,
    Droplet,
    Siren,
    Users,
} from "lucide-react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { PageHeader } from "@/components/ui/page-header";
import { KpiCard } from "@/components/ui/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DemoBadge } from "@/components/ui/demo-badge";
import { Badge, BloodGroupBadge, StockBadge, UrgencyBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { DemandSupplyChart } from "@/components/ui/demand-supply-chart";
import {
    AXIS_PROPS,
    CHART_COLORS,
    ChartCard,
    ChartTooltip,
    GRID_PROPS,
} from "@/components/ui/chart";
import {
    describeTrendGap,
    getNetworkStats,
    SCARCITY_CONFIG,
} from "@/lib/operations";
import { monthlyTrendData, tnAlerts, tnPredictionZones } from "@/lib/tn-data";
import { formatNumber, formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * Monthly demand vs supply, projected from the seeded district trend record.
 * The same series drives the predictions screen so the two views agree.
 */
const trendData = monthlyTrendData.map(({ month, demand, supply }) => ({
    month,
    demand,
    supply,
}));

const SCARCITY_BAR: Record<string, string> = {
    adequate: CHART_COLORS.success,
    moderate: CHART_COLORS.info,
    low: CHART_COLORS.warning,
    critical: CHART_COLORS.danger,
};

export default function DashboardPage() {
    const stats = React.useMemo(() => getNetworkStats(), []);

    const activeAlerts = React.useMemo(
        () =>
            tnAlerts
                .filter((a) => a.status === "active")
                .slice(0, 4),
        []
    );

    const scarceGroups = React.useMemo(
        () =>
            [...stats.groupBreakdown]
                .filter((g) => g.tier === "critical" || g.tier === "low" || g.tier === "moderate")
                .sort((a, b) => a.coverage - b.coverage),
        [stats.groupBreakdown]
    );

    const demandChart = React.useMemo(
        () =>
            stats.groupBreakdown.map((g) => ({
                group: g.group,
                units: g.units,
                tier: g.tier,
            })),
        [stats.groupBreakdown]
    );

    return (
        <div className="space-y-6">
            <PageHeader
                eyebrow={
                    <>
                        <span>Namakkal District</span>
                        <span aria-hidden="true">·</span>
                        <span>Tamil Nadu</span>
                    </>
                }
                title="District command centre"
                description="Inventory position, emergency pressure and donor reach across every blood bank in the district network."
                actions={<DemoBadge label="Seeded district snapshot" />}
            />

            {/* ── KPI row ─────────────────────────────────────────── */}
            <section aria-label="Key operational indicators">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <KpiCard
                        label="Units in stock"
                        value={formatNumber(stats.totalUnits)}
                        hint={`Across ${stats.bankCount} blood banks`}
                        icon={Droplet}
                        tone="brand"
                    />
                    <KpiCard
                        label="Registered donors"
                        value={formatNumber(stats.registeredDonors)}
                        hint={`${stats.availableDonors} currently available`}
                        icon={Users}
                        tone="info"
                    />
                    <KpiCard
                        label="Active alerts"
                        value={formatNumber(stats.activeAlerts)}
                        hint={`${stats.criticalAlerts} at critical urgency`}
                        icon={Bell}
                        tone="danger"
                    />
                    <KpiCard
                        label="Participating blood banks"
                        value={formatNumber(stats.bankCount)}
                        hint="Across Namakkal District"
                        icon={Building2}
                        tone="success"
                    />
                </div>
            </section>

            {/* ── Emergency strip ──────────────────────────────────── */}
            <section aria-label="Active emergency alerts">
                <Card className="border-danger-border">
                    <CardHeader className="flex-row items-center justify-between gap-3 space-y-0 pb-4">
                        <div className="flex items-center gap-2.5">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-danger-soft text-danger-text">
                                <Siren className="h-4 w-4" aria-hidden="true" />
                            </span>
                            <div>
                                <CardTitle>Emergency pressure</CardTitle>
                                <p className="mt-0.5 text-[12px] text-fg-muted">
                                    {stats.activeAlerts} active · {stats.criticalAlerts} critical
                                </p>
                            </div>
                        </div>
                        <Button asChild variant="outline" size="sm">
                            <Link href="/alerts">
                                Open alert centre
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {activeAlerts.length === 0 ? (
                            <EmptyState
                                title="No active alerts"
                                description="There are no unresolved emergency records in the current snapshot."
                            />
                        ) : (
                            <ul className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
                                {activeAlerts.map((alert, index) => (
                                    <motion.li
                                        key={alert.id}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05, duration: 0.25 }}
                                        className={cn(
                                            "flex items-start gap-3 rounded-lg border px-3.5 py-3",
                                            alert.urgency === "critical"
                                                ? "border-danger-border bg-danger-soft"
                                                : "border-line bg-surface-sunken"
                                        )}
                                    >
                                        <BloodGroupBadge group={alert.bloodGroup} />
                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <p className="truncate text-[13px] font-semibold text-fg">
                                                    {alert.hospitalName}
                                                </p>
                                                <UrgencyBadge urgency={alert.urgency} />
                                            </div>
                                            <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-fg-muted">
                                                {alert.message}
                                            </p>
                                            <p className="mt-1.5 text-[11px] text-fg-subtle">
                                                {alert.timestamp}
                                            </p>
                                        </div>
                                    </motion.li>
                                ))}
                            </ul>
                        )}
                    </CardContent>
                </Card>
            </section>

            {/* ── Main grid ────────────────────────────────────────── */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <ChartCard
                    title="Stock by blood group"
                    description="Units held district-wide against the equal-share par level."
                    legend={(
                        [
                            { tier: "adequate" as const, color: CHART_COLORS.success },
                            { tier: "moderate" as const, color: CHART_COLORS.info },
                            { tier: "low" as const, color: CHART_COLORS.warning },
                            { tier: "critical" as const, color: CHART_COLORS.danger },
                        ] as const
                    ).map(({ tier, color }) => ({
                        label: SCARCITY_CONFIG[tier].label,
                        color,
                    }))}
                    caption={
                        <>
                            {stats.criticalGroups === 0
                                ? "Every blood group is at or above the par level."
                                : `${stats.criticalGroups} blood group${
                                      stats.criticalGroups === 1 ? " is" : "s are"
                                  } below a quarter of the par level.`}{" "}
                            Scarcity tiers compare each group against {formatNumber(
                                Math.round(stats.parLevel)
                            )}{" "}
                            units, the network&rsquo;s equal share of {formatNumber(
                                stats.totalUnits
                            )}{" "}
                            units.
                        </>
                    }
                    className="lg:col-span-2"
                    bodyClassName="h-[260px] sm:h-[300px]"
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={demandChart}
                            margin={{ top: 4, right: 8, bottom: 0, left: -14 }}
                        >
                            <CartesianGrid {...GRID_PROPS} />
                            <XAxis dataKey="group" {...AXIS_PROPS} />
                            <YAxis {...AXIS_PROPS} width={52} />
                            <Tooltip
                                cursor={{ fill: "var(--surface-hover)" }}
                                content={
                                    <ChartTooltip
                                        unit="units"
                                        labelFormatter={(label) => `Blood group ${label}`}
                                    />
                                }
                            />
                            <Bar dataKey="units" name="Units" radius={[4, 4, 0, 0]} maxBarSize={48}>
                                {demandChart.map((entry) => (
                                    <Cell
                                        key={entry.group}
                                        fill={SCARCITY_BAR[entry.tier]}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle>Scarcity watch</CardTitle>
                        <p className="text-[12px] text-fg-muted">
                            Groups closest to depletion, by par coverage.
                        </p>
                    </CardHeader>
                    <CardContent className="space-y-2.5">
                        {scarceGroups.length === 0 ? (
                            <EmptyState
                                title="Stock is healthy"
                                description="No blood group has fallen below the moderate tier."
                            />
                        ) : (
                            scarceGroups.map((group) => (
                                <div key={group.group} className="space-y-1.5">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="flex items-center gap-2">
                                            <BloodGroupBadge
                                                group={group.group}
                                                size="sm"
                                            />
                                            <span className="num text-[13px] font-semibold text-fg">
                                                {formatNumber(group.units)}
                                            </span>
                                            <span className="text-[11px] text-fg-subtle">units</span>
                                        </span>
                                        <StockBadge tier={group.tier} />
                                    </div>
                                    <div
                                        className="h-1.5 w-full overflow-hidden rounded-full bg-surface-sunken"
                                        role="img"
                                        aria-label={`${group.group} holds ${Math.round(
                                            group.coverage * 100
                                        )}% of its par level`}
                                    >
                                        <div
                                            className="h-full rounded-full"
                                            style={{
                                                width: `${Math.min(group.coverage, 1) * 100}%`,
                                                background: SCARCITY_BAR[group.tier],
                                            }}
                                        />
                                    </div>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* ── Trend + zones ────────────────────────────────────── */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <ChartCard
                    title="Demand vs supply"
                    description="Monthly district totals, units per month."
                    legend={[
                        { label: "Demand", color: CHART_COLORS.danger },
                        { label: "Supply", color: CHART_COLORS.forest },
                    ]}
                    caption={describeTrendGap(trendData)}
                    className="lg:col-span-2"
                    bodyClassName="h-[240px] sm:h-[280px]"
                >
                    <DemandSupplyChart data={trendData} />
                </ChartCard>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle>Zones at risk</CardTitle>
                        <p className="text-[12px] text-fg-muted">
                            Forecast pressure by sub-district.
                        </p>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {tnPredictionZones
                            .filter((z) => z.riskLevel === "critical" || z.riskLevel === "high")
                            .map((zone) => (
                                <Link
                                    key={zone.district}
                                    href="/predictions"
                                    className="flex items-center gap-3 rounded-lg border border-line bg-surface-sunken px-3 py-2.5 transition-colors hover:border-line-strong"
                                >
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-[13px] font-semibold text-fg">
                                            {zone.district}
                                        </p>
                                        <p className="mt-0.5 text-[11px] text-fg-muted">
                                            {formatPercent(zone.changePercent)} demand
                                        </p>
                                    </div>
                                    <div className="flex shrink-0 items-center gap-2">
                                        <BloodGroupBadge
                                            group={zone.topShortage}
                                            size="sm"
                                        />
                                        <Badge
                                            tone={
                                                zone.riskLevel === "critical"
                                                    ? "danger"
                                                    : "warning"
                                            }
                                            dot
                                        >
                                            {zone.riskLevel}
                                        </Badge>
                                    </div>
                                </Link>
                            ))}
                    </CardContent>
                </Card>
            </div>

            {/* ── Quick actions ────────────────────────────────────── */}
            <section aria-label="Quick actions">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <QuickAction
                        href="/request"
                        icon={Siren}
                        title="Request blood"
                        description="Raise a requirement and search compatible donors"
                        tone="brand"
                    />
                    <QuickAction
                        href="/inventory"
                        icon={Droplet}
                        title="View inventory"
                        description="Per-bank stock across all eight blood groups"
                        tone="info"
                    />
                    <QuickAction
                        href="/matching"
                        icon={Activity}
                        title="Match donors"
                        description="Search the donor registry by compatibility"
                        tone="success"
                    />
                    <QuickAction
                        href="/alerts"
                        icon={Bell}
                        title="Alert centre"
                        description="Broadcast and resolve district incidents"
                        tone="warning"
                    />
                </div>
            </section>

            <p className="text-[11px] leading-relaxed text-fg-subtle">
                All figures on this screen are derived from the seeded district
                dataset. {SCARCITY_CONFIG.adequate.description} The network is not
                connected to hospital systems, so values do not update
                automatically.
            </p>
        </div>
    );
}

const QUICK_ACTION_TONE = {
    brand: "bg-brand-soft text-brand-text",
    info: "bg-info-soft text-info-text",
    success: "bg-success-soft text-success-text",
    warning: "bg-warning-soft text-warning-text",
} as const;

function QuickAction({
    href,
    icon: Icon,
    title,
    description,
    tone,
}: {
    href: string
    icon: typeof Building2
    title: string
    description: string
    tone: keyof typeof QUICK_ACTION_TONE
}) {
    return (
        <Link
            href={href}
            className="group flex items-start gap-3 rounded-xl border border-line bg-surface p-4 shadow-xs transition-[border-color,box-shadow] duration-200 hover:border-line-strong hover:shadow-sm"
        >
            <span
                className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                    QUICK_ACTION_TONE[tone]
                )}
            >
                <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
            </span>
            <span className="min-w-0">
                <span className="block text-[13px] font-semibold text-fg">{title}</span>
                <span className="mt-0.5 block text-[12px] leading-snug text-fg-muted">
                    {description}
                </span>
            </span>
        </Link>
    );
}
