/**
 * Derived operational selectors.
 *
 * Every operational number shown in the product is computed here from the
 * seeded records in `src/lib/tn-data.ts`. Nothing in this module invents
 * records, and nothing assumes a live feed — the underlying data is static
 * demonstration data.
 */

import {
    bloodCompatibility,
    getTotalInventory,
    tnAlerts,
    tnDonors,
    tnHospitals,
    tnPredictionZones,
    type BloodInventory,
    type EmergencyAlert,
    type PredictionZone,
} from "./tn-data";
import { CANONICAL_BLOOD_GROUPS, type CanonicalBloodGroup } from "./blood-groups";

/* ── Scarcity model ────────────────────────────────────────────
 *
 * The district pool is at "par" for a blood group when that group holds an
 * equal share of the network's total stock (total units / 8 groups).
 * Coverage is the ratio of actual stock to that par level, and the tier
 * thresholds below are applied to that ratio. The rule is displayed in the
 * inventory legend so the classification is never opaque.
 */
export const SCARCITY_TIERS = ["adequate", "moderate", "low", "critical"] as const;
export type ScarcityTier = (typeof SCARCITY_TIERS)[number];

export interface ScarcityTierConfig {
    label: string
    /** Minimum coverage ratio required to sit in this tier. */
    minCoverage: number
    tone: "success" | "info" | "warning" | "danger"
    description: string
    /** Compact phrasing for a legend, where the subject is implied. */
    short: string
}

export const SCARCITY_CONFIG: Record<ScarcityTier, ScarcityTierConfig> = {
    adequate: {
        label: "Adequate",
        minCoverage: 1,
        tone: "success",
        description: "At or above the network par level for this group.",
        short: "at or above the par level",
    },
    moderate: {
        label: "Moderate",
        minCoverage: 0.5,
        tone: "info",
        description: "At least half the par level held for this group.",
        short: "at least half the par level",
    },
    low: {
        label: "Low",
        minCoverage: 0.25,
        tone: "warning",
        description: "Below half the par level held for this group.",
        short: "below half the par level",
    },
    critical: {
        label: "Critical",
        minCoverage: 0,
        tone: "danger",
        description: "Under a quarter of the par level held for this group.",
        short: "under a quarter of the par level",
    },
};

export interface GroupScarcity {
    group: CanonicalBloodGroup
    units: number
    /** Stock as a share of the equal-share par level. */
    coverage: number
    tier: ScarcityTier
    /** Share of the network's total units, 0–1. */
    share: number
}

export function getScarcityTier(coverage: number): ScarcityTier {
    if (coverage >= 1) return "adequate";
    if (coverage >= 0.5) return "moderate";
    if (coverage >= 0.25) return "low";
    return "critical";
}

/**
 * Stock tier for a single bank's holding of one blood group.
 * Uses the four-step ladder the inventory screen already applied
 * per bank: 200 / 100 / 50 units.
 */
export function getBankStockTier(units: number): ScarcityTier {
    if (units >= 200) return "adequate";
    if (units >= 100) return "moderate";
    if (units >= 50) return "low";
    return "critical";
}

export function sumInventory(inventory: BloodInventory): number {
    return CANONICAL_BLOOD_GROUPS.reduce((sum, group) => sum + inventory[group], 0);
}

/** An empty stock record with every group at zero. */
export function emptyInventory(): BloodInventory {
    return CANONICAL_BLOOD_GROUPS.reduce(
        (acc, group) => {
            acc[group] = 0;
            return acc;
        },
        {} as BloodInventory
    );
}

/** Add two stock records together, group by group. */
export function mergeInventory(
    a: BloodInventory,
    b: BloodInventory
): BloodInventory {
    return CANONICAL_BLOOD_GROUPS.reduce(
        (acc, group) => {
            acc[group] = a[group] + b[group];
            return acc;
        },
        {} as BloodInventory
    );
}

/** The group held in the smallest quantity — the zone's scarcest group. */
export function scarcestGroup(inventory: BloodInventory): {
    group: CanonicalBloodGroup
    units: number
} {
    let lowest: { group: CanonicalBloodGroup; units: number } = {
        group: CANONICAL_BLOOD_GROUPS[0],
        units: inventory[CANONICAL_BLOOD_GROUPS[0]],
    };
    for (const group of CANONICAL_BLOOD_GROUPS) {
        if (inventory[group] < lowest.units) {
            lowest = { group, units: inventory[group] };
        }
    }
    return lowest;
}

/** The par level per blood group: total network stock split evenly. */
export function getParLevel(): number {
    const total = sumInventory(getTotalInventory());
    return total / CANONICAL_BLOOD_GROUPS.length;
}

export function getGroupScarcity(inventory: BloodInventory = getTotalInventory()): GroupScarcity[] {
    const total = sumInventory(inventory);
    const par = getParLevel();

    return CANONICAL_BLOOD_GROUPS.map((group) => {
        const units = inventory[group];
        const coverage = par > 0 ? units / par : 0;
        return {
            group,
            units,
            coverage,
            tier: getScarcityTier(coverage),
            share: total > 0 ? units / total : 0,
        };
    });
}

