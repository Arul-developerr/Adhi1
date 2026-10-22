"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Activity,
    ArrowRight,
    Bell,
    Brain,
    Building2,
    Check,
    Droplet,
    LayoutDashboard,
    ShieldCheck,
    Siren,
    Users,
} from "lucide-react";
import { DistrictNetwork } from "@/components/district-network";
import { Button } from "@/components/ui/button";
import { Badge, BloodGroupBadge, RiskBadge } from "@/components/ui/badge";
import { DemoBadge } from "@/components/ui/demo-badge";
import { CANONICAL_BLOOD_GROUPS } from "@/lib/blood-groups";
import {
    getCompatibleDonorGroups,
    getNetworkStats,
    RISK_ORDER,
    SCARCITY_CONFIG,
    SCARCITY_TIERS,
} from "@/lib/operations";
import { tnPredictionZones } from "@/lib/tn-data";
import { formatNumber } from "@/lib/format";

const CAPABILITIES = [
    {
        icon: Siren,
        title: "Emergency requests",
        description:
            "Raise a requirement against a receiving facility, then search the registry for donors whose red cells are compatible, ranked by distance.",
        href: "/request",
        points: ["Urgency levels", "Compatibility filtering", "Simulated donor notice"],
    },
    {
        icon: Activity,
        title: "Compatibility matching",
        description:
            "An illustrative red-cell compatibility matrix filters the seeded donor pool before results are ranked by distance.",
        href: "/matching",
        points: ["Eight-group matrix", "Availability filtering", "Distance and ETA"],
    },
    {
        icon: Droplet,
        title: "Inventory monitoring",
        description:
            "Unit holdings for every blood group at every bank, classified against an equal-share par level so scarcity is visible before it bites.",
        href: "/inventory",
        points: ["All eight groups", "Scarcity tiers", "Bank-level detail"],
    },
    {
        icon: Bell,
        title: "Incident management",
        description:
            "A single feed for shortages, expiry warnings and emergency requests, with a broadcast flow and explicit resolution state.",
        href: "/alerts",
        points: ["Urgency triage", "Broadcast flow", "Resolution tracking"],
    },
    {
        icon: Brain,
        title: "Demand forecasting",
        description:
            "Zone-level demand projections with the seasonal factors behind them, so collection effort can be directed before a shortage forms.",
        href: "/predictions",
        points: [`${tnPredictionZones.length} zones`, "Seasonal drivers", "Risk classification"],
    },
    {
        icon: Users,
        title: "Donor registration",
        description:
            "A three-step enrolment flow with inline validation and an eligibility review against the configured age and weight thresholds.",
        href: "/register",
        points: ["Step validation", "Eligibility checks", "Review summary"],
    },
];

const WORKFLOW = [
    {
        step: "01",
        title: "Enrol or raise a request",
        description:
            "Donors register their group and reach. Hospitals raise a requirement with the group, unit count and urgency they need.",
    },
    {
        step: "02",
        title: "Resolve compatibility",
        description:
            "The donor–recipient matrix narrows the registry to blood groups whose red cells can actually reach the patient.",
    },
    {
        step: "03",
        title: "Rank by proximity",
        description:
            "Available donors are ordered by distance and estimated travel time, so the closest viable match surfaces first.",
    },
    {
        step: "04",
        title: "Track and resolve",
        description:
            "The incident enters the alert feed with its urgency, and stays visible until it is explicitly resolved.",
    },
];

/**
 * Zones ranked by risk, then by projected change. The register shows the
 * three most pressured zones; the count in the caption reflects every zone in
 * the forecast.
 */
const topRiskZones = [...tnPredictionZones]
    .sort(
        (a, b) =>
            RISK_ORDER.indexOf(a.riskLevel) - RISK_ORDER.indexOf(b.riskLevel) ||
            b.changePercent - a.changePercent
    )
    .slice(0, 3);

