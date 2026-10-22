"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
    tnHospitals,
    tnPredictionZones,
    type Hospital,
    type PredictionZone,
} from "@/lib/tn-data";
import {
    emptyInventory,
    mergeInventory,
    RISK_LABEL,
    RISK_ORDER,
    scarcestGroup,
} from "@/lib/operations";

interface Node {
    id: string
    x: number
    y: number
    label: string
    group: string
    risk: PredictionZone["riskLevel"]
    change: number
    banks: number
}

/**
 * Schematic positions for the district's operational zones. The positions
 * are illustrative; only the values they carry come from the data.
 *
 * The `district` key is the exact value recorded in the prediction data, so
 * a node can never silently fail to join to its zone.
 */
const LAYOUT: Array<{ id: string; district: string; x: number; y: number }> = [
    { id: "namakkal", district: "Namakkal Town", x: 50, y: 40 },
    { id: "tiruchengode", district: "Tiruchengode", x: 18, y: 66 },
    { id: "rasipuram", district: "Rasipuram", x: 78, y: 24 },
    { id: "paramathi", district: "Paramathi-Velur", x: 30, y: 18 },
    { id: "mohanur", district: "Mohanur", x: 82, y: 70 },
];

/**
 * A zone's own blood bank is the one in the same town. The "Namakkal Town"
 * zone is served by the banks recorded under the "Namakkal" city, so the
 * lookup falls back to the first word of the zone name before giving up and
 * showing the whole district's banks.
 */
function banksForZone(zone: PredictionZone): {
    banks: Hospital[]
    /** True when the zone has banks of its own rather than the whole district. */
    local: boolean
} {
    const byCity = tnHospitals.filter((h) => h.city === zone.district);
    if (byCity.length > 0) return { banks: byCity, local: true };

    const byName = tnHospitals.filter(
        (h) => h.city === zone.district.split(" ")[0]
    );
    if (byName.length > 0) return { banks: byName, local: true };

    return { banks: tnHospitals, local: false };
}

const NODES: Node[] = LAYOUT.map(({ id, district, x, y }) => {
    const zone = tnPredictionZones.find((z) => z.district === district);

    if (!zone) {
        // Every layout entry is a district in the forecast data. If that
        // ever stops being true the join should be loud, not silent.
        throw new Error(
            `DistrictNetwork: no forecast zone matches "${district}".`
        );
    }

    const { banks: zoneBanks, local } = banksForZone(zone);

    const stock = zoneBanks.reduce(
        (acc, bank) => mergeInventory(acc, bank.inventory),
        emptyInventory()
    );
    const scarcest = scarcestGroup(stock);

    return {
        id,
        x,
        y,
        label: zone.district,
        group: scarcest.group,
        risk: zone.riskLevel,
        change: zone.changePercent,
        banks: local ? zoneBanks.length : tnHospitals.length,
    };
});

const LINKS: Array<[string, string]> = [
    ["namakkal", "tiruchengode"],
    ["namakkal", "rasipuram"],
    ["namakkal", "paramathi"],
    ["namakkal", "mohanur"],
    ["tiruchengode", "mohanur"],
];

const RISK_COLOR: Record<PredictionZone["riskLevel"], string> = {
    critical: "var(--danger)",
    high: "var(--warning)",
    medium: "var(--info)",
    low: "var(--success)",
};

function nodeById(id: string) {
    return NODES.find((n) => n.id === id)!;
}

/**
 * Stylised district topology.
 *
 * The node positions are a hand-drawn schematic of the district's five
 * operational zones — they are a designed diagram, not a geographic
 * projection, and carry no coordinate claim. The stock figures shown on
 * hover are derived from the seeded blood-bank data.
 */
