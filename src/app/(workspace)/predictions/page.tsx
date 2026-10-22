"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
    Brain,
    MapPin,
    TrendingDown,
    TrendingUp,
    X,
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
import { Badge, BloodGroupBadge, RiskBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DemoBadge } from "@/components/ui/demo-badge";
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
    getDistrictDemandTotals,
    RISK_LABEL,
    RISK_ORDER,
} from "@/lib/operations";
import { monthlyTrendData, tnPredictionZones, type PredictionZone } from "@/lib/tn-data";
import { formatNumber, formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";

const RISK_BAR: Record<PredictionZone["riskLevel"], string> = {
    critical: CHART_COLORS.danger,
    high: CHART_COLORS.warning,
    medium: CHART_COLORS.info,
    low: CHART_COLORS.success,
};

/**
 * Forecast demand grouped by the season recorded on each zone.
 *
 * Derived from `tnPredictionZones` so the chart can only ever show demand
 * that exists in the project data.
 */
const seasonalData = (() => {
    const totals = new Map<string, number>();
    for (const zone of tnPredictionZones) {
        totals.set(
            zone.season,
            (totals.get(zone.season) ?? 0) + zone.predictedDemand
        );
    }
    return Array.from(totals.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([season, predicted]) => ({ season, predicted }));
})();

const SEASONAL_COLOR: Record<string, string> = {
    Monsoon: CHART_COLORS.info,
    Festival: CHART_COLORS.gold,
    Summer: CHART_COLORS.danger,
    Normal: CHART_COLORS.success,
};

/**
 * The legend follows the same order as the bars, so a colour in the legend
 * always refers to the bar directly beneath it.
 */
const SEASONAL_LEGEND = seasonalData.map(({ season }) => ({
    label: season,
    color: SEASONAL_COLOR[season] ?? CHART_COLORS.brand,
}));

export default function PredictionsPage() {
    const [selectedZone, setSelectedZone] = React.useState<PredictionZone | null>(null);

    const totals = React.useMemo(() => getDistrictDemandTotals(), []);

    const riskCounts = React.useMemo(() => {
        const counts: Record<PredictionZone["riskLevel"], number> = {
            critical: 0,
            high: 0,
            medium: 0,
            low: 0,
        };
        tnPredictionZones.forEach((z) => {
            counts[z.riskLevel] += 1;
        });
        return counts;
    }, []);

    const avgChange = React.useMemo(
        () =>
            tnPredictionZones.reduce((sum, z) => sum + z.changePercent, 0) /
            tnPredictionZones.length,
        []
    );

    const zoneChartData = React.useMemo(
        () =>
            tnPredictionZones.map((z) => ({
                district: z.district,
                current: z.currentDemand,
                predicted: z.predictedDemand,
                risk: z.riskLevel,
            })),
        []
    );

    const sortedZones = React.useMemo(
        () =>
            [...tnPredictionZones].sort(
                (a, b) => RISK_ORDER.indexOf(a.riskLevel) - RISK_ORDER.indexOf(b.riskLevel)
            ),
        []
    );

    return (
        <div className="space-y-6">
            <PageHeader
                eyebrow={
                    <>
                        <span>Intelligence</span>
                        <span aria-hidden="true">·</span>
                        <span>Demand forecasting</span>
                    </>
                }
                title="Demand predictions"
                description="Precomputed demand forecasts for the district's operational zones, with the seasonal factors behind each projection."
                actions={<DemoBadge label="Simulated forecasts" />}
            />

            {/* ── Overview ─────────────────────────────────────────── */}
            <section aria-label="Forecast overview">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <KpiCard
                        label="Current demand"
                        value={formatNumber(totals.current)}
                        hint="Units per month, all zones"
                        icon={TrendingUp}
                        tone="neutral"
                    />
                    <KpiCard
                        label="Predicted demand"
                        value={formatNumber(totals.predicted)}
                        hint={`${formatPercent(
                            ((totals.predicted - totals.current) / totals.current) * 100
                        )} against current`}
                        icon={Brain}
                        tone="brand"
                    />
                    <KpiCard
                        label="Critical zones"
                        value={riskCounts.critical}
                        hint={`${riskCounts.high} more at high risk`}
                        icon={MapPin}
                        tone="danger"
                    />
                    <KpiCard
                        label="Average change"
                        value={formatPercent(avgChange)}
                        hint="Mean projected increase per zone"
                        icon={TrendingUp}
                        tone="warning"
                    />
                </div>
            </section>

            {/* ── Charts ───────────────────────────────────────────── */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <ChartCard
                    title="Demand vs supply trend"
                    description="District monthly totals, units per month."
                    legend={[
                        { label: "Demand", color: CHART_COLORS.danger },
                        { label: "Supply", color: CHART_COLORS.forest },
                    ]}
                    caption={describeTrendGap(monthlyTrendData)}
                    className="lg:col-span-2"
                    bodyClassName="h-[240px] sm:h-[280px]"
                >
                    <DemandSupplyChart data={monthlyTrendData} />
                </ChartCard>

                <ChartCard
                    title="Predicted demand by seasonal driver"
                    description="Forecast demand attributed to the season recorded for each zone."
                    legend={SEASONAL_LEGEND}
                    caption={`${seasonalData
                        .slice(0, 2)
                        .map(({ season }) => season)
                        .join(" and ")} seasons carry the heaviest forecast pressure across the district's ${tnPredictionZones.length} operational zones.`}
                    bodyClassName="h-[240px] sm:h-[280px]"
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={seasonalData}
                            margin={{ top: 4, right: 8, bottom: 0, left: -8 }}
                        >
                            <CartesianGrid {...GRID_PROPS} />
                            <XAxis dataKey="season" {...AXIS_PROPS} />
                            <YAxis {...AXIS_PROPS} width={44} />
                            <Tooltip content={<ChartTooltip unit="units" />} />
                            <Bar
                                dataKey="predicted"
                                name="Predicted demand"
                                fill={CHART_COLORS.brand}
                                radius={[4, 4, 0, 0]}
                                maxBarSize={64}
                            >
                                {seasonalData.map((entry) => (
                                    <Cell
                                        key={entry.season}
                                        fill={SEASONAL_COLOR[entry.season] ?? CHART_COLORS.brand}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>

            {/* ── Zone comparison ──────────────────────────────────── */}
            <ChartCard
                title="Current vs predicted demand by zone"
                description="Bars show recorded demand against the forecast for the same period."
                legend={[
                    { label: "Current demand", color: CHART_COLORS.muted },
                    { label: "Low", color: RISK_BAR.low, group: "Forecast risk" },
                    { label: "Moderate", color: RISK_BAR.medium, group: "Forecast risk" },
                    { label: "High", color: RISK_BAR.high, group: "Forecast risk" },
                    { label: "Critical", color: RISK_BAR.critical, group: "Forecast risk" },
                ]}
                caption="Recorded demand is shown in grey; each forecast bar is coloured by the risk level assigned to that zone, so the most pressured zones read at a glance."
                bodyClassName="h-[280px] sm:h-[340px]"
            >
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={zoneChartData}
                        margin={{ top: 4, right: 8, bottom: 0, left: -14 }}
                    >
                        <CartesianGrid {...GRID_PROPS} />
                        <XAxis
                            dataKey="district"
                            {...AXIS_PROPS}
                            interval={0}
                            angle={-18}
                            textAnchor="end"
                            height={56}
                        />
                        <YAxis {...AXIS_PROPS} width={52} />
                        <Tooltip
                            cursor={{ fill: "var(--surface-hover)" }}
                            content={<ChartTooltip unit="units" />}
                        />
                        <Bar
                            dataKey="current"
                            name="Current demand"
                            fill={CHART_COLORS.muted}
                            radius={[4, 4, 0, 0]}
                            maxBarSize={26}
                        />
                        <Bar dataKey="predicted" name="Predicted demand" maxBarSize={26}>
                            {zoneChartData.map((entry) => (
                                <Cell
                                    key={entry.district}
                                    fill={RISK_BAR[entry.risk]}
                                    radius={4}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </ChartCard>

            {/* ── Zone register ────────────────────────────────────── */}
            <section aria-label="Zone forecast register">
                <div className="mb-3">
                    <h2 className="text-sm font-semibold tracking-tight text-fg">
                        Zone forecast register
                    </h2>
                    <p className="mt-0.5 text-[12px] text-fg-muted">
                        Select a zone to open its detailed analysis.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 xl:grid-cols-3">
                    {sortedZones.map((zone, index) => (
                        <motion.button
                            key={zone.district}
                            type="button"
                            onClick={() => setSelectedZone(zone)}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.04, duration: 0.25 }}
                            className={cn(
                                "group flex flex-col rounded-xl border bg-surface p-4 text-left shadow-xs",
                                "transition-[border-color,box-shadow] duration-200 hover:border-line-strong hover:shadow-sm",
                                zone.riskLevel === "critical"
                                    ? "border-danger-border"
                                    : "border-line"
                            )}
                        >
                            <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                    <h3 className="text-[14px] font-semibold text-fg">
                                        {zone.district}
                                    </h3>
                                    <p className="mt-0.5 text-[11px] text-fg-subtle">
                                        {zone.season} season factor
                                    </p>
                                </div>
                                <RiskBadge risk={zone.riskLevel} />
                            </div>

                            <dl className="mt-3 grid grid-cols-3 gap-2 border-t border-line pt-3">
                                <div>
                                    <dt className="text-[10px] font-semibold uppercase tracking-[0.07em] text-fg-subtle">
                                        Current
                                    </dt>
                                    <dd className="num mt-0.5 text-[15px] font-semibold text-fg">
                                        {formatNumber(zone.currentDemand)}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-[10px] font-semibold uppercase tracking-[0.07em] text-fg-subtle">
                                        Predicted
                                    </dt>
                                    <dd className="num mt-0.5 text-[15px] font-semibold text-fg">
                                        {formatNumber(zone.predictedDemand)}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-[10px] font-semibold uppercase tracking-[0.07em] text-fg-subtle">
                                        Change
                                    </dt>
                                    <dd className="num mt-0.5 flex items-center gap-1 text-[15px] font-semibold text-danger-text">
                                        {zone.changePercent > 0 ? (
                                            <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
                                        ) : (
                                            <TrendingDown className="h-3.5 w-3.5" aria-hidden="true" />
                                        )}
                                        {formatPercent(zone.changePercent)}
                                    </dd>
                                </div>
                            </dl>

                            <div className="mt-3 flex items-center gap-2 border-t border-line pt-3">
                                <span className="text-[11px] text-fg-muted">
                                    Shortage group
                                </span>
                                <BloodGroupBadge group={zone.topShortage} size="sm" />
                            </div>
                        </motion.button>
                    ))}
                </div>
            </section>

            {/* ── Detail panel ─────────────────────────────────────── */}
            <AnimatePresence>
                {selectedZone && (
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.25 }}
                    >
                        <Card className="border-brand-border">
                            <CardHeader className="flex-row items-start justify-between gap-3 space-y-0 pb-4">
                                <div>
                                    <CardTitle className="flex items-center gap-2 text-[15px]">
                                        <MapPin className="h-4 w-4 text-brand-text" aria-hidden="true" />
                                        {selectedZone.district} — detailed analysis
                                    </CardTitle>
                                    <p className="mt-1 text-[12px] text-fg-muted">
                                        Forecast for the next recorded period, in units per
                                        month.
                                    </p>
                                </div>
                                <div className="flex shrink-0 items-center gap-2">
                                    <RiskBadge risk={selectedZone.riskLevel} />
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setSelectedZone(null)}
                                        aria-label="Close detailed analysis"
                                    >
                                        <X className="h-4 w-4" aria-hidden="true" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                                    <DetailStat
                                        label="Current demand"
                                        value={formatNumber(selectedZone.currentDemand)}
                                        note="units / month"
                                    />
                                    <DetailStat
                                        label="Predicted demand"
                                        value={formatNumber(selectedZone.predictedDemand)}
                                        note="units / month"
                                        tone="brand"
                                    />
                                    <DetailStat
                                        label="Projected change"
                                        value={formatPercent(selectedZone.changePercent)}
                                        note="against current"
                                        tone="danger"
                                    />
                                    <DetailStat
                                        label="Risk assessment"
                                        value={RISK_LABEL[selectedZone.riskLevel]}
                                        note={`${selectedZone.season} season`}
                                        tone={
                                            selectedZone.riskLevel === "critical"
                                                ? "danger"
                                                : selectedZone.riskLevel === "high"
                                                  ? "warning"
                                                  : "neutral"
                                        }
                                    />
                                </div>

                                <div className="rounded-lg border border-line bg-surface-sunken p-4">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-[12px] text-fg-muted">
                                            Leading shortage group
                                        </span>
                                        <BloodGroupBadge
                                            group={selectedZone.topShortage}
                                            size="sm"
                                        />
                                        <Badge tone="neutral">
                                            {selectedZone.season} factor
                                        </Badge>
                                    </div>
                                    <p className="mt-2.5 text-[13px] leading-relaxed text-fg-muted">
                                        The forecast for {selectedZone.district} projects a{" "}
                                        <strong className="text-fg">
                                            {formatPercent(selectedZone.changePercent)}
                                        </strong>{" "}
                                        rise in demand against the current level, driven by
                                        the {selectedZone.season.toLowerCase()} season factor.
                                        The modelled pressure concentrates on the{" "}
                                        <strong className="text-fg">
                                            {selectedZone.topShortage}
                                        </strong>{" "}
                                        group within this zone.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            <p className="text-[11px] leading-relaxed text-fg-subtle">
                These forecasts are precomputed demonstration values held in the
                project data. No machine-learning model runs in this application, and
                no confidence scores, accuracy figures or clinical recommendations
                are inferred from them.
            </p>
        </div>
    );
}

function DetailStat({
    label,
    value,
    note,
    tone = "neutral",
}: {
    label: string
    value: string
    note?: string
    tone?: "neutral" | "brand" | "danger" | "warning"
}) {
    const valueClass = {
        neutral: "text-fg",
        brand: "text-brand-text",
        danger: "text-danger-text",
        warning: "text-warning-text",
    }[tone];

    return (
        <div className="rounded-lg border border-line bg-surface p-3.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.07em] text-fg-subtle">
                {label}
            </p>
            <p className={cn("num mt-1.5 text-[20px] font-semibold leading-none", valueClass)}>
                {value}
            </p>
            {note && <p className="mt-1.5 text-[11px] text-fg-muted">{note}</p>}
        </div>
    );
}