export interface NetworkStats {
    totalUnits: number
    bankCount: number
    governmentBanks: number
    privateBanks: number
    registeredDonors: number
    availableDonors: number
    activeAlerts: number
    criticalAlerts: number
    pendingAlerts: number
    resolvedAlerts: number
    criticalGroups: number
    scarceGroups: number
    parLevel: number
    groupBreakdown: GroupScarcity[]
    zonesAtRisk: PredictionZone[]
}

export function getNetworkStats(): NetworkStats {
    const total = getTotalInventory();
    const groupBreakdown = getGroupScarcity(total);

    return {
        totalUnits: sumInventory(total),
        bankCount: tnHospitals.length,
        governmentBanks: tnHospitals.filter((h) => h.type === "government").length,
        privateBanks: tnHospitals.filter((h) => h.type === "private").length,
        registeredDonors: tnDonors.length,
        availableDonors: tnDonors.filter((d) => d.isAvailable).length,
        activeAlerts: tnAlerts.filter((a) => a.status === "active").length,
        criticalAlerts: tnAlerts.filter((a) => a.status === "active" && a.urgency === "critical").length,
        pendingAlerts: tnAlerts.filter((a) => a.status === "pending").length,
        resolvedAlerts: tnAlerts.filter((a) => a.status === "resolved").length,
        criticalGroups: groupBreakdown.filter((g) => g.tier === "critical").length,
        scarceGroups: groupBreakdown.filter((g) => g.tier === "low" || g.tier === "critical").length,
        parLevel: getParLevel(),
        groupBreakdown,
        zonesAtRisk: tnPredictionZones.filter((z) => z.riskLevel === "critical" || z.riskLevel === "high"),
    };
}

/* ── Alert helpers ───────────────────────────────────────────── */

export const ALERT_TYPE_LABEL: Record<EmergencyAlert["type"], string> = {
    critical_shortage: "Critical shortage",
    emergency_request: "Emergency request",
    expiry_warning: "Expiry warning",
    donor_match: "Donor match",
};

export const URGENCY_LABEL: Record<EmergencyAlert["urgency"], string> = {
    critical: "Critical",
    high: "High",
    standard: "Standard",
};

export const STATUS_LABEL: Record<EmergencyAlert["status"], string> = {
    active: "Active",
    pending: "Pending",
    resolved: "Resolved",
};

/** Demand-side events: emergencies and shortages raised against the network. */
export function getRequestStream(alerts: EmergencyAlert[] = tnAlerts): EmergencyAlert[] {
    return alerts.filter(
        (a) => a.type === "emergency_request" || a.type === "critical_shortage"
    );
}

/* ── Zone helpers ────────────────────────────────────────────── */

export const RISK_LABEL: Record<PredictionZone["riskLevel"], string> = {
    low: "Low",
    medium: "Moderate",
    high: "High",
    critical: "Critical",
};

export const RISK_ORDER: PredictionZone["riskLevel"][] = ["critical", "high", "medium", "low"];

export function getDistrictDemandTotals(): { current: number; predicted: number } {
    return tnPredictionZones.reduce(
        (acc, zone) => ({
            current: acc.current + zone.currentDemand,
            predicted: acc.predicted + zone.predictedDemand,
        }),
        { current: 0, predicted: 0 }
    );
}

/* ── Compatibility ──────────────────────────────────────────────
 *
 * The compatibility table itself lives in `tn-data.ts` and is the medical
 * rule set. This helper only reads it, so no page can restate the rule
 * differently from another.
 */

/**
 * Donor groups whose red cells can reach the given recipient group.
 */
export function getCompatibleDonorGroups(recipient: string): string[] {
    return Object.entries(bloodCompatibility)
        .filter(([, canDonateTo]) => canDonateTo.includes(recipient))
        .map(([group]) => group);
}

/* ── Trend narration ────────────────────────────────────────────
 *
 * Chart captions that describe a shape in the data are written from the
 * series itself, so the sentence cannot drift away from what is plotted.
 */

export interface TrendPoint {
    month: string
    demand: number
    supply: number
}

/**
 * Describes the supply shortfall in a monthly series: the first month in
 * which demand overtakes supply, and the widest gap that follows.
 */
export function describeTrendGap(series: TrendPoint[]): string {
    const shortfall = series.filter((point) => point.demand > point.supply);
    if (shortfall.length === 0) {
        const total = series.reduce(
            (sum, point) => sum + point.supply - point.demand,
            0
        );
        return `Recorded supply covers demand across the ${series.length}-month series by ${total.toLocaleString()} units.`;
    }

    const first = shortfall[0];
    const widest = shortfall.reduce((a, b) =>
        b.demand - b.supply > a.demand - a.supply ? b : a
    );

    return `Recorded demand outpaces recorded supply from ${first.month} onward, with the widest gap in ${widest.month} at ${widest.demand - widest.supply} units.`;
}