export default function MarketingHome() {
    const stats = React.useMemo(() => getNetworkStats(), []);

    const rareGroups = React.useMemo(
        () =>
            [...stats.groupBreakdown]
                .sort((a, b) => a.coverage - b.coverage)
                .slice(0, 3),
        [stats.groupBreakdown]
    );

    /**
     * The compatibility panel reflects the scarcest group, so the
     * highlighted badges are the donors that can actually reach it.
     */
    const compatibleDonorGroups = React.useMemo(
        () => getCompatibleDonorGroups(rareGroups[0]?.group ?? "O-"),
        [rareGroups]
    );

    return (
        <>
            {/* ── Hero ───────────────────────────────────────────────── */}
            <section className="relative overflow-hidden border-b border-line">
                <div
                    className="pointer-events-none absolute inset-0 opacity-60"
                    style={{
                        backgroundImage:
                            "radial-gradient(60rem 30rem at 78% -10%, var(--brand-softer), transparent 70%)",
                    }}
                    aria-hidden="true"
                />

                <div className="relative mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:items-center lg:gap-14 lg:py-20">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            <div className="flex flex-wrap items-center gap-2">
                                <Badge tone="brand" dot>
                                    Namakkal District, Tamil Nadu
                                </Badge>
                                <DemoBadge label="Portfolio demonstration" />
                            </div>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.45, delay: 0.06 }}
                            className="mt-5 text-[34px] font-semibold leading-[1.08] tracking-[-0.02em] text-fg sm:text-[44px] lg:text-[52px]"
                        >
                            Where blood is available,
                            <br />
                            <span className="text-brand-text">
                                and where it is urgently needed
                            </span>
                            <span className="text-fg-subtle">.</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.45, delay: 0.12 }}
                            className="mt-5 max-w-xl text-[15px] leading-relaxed text-fg-muted"
                        >
                            TN LifeBlood connects the district&rsquo;s{" "}
                            {stats.bankCount} blood banks to the requests and donors
                            that keep them supplied — one operational surface for
                            stock, matching, emergencies and demand.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.45, delay: 0.18 }}
                            className="mt-7 flex flex-col gap-3 sm:flex-row"
                        >
                            <Button asChild size="lg" className="gap-2">
                                <Link href="/request">
                                    <Siren className="h-4 w-4" aria-hidden="true" />
                                    Request blood
                                </Link>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="gap-2">
                                <Link href="/dashboard">
                                    <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
                                    Open the workspace
                                </Link>
                            </Button>
                        </motion.div>

                        <motion.dl
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.26 }}
                            className="mt-9 grid max-w-lg grid-cols-2 gap-x-6 gap-y-5 border-t border-line pt-6 sm:grid-cols-4"
                        >
                            {[
                                { label: "Blood banks", value: stats.bankCount },
                                { label: "Units in stock", value: stats.totalUnits },
                                { label: "Registered donors", value: stats.registeredDonors },
                                { label: "Zones forecast", value: tnPredictionZones.length },
                            ].map((stat) => (
                                <div key={stat.label}>
                                    {/* A two-line label box keeps every value on
                                        the same baseline, however long the
                                        label is. */}
                                    <dt className="flex min-h-[2.1em] items-start text-[11px] font-medium uppercase leading-tight tracking-[0.07em] text-fg-subtle">
                                        {stat.label}
                                    </dt>
                                    <dd className="num mt-1 text-[22px] font-semibold leading-none text-fg">
                                        {formatNumber(stat.value)}
                                    </dd>
                                </div>
                            ))}
                        </motion.dl>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.55, delay: 0.1 }}
                    >
                        <DistrictNetwork />
                    </motion.div>
                </div>
            </section>

            {/* ── Platform overview ──────────────────────────────────── */}
            <section id="platform" className="border-b border-line">
                <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:py-20">
                    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
                        <div className="lg:sticky lg:top-24 lg:self-start">
                            <p className="label-eyebrow">The platform</p>
                            <h2 className="mt-3 text-[28px] font-semibold leading-tight tracking-[-0.015em] text-fg sm:text-[34px]">
                                One operational surface for the whole district
                            </h2>
                            <p className="mt-4 text-[15px] leading-relaxed text-fg-muted">
                                A blood bank does not experience shortages, requests
                                and donors as separate problems. TN LifeBlood treats
                                them as one continuous supply position, so the
                                people running the network read from the same
                                picture.
                            </p>
                            <p className="mt-4 text-[13px] leading-relaxed text-fg-subtle">
                                Every figure in this demonstration is computed from a
                                seeded dataset of {stats.bankCount} blood banks. The
                                application has no backend, no hospital integration
                                and no outbound messaging.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {CAPABILITIES.map((capability, index) => {
                                const Icon = capability.icon;
                                return (
                                    <motion.div
                                        key={capability.title}
                                        initial={{ opacity: 0, y: 14 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: "-60px" }}
                                        transition={{ duration: 0.4, delay: index * 0.05 }}
                                    >
                                        <Link
                                            href={capability.href}
                                            className="group flex h-full flex-col rounded-xl border border-line bg-surface p-5 shadow-xs transition-[border-color,box-shadow] duration-200 hover:border-line-strong hover:shadow-sm"
                                        >
                                            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-soft text-brand-text">
                                                <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                                            </span>
                                            <h3 className="mt-3.5 text-[14px] font-semibold text-fg">
                                                {capability.title}
                                            </h3>
                                            <p className="mt-1.5 flex-1 text-[13px] leading-relaxed text-fg-muted">
                                                {capability.description}
                                            </p>
                                            <ul className="mt-3.5 space-y-1.5 border-t border-line pt-3.5">
                                                {capability.points.map((point) => (
                                                    <li
                                                        key={point}
                                                        className="flex items-center gap-1.5 text-[11px] text-fg-subtle"
                                                    >
                                                        <Check
                                                            className="h-3 w-3 shrink-0 text-success-text"
                                                            aria-hidden="true"
                                                        />
                                                        {point}
                                                    </li>
                                                ))}
                                            </ul>
                                            <span className="mt-4 inline-flex items-center gap-1 text-[12px] font-medium text-brand-text">
                                                Open
                                                <ArrowRight
                                                    className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                                                    aria-hidden="true"
                                                />
                                            </span>
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Inventory position ─────────────────────────────────── */}
            <section id="inventory" className="border-b border-line bg-surface">
                <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:py-20">
                    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-16">
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-80px" }}
                            transition={{ duration: 0.45 }}
                        >
                            <p className="label-eyebrow">Inventory &amp; scarcity</p>
                            <h2 className="mt-3 text-[28px] font-semibold leading-tight tracking-[-0.015em] text-fg sm:text-[34px]">
                                Scarcity is a ratio, not a feeling
                            </h2>
                            <p className="mt-4 text-[15px] leading-relaxed text-fg-muted">
                                Each blood group is measured against an equal share of
                                the network&rsquo;s total stock. Groups are then tiered
                                by how far they sit from that par level — so the
                                groups most likely to run short are identifiable
                                without guessing.
                            </p>
                            <ul className="mt-6 space-y-3">
                                {SCARCITY_TIERS.map((tier) => (
                                    <li
                                        key={tier}
                                        className="flex items-center gap-3 text-[13px] text-fg-muted"
                                    >
                                        <span
                                            className="h-2.5 w-2.5 shrink-0 rounded-full"
                                            style={{
                                                background: `var(--${SCARCITY_CONFIG[tier].tone})`,
                                            }}
                                            aria-hidden="true"
                                        />
                                        {SCARCITY_CONFIG[tier].label} —{" "}
                                        {SCARCITY_CONFIG[tier].short}
                                    </li>
                                ))}
                            </ul>
                            <Button asChild variant="outline" className="mt-6 gap-2">
                                <Link href="/inventory">
                                    Open inventory
                                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                                </Link>
                            </Button>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-80px" }}
                            transition={{ duration: 0.45, delay: 0.08 }}
                            className="rounded-xl border border-line bg-bg p-5 shadow-xs sm:p-6"
                        >
                            <div className="flex items-center justify-between gap-3">
                                <h3 className="text-[13px] font-semibold text-fg">
                                    Group position
                                </h3>
                                <span className="num text-[11px] text-fg-subtle">
                                    par {formatNumber(Math.round(stats.parLevel))} units
                                </span>
                            </div>

                            <ul className="mt-4 space-y-3">
                                {stats.groupBreakdown.map((group) => (
                                    <li key={group.group}>
                                        <div className="flex items-center justify-between gap-3">
                                            <span className="flex items-center gap-2">
                                                <BloodGroupBadge
                                                    group={group.group}
                                                    size="sm"
                                                />
                                                <span className="num text-[13px] font-semibold text-fg">
                                                    {formatNumber(group.units)}
                                                </span>
                                            </span>
                                            <span className="num text-[11px] text-fg-subtle">
                                                {Math.round(group.coverage * 100)}% of par
                                            </span>
                                        </div>
                                        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-surface-sunken">
                                            <div
                                                className="h-full rounded-full"
                                                style={{
                                                    width: `${Math.min(group.coverage, 1) * 100}%`,
                                                    background: [
                                                        "var(--success)",
                                                        "var(--info)",
                                                        "var(--warning)",
                                                        "var(--danger)",
                                                    ][
                                                        group.tier === "adequate"
                                                            ? 0
                                                            : group.tier === "moderate"
                                                              ? 1
                                                              : group.tier === "low"
                                                                ? 2
                                                                : 3
                                                    ],
                                                }}
                                            />
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── Matching ───────────────────────────────────────────── */}
            <section id="matching" className="border-b border-line">
                <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:py-20">
                    <div className="max-w-2xl">
                        <p className="label-eyebrow">Donor matching</p>
                        <h2 className="mt-3 text-[28px] font-semibold leading-tight tracking-[-0.015em] text-fg sm:text-[34px]">
                            Compatibility first, proximity second
                        </h2>
                        <p className="mt-4 text-[15px] leading-relaxed text-fg-muted">
                            A nearby donor with the wrong blood group is no use at
                            all. Matching resolves the full donor–recipient matrix
                            first, then ranks whatever survives by distance and
                            travel time.
                        </p>
                    </div>

                    <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-14">
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-80px" }}
                            transition={{ duration: 0.45 }}
                            className="rounded-xl border border-line bg-surface p-5 shadow-xs"
                        >
                            <h3 className="text-[13px] font-semibold text-fg">
                                Donor groups for an {rareGroups[0]?.group ?? "O-"} recipient
                            </h3>
                            <p className="mt-1.5 text-[12px] text-fg-muted">
                                Every group whose red cells can reach this recipient.
                            </p>
                            <div className="mt-4 flex flex-wrap gap-1.5">
                                {CANONICAL_BLOOD_GROUPS.map((group) => {
                                    const isCompatible =
                                        compatibleDonorGroups.includes(group);
                                    return (
                                        <span
                                            key={group}
                                            className={
                                                isCompatible
                                                    ? "opacity-100"
                                                    : "opacity-35 grayscale"
                                            }
                                        >
                                            <BloodGroupBadge group={group} size="sm" />
                                        </span>
                                    );
                                })}
                            </div>
                            <div className="mt-5 rounded-lg border border-line bg-surface-sunken p-3.5">
                                <p className="text-[12px] leading-relaxed text-fg-muted">
                                    The highlighted groups follow the demonstration’s
                                    red-cell compatibility rules. Actual transfusion
                                    decisions require clinical testing and professional
                                    review; this interface cannot confirm a suitable unit.
                                </p>
                            </div>
                        </motion.div>

                        <div>
                            <ol className="space-y-3">
                                {WORKFLOW.map((item, index) => (
                                    <motion.li
                                        key={item.step}
                                        initial={{ opacity: 0, x: 14 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true, margin: "-60px" }}
                                        transition={{ duration: 0.4, delay: index * 0.06 }}
                                        className="flex gap-4 rounded-xl border border-line bg-surface p-4 shadow-xs"
                                    >
                                        <span className="num shrink-0 text-[13px] font-semibold text-brand-text">
                                            {item.step}
                                        </span>
                                        <div>
                                            <h3 className="text-[14px] font-semibold text-fg">
                                                {item.title}
                                            </h3>
                                            <p className="mt-1 text-[13px] leading-relaxed text-fg-muted">
                                                {item.description}
                                            </p>
                                        </div>
                                    </motion.li>
                                ))}
                            </ol>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Forecasting ────────────────────────────────────────── */}
            <section id="forecasting" className="border-b border-line bg-surface">
                <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:py-20">
                    <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-80px" }}
                            transition={{ duration: 0.45 }}
                            className="order-2 lg:order-1"
                        >
                            <h3 className="text-[13px] font-semibold text-fg">
                                Zone forecast register
                            </h3>
                            <p className="mt-1.5 text-[12px] text-fg-muted">
                                {tnPredictionZones.length} district zones, ranked by
                                risk.
                            </p>
                            <ul className="mt-4 space-y-2">
                                {topRiskZones.map((zone) => (
                                    <li
                                        key={zone.district}
                                        className="flex items-center gap-3 rounded-lg border border-line bg-bg px-3.5 py-2.5"
                                    >
                                        <span className="flex-1 text-[13px] font-medium text-fg">
                                            {zone.district}
                                        </span>
                                        <BloodGroupBadge group={zone.topShortage} size="sm" />
                                        <span className="num text-[12px] text-fg-muted">
                                            +{zone.changePercent}%
                                        </span>
                                        <RiskBadge risk={zone.riskLevel} />
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-80px" }}
                            transition={{ duration: 0.45, delay: 0.08 }}
                            className="order-1 lg:order-2"
                        >
                            <p className="label-eyebrow">Demand forecasting</p>
                            <h2 className="mt-3 text-[28px] font-semibold leading-tight tracking-[-0.015em] text-fg sm:text-[34px]">
                                Collect before the shortage forms
                            </h2>
                            <p className="mt-4 text-[15px] leading-relaxed text-fg-muted">
                                Forecasts show projected demand per zone, the
                                percentage change against current levels, and the
                                blood group carrying the pressure. The seasonal
                                driver behind each projection is shown alongside
                                it, so the number is never without a reason.
                            </p>
                            <div className="mt-6 flex flex-wrap gap-2">
                                <Button asChild className="gap-2">
                                    <Link href="/predictions">
                                        <Brain className="h-4 w-4" aria-hidden="true" />
                                        Open predictions
                                    </Link>
                                </Button>
                            </div>
                            <p className="mt-3 text-[11px] leading-relaxed text-fg-subtle">
                                Forecasts are precomputed demonstration values. No
                                machine-learning model runs in this application.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── CTA ────────────────────────────────────────────────── */}
            <section>
                <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:py-20">
                    <div className="overflow-hidden rounded-2xl border border-line bg-surface">
                        <div className="grid grid-cols-1 gap-8 p-8 sm:p-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-center lg:p-12">
                            <div>
                                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-soft text-brand-text">
                                    <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                                </span>
                                <h2 className="mt-4 text-[26px] font-semibold leading-tight tracking-[-0.015em] text-fg sm:text-[32px]">
                                    Register as a donor
                                </h2>
                                <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-fg-muted">
                                    Three steps: your details, how to reach you, and
                                    an eligibility review against the age and weight
                                    thresholds. The form validates as you go.
                                </p>
                                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                                    <Button asChild size="lg" className="gap-2">
                                        <Link href="/register">
                                            <Users className="h-4 w-4" aria-hidden="true" />
                                            Start registration
                                        </Link>
                                    </Button>
                                    <Button asChild size="lg" variant="outline" className="gap-2">
                                        <Link href="/matching">
                                            <Activity className="h-4 w-4" aria-hidden="true" />
                                            Search donors
                                        </Link>
                                    </Button>
                                </div>
                            </div>

                            <dl className="grid grid-cols-1 gap-4 rounded-xl border border-line bg-bg p-5 sm:grid-cols-2 lg:grid-cols-1">
                                {[
                                    {
                                        icon: Building2,
                                        label: "Blood banks in network",
                                        value: stats.bankCount,
                                        note: `${stats.governmentBanks} government · ${stats.privateBanks} private`,
                                    },
                                    {
                                        icon: Bell,
                                        label: "Active alerts",
                                        value: stats.activeAlerts,
                                        note: `${stats.criticalAlerts} at critical urgency`,
                                    },
                                    {
                                        icon: Droplet,
                                        label: "Groups at critical stock",
                                        value: stats.criticalGroups,
                                        note: `of ${CANONICAL_BLOOD_GROUPS.length} blood groups`,
                                    },
                                ].map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <div
                                            key={item.label}
                                            className="flex items-center gap-3 border-b border-line pb-4 last:border-b-0 last:pb-0"
                                        >
                                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-sunken text-fg-muted">
                                                <Icon
                                                    className="h-4 w-4"
                                                    aria-hidden="true"
                                                />
                                            </span>
                                            <div className="min-w-0 flex-1">
                                                <dt className="text-[11px] font-medium uppercase tracking-[0.07em] text-fg-subtle">
                                                    {item.label}
                                                </dt>
                                                <dd className="num mt-0.5 text-[19px] font-semibold leading-none text-fg">
                                                    {formatNumber(item.value)}
                                                </dd>
                                                <dd className="mt-1 text-[11px] text-fg-muted">
                                                    {item.note}
                                                </dd>
                                            </div>
                                        </div>
                                    );
                                })}
                            </dl>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
