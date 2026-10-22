"use client";

import * as React from "react";
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
    local: boolean
}

/**
 * Schematic positions for the district's operational zones. The positions
 * are illustrative; only the values they carry come from the data.
 *
 * The `district` key is the exact value recorded in the prediction data, so
 * a node can never silently fail to join to its zone.
 */
const LAYOUT: Array<{ id: string; district: string; x: number; y: number }> = [
    { id: "namakkal", district: "Namakkal Town", x: 50, y: 52 },
    { id: "tiruchengode", district: "Tiruchengode", x: 22, y: 78 },
    { id: "rasipuram", district: "Rasipuram", x: 78, y: 25 },
    { id: "paramathi", district: "Paramathi-Velur", x: 22, y: 25 },
    { id: "mohanur", district: "Mohanur", x: 78, y: 78 },
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
        local,
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
    const [selectedId, setSelectedId] = React.useState<string | null>(null);
    const [previewId, setPreviewId] = React.useState<string | null>(null);
    const activeId = previewId ?? selectedId;
    const active = activeId ? nodeById(activeId) : null;

    const zoneButton = (node: Node, compact: boolean) => (
        <button
            key={node.id}
            type="button"
            onClick={() => setSelectedId((current) => current === node.id ? null : node.id)}
            onMouseEnter={() => setPreviewId(node.id)}
            onMouseLeave={() => setPreviewId(null)}
            onFocus={() => setPreviewId(node.id)}
            onBlur={() => setPreviewId(null)}
            aria-pressed={selectedId === node.id}
            aria-label={`${node.label} zone, ${RISK_LABEL[node.risk]} forecast risk, ${node.change} percent demand change, scarcest group ${node.group}`}
            className={`group flex items-center gap-2.5 rounded-lg border bg-surface px-3 py-2 text-left shadow-sm transition-[border-color,background-color,box-shadow,transform] duration-200 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${activeId === node.id ? "border-forest bg-surface-raised shadow-md" : "border-line hover:border-line-strong"} ${compact ? "w-full hover:-translate-y-0.5" : "absolute w-[166px] -translate-x-1/2 -translate-y-1/2"}`}
            style={compact ? undefined : { left: `${node.x}%`, top: `${node.y}%` }}
        >
            <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border" style={{ borderColor: RISK_COLOR[node.risk], background: `color-mix(in srgb, ${RISK_COLOR[node.risk]} 12%, var(--surface))` }} aria-hidden="true">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: RISK_COLOR[node.risk] }} />
            </span>
            <span className="min-w-0">
                <span className="block text-[11px] font-semibold leading-tight text-fg">{node.label}</span>
                <span className="mt-0.5 block text-[10px] leading-tight text-fg-muted">{RISK_LABEL[node.risk]} risk</span>
            </span>
        </button>
    );

    return (
        <div className={className}>
            <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-3 sm:px-5">
                    <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-forest dark:text-success-text">District network</p>
                        <p className="mt-0.5 text-[13px] font-semibold text-fg">Namakkal operational zones</p>
                    </div>
                    <span className="rounded-full border border-line bg-surface-sunken px-2.5 py-1 text-[11px] font-medium text-fg-muted">{NODES.length} zones · {tnHospitals.length} banks</span>
                </div>

                <div className="relative hidden h-[330px] bg-bg sm:block lg:h-[370px]" style={{ backgroundImage: "linear-gradient(to right, var(--grid) 1px, transparent 1px), linear-gradient(to bottom, var(--grid) 1px, transparent 1px)", backgroundSize: "32px 32px" }}>
                    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
                        {LINKS.map(([from, to]) => {
                            const a = nodeById(from);
                            const b = nodeById(to);
                            const lit = activeId === from || activeId === to;
                            return <line key={`${from}-${to}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={lit ? "var(--forest)" : "var(--border-strong)"} strokeWidth={lit ? 2 : 1.2} vectorEffect="non-scaling-stroke" opacity={lit ? 0.9 : 0.65} className="transition-[stroke,opacity] duration-200" />;
                        })}
                    </svg>
                    {NODES.map((node) => zoneButton(node, false))}
                </div>

                <div className="grid gap-2 bg-bg p-3 sm:hidden">
                    {NODES.map((node) => zoneButton(node, true))}
                </div>

                <div className="grid gap-3 border-t border-line px-4 py-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-5">
                    <div aria-live="polite" className="min-h-[36px]">
                        {active ? <>
                            <p className="text-[12px] font-semibold text-fg">{active.label} <span className="font-normal text-fg-muted">· {RISK_LABEL[active.risk]} risk</span></p>
                            <p className="mt-0.5 text-[11px] text-fg-muted">+{active.change}% projected demand · scarcest group {active.group} · {active.banks} {active.local ? (active.banks === 1 ? "local bank" : "local banks") : "district banks"}</p>
                        </> : <>
                            <p className="text-[12px] font-semibold text-fg">Select a zone</p>
                            <p className="mt-0.5 text-[11px] text-fg-muted">Inspect forecast risk and seeded bank coverage.</p>
                        </>}
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-1.5" aria-label="Forecast risk legend">
                        {[...RISK_ORDER].reverse().map((risk) => <span key={risk} className="flex items-center gap-1.5 text-[10px] font-medium text-fg-muted"><span className="h-2 w-2 rounded-full" style={{ background: RISK_COLOR[risk] }} aria-hidden="true" />{RISK_LABEL[risk]}</span>)}
                    </div>
                </div>
            </div>

            <p className="mt-2.5 text-[11px] leading-relaxed text-fg-subtle">
                Schematic of the district&rsquo;s {NODES.length} operational zones.
                Positions and connection lines are illustrative, not a geographic
                projection or operational transfer routes. Risk colours come from the seeded forecast data.
            </p>
        </div>
    );
}
