"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
    Building2,
    Filter,
    MapPin,
    Phone,
    RotateCcw,
    Droplet,
    Layers,
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
import { Badge, BloodGroupBadge, StockBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { EmptyState } from "@/components/ui/empty-state";
import {
    AXIS_PROPS,
    CHART_COLORS,
    ChartCard,
    ChartTooltip,
    GRID_PROPS,
} from "@/components/ui/chart";
import {
    emptyInventory,
    getBankStockTier,
    getGroupScarcity,
    getParLevel,
    SCARCITY_CONFIG,
    sumInventory,
    type ScarcityTier,
} from "@/lib/operations";
import { tnDistricts, tnHospitals, getTotalInventory, type BloodInventory } from "@/lib/tn-data";
import { CANONICAL_BLOOD_GROUPS } from "@/lib/blood-groups";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

const SCARCITY_BAR: Record<ScarcityTier, string> = {
    adequate: CHART_COLORS.success,
    moderate: CHART_COLORS.info,
    low: CHART_COLORS.warning,
    critical: CHART_COLORS.danger,
};

const districtOptions = tnDistricts.map((d) => ({ label: d, value: d }));
const typeOptions = [
    { label: "Government", value: "government" },
    { label: "Private", value: "private" },
];
const groupOptions = CANONICAL_BLOOD_GROUPS.map((g) => ({ label: g, value: g }));

export default function InventoryPage() {
    const [district, setDistrict] = React.useState("");
    const [bankType, setBankType] = React.useState("");
    const [bloodGroup, setBloodGroup] = React.useState("");

    const filteredBanks = React.useMemo(() => {
        return tnHospitals.filter((bank) => {
            if (district && bank.district !== district) return false;
            if (bankType && bank.type !== bankType) return false;
            if (bloodGroup && bank.inventory[bloodGroup as keyof BloodInventory] === 0) {
                return false;
            }
            return true;
        });
    }, [district, bankType, bloodGroup]);

    const filteredInventory = React.useMemo(() => {
        const totals = emptyInventory();
        filteredBanks.forEach((bank) => {
            (Object.keys(totals) as Array<keyof BloodInventory>).forEach((key) => {
                totals[key] += bank.inventory[key];
            });
        });
        return totals;
    }, [filteredBanks]);

    const scarcity = React.useMemo(
        () => getGroupScarcity(filteredInventory),
        [filteredInventory]
    );

    const filteredTotal = sumInventory(filteredInventory);
    const networkTotal = sumInventory(getTotalInventory());
    const isFiltered = Boolean(district || bankType || bloodGroup);

    const chartData = React.useMemo(
        () =>
            scarcity.map((entry) => ({
                group: entry.group,
                units: entry.units,
                tier: entry.tier,
                coverage: entry.coverage,
            })),
        [scarcity]
    );

    const criticalCount = scarcity.filter((s) => s.tier === "critical").length;
    const scarceCount = scarcity.filter(
        (s) => s.tier === "critical" || s.tier === "low"
    ).length;

    const resetFilters = () => {
        setDistrict("");
        setBankType("");
        setBloodGroup("");
    };

    return (
        <div className="space-y-6">
            <PageHeader
                eyebrow={
                    <>
                        <span>Blood operations</span>
                        <span aria-hidden="true">·</span>
                        <span>Stock monitoring</span>
                    </>
                }
                title="Blood inventory"
                description="Unit holdings for every blood group across the district network, with scarcity classified against an equal-share par level."
                actions={<DemoBadge label="Seeded stock records" />}
            />

            {/* ── Summary ──────────────────────────────────────────── */}
            <section aria-label="Inventory summary">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <KpiCard
                        label="Units in view"
                        value={formatNumber(filteredTotal)}
                        hint={
                            isFiltered
                                ? `of ${formatNumber(networkTotal)} across the full network`
                                : `Across ${tnHospitals.length} blood banks`
                        }
                        icon={Droplet}
                        tone="brand"
                    />
                    <KpiCard
                        label="Blood banks"
                        value={formatNumber(filteredBanks.length)}
                        hint={
                            isFiltered
                                ? `of ${tnHospitals.length} in the network`
                                : `${tnHospitals.filter((b) => b.type === "government").length} government · ${
                                      tnHospitals.filter((b) => b.type === "private").length
                                  } private`
                        }
                        icon={Building2}
                        tone="info"
                    />
                    <KpiCard
                        label="Groups scarce"
                        value={`${scarceCount} / ${CANONICAL_BLOOD_GROUPS.length}`}
                        hint="Low or critical against par level"
                        icon={Layers}
                        tone="warning"
                    />
                    <KpiCard
                        label="Groups critical"
                        value={formatNumber(criticalCount)}
                        hint={
                            criticalCount === 0
                                ? "No group below a quarter of par"
                                : "Under 25% of the par level"
                        }
                        icon={Layers}
                        tone="danger"
                    />
                </div>
            </section>

            {/* ── Filters ──────────────────────────────────────────── */}
            <Card>
                <CardHeader className="flex-row items-center justify-between gap-3 space-y-0 pb-4">
                    <div className="flex items-center gap-2.5">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-sunken text-fg-muted">
                            <Filter className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <div>
                            <CardTitle>Filters</CardTitle>
                            <p className="mt-0.5 text-[12px] text-fg-muted">
                                Narrow the directory and totals.
                            </p>
                        </div>
                    </div>
                    {isFiltered && (
                        <Button variant="ghost" size="sm" onClick={resetFilters} className="gap-1.5">
                            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                            Clear
                        </Button>
                    )}
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="filter-district">District</Label>
                            <Select
                                id="filter-district"
                                value={district}
                                onChange={(e) => setDistrict(e.target.value)}
                                options={districtOptions}
                                placeholder="All districts"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="filter-type">Bank type</Label>
                            <Select
                                id="filter-type"
                                value={bankType}
                                onChange={(e) => setBankType(e.target.value)}
                                options={typeOptions}
                                placeholder="All types"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="filter-group">Blood group</Label>
                            <Select
                                id="filter-group"
                                value={bloodGroup}
                                onChange={(e) => setBloodGroup(e.target.value)}
                                options={groupOptions}
                                placeholder="All groups"
                            />
                        </div>
                        <div className="flex items-end">
                            <p className="text-[12px] leading-relaxed text-fg-muted">
                                {bloodGroup
                                    ? `Showing banks holding ${bloodGroup} units.`
                                    : "Group selection keeps only banks holding that group."}
                            </p>
                        </div>
                    </div>

                    {isFiltered && (
                        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-4">
                            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-fg-subtle">
                                Applied
                            </span>
                            {district && (
                                <Badge tone="brand" dot>
                                    {district}
                                </Badge>
                            )}
                            {bankType && (
                                <Badge tone="brand" dot>
                                    {bankType === "government" ? "Government" : "Private"}
                                </Badge>
                            )}
                            {bloodGroup && (
                                <Badge tone="brand" dot>
                                    {bloodGroup}
                                </Badge>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* ── Chart ────────────────────────────────────────────── */}
            <ChartCard
                title="Aggregate stock by blood group"
                description="Units held across the banks currently in view."
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
                        Scarcity tiers compare each group with the network&rsquo;s
                        equal-share par level of {formatNumber(Math.round(getParLevel()))}{" "}
                        units, so a group is judged against the whole district
                        rather than against the banks currently in view.{" "}
                        {SCARCITY_CONFIG.critical.description}
                    </>
                }
                bodyClassName="h-[260px] sm:h-[320px]"
            >
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
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
                        <Bar dataKey="units" name="Units" radius={[4, 4, 0, 0]} maxBarSize={54}>
                            {chartData.map((entry) => (
                                <Cell key={entry.group} fill={SCARCITY_BAR[entry.tier]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </ChartCard>

            {/* ── Bank directory ───────────────────────────────────── */}
            <section aria-label="Blood bank directory">
                <div className="mb-3 flex items-center justify-between gap-3">
                    <h2 className="text-sm font-semibold tracking-tight text-fg">
                        Blood bank directory
                        <span className="ml-2 text-[12px] font-normal text-fg-muted">
                            {filteredBanks.length} of {tnHospitals.length}
                        </span>
                    </h2>
                </div>

                {filteredBanks.length === 0 ? (
                    <EmptyState
                        icon={Building2}
                        title="No blood banks match these filters"
                        description="Adjust or clear the filters to return to the full district network."
                        action={
                            <Button variant="outline" size="sm" onClick={resetFilters} className="gap-1.5">
                                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                                Clear filters
                            </Button>
                        }
                    />
                ) : (
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                        {filteredBanks.map((bank, index) => {
                            const bankTotal = sumInventory(bank.inventory);
                            const groups = CANONICAL_BLOOD_GROUPS.map((group) => ({
                                group,
                                units: bank.inventory[group],
                                tier: getBankStockTier(bank.inventory[group]),
                            }));
                            const criticalGroups = groups.filter((g) => g.tier === "critical");

                            return (
                                <motion.article
                                    key={bank.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.04, duration: 0.25 }}
                                    className="flex flex-col rounded-xl border border-line bg-surface shadow-xs transition-[border-color,box-shadow] duration-200 hover:border-line-strong hover:shadow-sm"
                                >
                                    <div className="flex items-start justify-between gap-3 border-b border-line p-4">
                                        <div className="min-w-0">
                                            <h3 className="text-[13px] font-semibold leading-snug text-fg">
                                                {bank.name}
                                            </h3>
                                            <p className="mt-1 flex items-center gap-1.5 text-[12px] text-fg-muted">
                                                <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
                                                {bank.city}, {bank.district}
                                            </p>
                                        </div>
                                        <Badge
                                            tone={bank.type === "government" ? "info" : "neutral"}
                                            className="shrink-0"
                                        >
                                            {bank.type === "government" ? "Govt" : "Private"}
                                        </Badge>
                                    </div>

                                    <div className="p-4">
                                        <div className="grid grid-cols-4 gap-1.5">
                                            {groups.map((entry) => (
                                                <div
                                                    key={entry.group}
                                                    className={cn(
                                                        "rounded-md border px-1 py-1.5 text-center",
                                                        bloodGroup === entry.group
                                                            ? "border-brand-border bg-brand-soft"
                                                            : "border-line bg-surface-sunken"
                                                    )}
                                                >
                                                    <p className="text-[10px] font-semibold text-fg-muted">
                                                        {entry.group}
                                                    </p>
                                                    <p
                                                        className={cn(
                                                            "num mt-0.5 text-[13px] font-semibold",
                                                            entry.tier === "critical"
                                                                ? "text-danger-text"
                                                                : entry.tier === "low"
                                                                  ? "text-warning-text"
                                                                  : "text-fg"
                                                        )}
                                                    >
                                                        {entry.units}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-3 flex flex-wrap items-center gap-1.5">
                                            {criticalGroups.length > 0 ? (
                                                <Badge tone="danger" dot>
                                                    {criticalGroups.length} critical group
                                                    {criticalGroups.length === 1 ? "" : "s"}
                                                </Badge>
                                            ) : (
                                                <Badge tone="success" dot>
                                                    No critical groups
                                                </Badge>
                                            )}
                                            {bank.hours && (
                                                <Badge tone="neutral">{bank.hours}</Badge>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-auto space-y-2 border-t border-line p-4 text-[12px]">
                                        <p className="flex items-start gap-1.5 text-fg-muted">
                                            <MapPin className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" />
                                            <span>{bank.address}</span>
                                        </p>
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <span className="flex items-center gap-1.5 text-fg-muted">
                                                <Phone className="h-3 w-3 shrink-0" aria-hidden="true" />
                                                {bank.contact}
                                            </span>
                                            <span className="num text-fg-subtle">
                                                {formatNumber(bankTotal)} /{" "}
                                                {formatNumber(bank.bloodBankCapacity)} units
                                            </span>
                                        </div>
                                    </div>
                                </motion.article>
                            );
                        })}
                    </div>
                )}
            </section>

            <p className="text-[11px] leading-relaxed text-fg-subtle">
                Unit counts are illustrative seeded values and do not represent
                physical stock in any real facility. Capacity reflects the stated
                storage capacity of each bank, not a measured fill rate.
            </p>
        </div>
    );
}