export function DistrictNetwork({ className }: { className?: string }) {
    const [activeId, setActiveId] = React.useState<string | null>(null);
    const active = activeId ? nodeById(activeId) : null;

    return (
        <div className={className}>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-line bg-surface">
                {/* Grid backdrop */}
                <div
                    className="absolute inset-0 opacity-70"
                    style={{
                        backgroundImage:
                            "linear-gradient(to right, var(--grid) 1px, transparent 1px), linear-gradient(to bottom, var(--grid) 1px, transparent 1px)",
                        backgroundSize: "36px 36px",
                    }}
                    aria-hidden="true"
                />

                <svg
                    viewBox="0 0 400 300"
                    preserveAspectRatio="none"
                    className="absolute inset-0 h-full w-full"
                    aria-hidden="true"
                >
                    {LINKS.map(([from, to], index) => {
                        const a = nodeById(from);
                        const b = nodeById(to);
                        const isLit =
                            activeId !== null && (a.id === activeId || b.id === activeId);
                        return (
                            <motion.line
                                key={`${from}-${to}`}
                                x1={(a.x / 100) * 400}
                                y1={(a.y / 100) * 300}
                                x2={(b.x / 100) * 400}
                                y2={(b.y / 100) * 300}
                                stroke={isLit ? "var(--forest)" : "var(--border-strong)"}
                                strokeWidth={isLit ? 1.8 : 1.2}
                                vectorEffect="non-scaling-stroke"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 1 }}
                                transition={{
                                    pathLength: {
                                        delay: 0.25 + index * 0.12,
                                        duration: 0.7,
                                        ease: "easeInOut",
                                    },
                                    opacity: { delay: 0.25 + index * 0.12, duration: 0.2 },
                                }}
                            />
                        );
                    })}
                </svg>

                {/* Nodes */}
                {NODES.map((node, index) => (
                    <motion.button
                        key={node.id}
                        type="button"
                        onClick={() =>
                            setActiveId((prev) => (prev === node.id ? null : node.id))
                        }
                        onMouseEnter={() => setActiveId(node.id)}
                        onMouseLeave={() => setActiveId(null)}
                        style={{ left: `${node.x}%`, top: `${node.y}%` }}
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 + index * 0.09, duration: 0.35 }}
                        className="group absolute -translate-x-1/2 -translate-y-1/2 focus-visible:outline-none"
                        aria-label={`${node.label} zone, ${RISK_LABEL[node.risk]} forecast risk, ${node.change} percent demand change, scarcest group ${node.group}`}
                    >
                        <span
                            className="relative flex h-7 w-7 items-center justify-center rounded-full border-2 transition-transform duration-200 group-hover:scale-110"
                            style={{
                                borderColor: RISK_COLOR[node.risk],
                                background: `color-mix(in srgb, ${RISK_COLOR[node.risk]} 18%, transparent)`,
                            }}
                        >
                            <span
                                className="h-2 w-2 rounded-full"
                                style={{ background: RISK_COLOR[node.risk] }}
                            />
                            {node.risk === "critical" && (
                                <span
                                    className="absolute inset-0 rounded-full"
                                    style={{
                                        boxShadow: `0 0 0 4px color-mix(in srgb, ${RISK_COLOR[node.risk]} 18%, transparent)`,
                                    }}
                                    aria-hidden="true"
                                />
                            )}
                        </span>
                        <span className="pointer-events-none absolute left-1/2 top-full mt-1.5 -translate-x-1/2 whitespace-nowrap text-[10px] font-semibold leading-none text-fg-muted">
                            {node.label}
                        </span>
                    </motion.button>
                ))}

                {/* Legend */}
                <div className="absolute bottom-3 left-3 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border border-line bg-surface/90 px-2.5 py-1.5 backdrop-blur-sm">
                    {[...RISK_ORDER].reverse().map((risk) => (
                        <span
                            key={risk}
                            className="flex items-center gap-1.5 text-[10px] font-medium text-fg-muted"
                        >
                            <span
                                className="h-1.5 w-1.5 rounded-full"
                                style={{ background: RISK_COLOR[risk] }}
                                aria-hidden="true"
                            />
                            {RISK_LABEL[risk]}
                        </span>
                    ))}
                </div>

                {/* Readout */}
                <div className="absolute right-3 top-3 min-w-[9.5rem] rounded-lg border border-line bg-surface/95 px-3 py-2 shadow-sm backdrop-blur-sm">
                    {active ? (
                        <>
                            <p className="text-[11px] font-semibold text-fg">
                                {active.label}
                            </p>
                            <p className="mt-0.5 text-[10px] text-fg-muted">
                                {active.change > 0 ? "+" : ""}
                                {active.change}% demand ·{" "}
                                <span style={{ color: RISK_COLOR[active.risk] }}>
                                    {RISK_LABEL[active.risk]} risk
                                </span>
                            </p>
                            <p className="mt-0.5 text-[10px] text-fg-subtle">
                                Scarcest group {active.group} · {active.banks} bank
                                {active.banks === 1 ? "" : "s"}
                            </p>
                        </>
                    ) : (
                        <p className="text-[10px] leading-relaxed text-fg-subtle">
                            Hover a zone to inspect its
                            <br />
                            forecast position.
                        </p>
                    )}
                </div>
            </div>

            <p className="mt-2.5 text-[11px] leading-relaxed text-fg-subtle">
                Schematic of the district&rsquo;s {NODES.length} operational zones.
                Node positions are illustrative, not a geographic projection; each
                node is coloured by the forecast risk recorded for that zone.
            </p>
        </div>
    );
}
