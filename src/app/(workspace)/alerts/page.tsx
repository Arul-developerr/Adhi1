"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
    AlertTriangle,
    Bell,
    CheckCircle2,
    Clock,
    MapPin,
    Send,
    TriangleAlert,
    X,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KpiCard } from "@/components/ui/kpi-card";
import {
    AlertStatusBadge,
    AlertTypeBadge,
    Badge,
    BloodGroupBadge,
    UrgencyBadge,
} from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { DemoBadge } from "@/components/ui/demo-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { useToast } from "@/components/ui/toast";
import {
    ALERT_TYPE_LABEL,
    URGENCY_LABEL,
} from "@/lib/operations";
import { tnAlerts, tnHospitals, type EmergencyAlert } from "@/lib/tn-data";
import { CANONICAL_BLOOD_GROUPS } from "@/lib/blood-groups";
import { cn } from "@/lib/utils";

const urgencyOptions = [
    { label: "Standard", value: "standard" },
    { label: "High", value: "high" },
    { label: "Critical — life threatening", value: "critical" },
];

const groupOptions = CANONICAL_BLOOD_GROUPS.map((g) => ({ label: g, value: g }));

const hospitalOptions = tnHospitals.map((h) => ({
    label: `${h.name} — ${h.city}`,
    value: h.id,
}));

const TYPE_ICON = {
    critical_shortage: AlertTriangle,
    emergency_request: Bell,
    expiry_warning: Clock,
    donor_match: CheckCircle2,
} as const;

export default function AlertsPage() {
    const { toast } = useToast();
    const [alerts, setAlerts] = React.useState<EmergencyAlert[]>(tnAlerts);
    const [showForm, setShowForm] = React.useState(false);
    const [confirmId, setConfirmId] = React.useState<string | null>(null);
    const [filter, setFilter] = React.useState<"all" | EmergencyAlert["status"]>("all");
    const [form, setForm] = React.useState({
        hospitalId: "",
        bloodGroup: "",
        urgency: "standard",
        message: "",
    });
    const [formError, setFormError] = React.useState<string | null>(null);

    const counts = React.useMemo(
        () => ({
            critical: alerts.filter((a) => a.urgency === "critical" && a.status !== "resolved").length,
            active: alerts.filter((a) => a.status === "active").length,
            pending: alerts.filter((a) => a.status === "pending").length,
            resolved: alerts.filter((a) => a.status === "resolved").length,
        }),
        [alerts]
    );

    const visibleAlerts = React.useMemo(
        () => (filter === "all" ? alerts : alerts.filter((a) => a.status === filter)),
        [alerts, filter]
    );

    const statusFilters: Array<{ label: string; value: "all" | EmergencyAlert["status"] }> = [
        { label: "All", value: "all" },
        { label: "Active", value: "active" },
        { label: "Pending", value: "pending" },
        { label: "Resolved", value: "resolved" },
    ];

    const submitBroadcast = (event: React.FormEvent) => {
        event.preventDefault();

        const hospital = tnHospitals.find((h) => h.id === form.hospitalId);
        if (!hospital || !form.bloodGroup || !form.message.trim()) {
            setFormError(
                "Select a hospital, a blood group, and enter a message before broadcasting."
            );
            return;
        }
        setFormError(null);

        const newAlert: EmergencyAlert = {
            id: `ALT-USR-${Date.now()}`,
            type: form.urgency === "critical" ? "emergency_request" : "critical_shortage",
            hospitalId: hospital.id,
            hospitalName: `${hospital.name}, ${hospital.city}`,
            bloodGroup: form.bloodGroup,
            message: form.message.trim(),
            urgency: form.urgency as EmergencyAlert["urgency"],
            timestamp: "Just now",
            status: "active",
            district: hospital.district,
        };

        setAlerts((prev) => [newAlert, ...prev]);
        setForm({ hospitalId: "", bloodGroup: "", urgency: "standard", message: "" });
        setShowForm(false);
        setFilter("all");

        toast({
            tone: "success",
            title: "Alert recorded for the district feed",
            description:
                "Demonstration only — no SMS, email or push notification was delivered to any hospital or donor.",
        });
    };

    const resolveAlert = (id: string) => {
        const target = alerts.find((a) => a.id === id);
        setAlerts((prev) =>
            prev.map((a) => (a.id === id ? { ...a, status: "resolved" } : a))
        );
        setConfirmId(null);
        toast({
            tone: "success",
            title: "Alert marked as resolved",
            description: target
                ? `${target.hospitalName} · ${target.bloodGroup}`
                : undefined,
        });
    };

    return (
        <div className="space-y-6">
            <PageHeader
                eyebrow={
                    <>
                        <span>Blood operations</span>
                        <span aria-hidden="true">·</span>
                        <span>Incident management</span>
                    </>
                }
                title="Emergency alerts"
                description="Record, track and resolve district blood-shortage incidents and emergency requests raised through the network."
                actions={
                    <>
                        <DemoBadge label="Local alert feed" />
                        <Button
                            onClick={() => setShowForm((v) => !v)}
                            variant={showForm ? "outline" : "primary"}
                            className="gap-1.5"
                        >
                            {showForm ? (
                                <>
                                    <X className="h-4 w-4" aria-hidden="true" />
                                    Cancel
                                </>
                            ) : (
                                <>
                                    <Send className="h-4 w-4" aria-hidden="true" />
                                    Broadcast alert
                                </>
                            )}
                        </Button>
                    </>
                }
            />

            {/* ── Summary ──────────────────────────────────────────── */}
            <section aria-label="Alert summary">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <KpiCard
                        label="Critical urgency"
                        value={counts.critical}
                        hint="Unresolved and marked critical"
                        icon={TriangleAlert}
                        tone="danger"
                    />
                    <KpiCard
                        label="Active"
                        value={counts.active}
                        hint="Awaiting resolution"
                        icon={Bell}
                        tone="brand"
                    />
                    <KpiCard
                        label="Pending"
                        value={counts.pending}
                        hint="Acknowledged, not yet closed"
                        icon={Clock}
                        tone="warning"
                    />
                    <KpiCard
                        label="Resolved"
                        value={counts.resolved}
                        hint="Closed in this session"
                        icon={CheckCircle2}
                        tone="success"
                    />
                </div>
            </section>

            {/* ── Broadcast form ───────────────────────────────────── */}
            <AnimatePresence initial={false}>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="overflow-hidden"
                    >
                        <Card className="border-brand-border">
                            <CardHeader className="pb-4">
                                <div className="flex items-center gap-2.5">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-soft text-brand-text">
                                        <Send className="h-4 w-4" aria-hidden="true" />
                                    </span>
                                    <div>
                                        <CardTitle>Broadcast a district alert</CardTitle>
                                        <p className="mt-0.5 text-[12px] text-fg-muted">
                                            Adds an incident to the local feed for this
                                            session only.
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={submitBroadcast} noValidate className="space-y-4">
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="alert-hospital" required>
                                                Hospital
                                            </Label>
                                            <Select
                                                id="alert-hospital"
                                                value={form.hospitalId}
                                                onChange={(e) =>
                                                    setForm((f) => ({
                                                        ...f,
                                                        hospitalId: e.target.value,
                                                    }))
                                                }
                                                options={hospitalOptions}
                                                placeholder="Select hospital"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label htmlFor="alert-group" required>
                                                Blood group
                                            </Label>
                                            <Select
                                                id="alert-group"
                                                value={form.bloodGroup}
                                                onChange={(e) =>
                                                    setForm((f) => ({
                                                        ...f,
                                                        bloodGroup: e.target.value,
                                                    }))
                                                }
                                                options={groupOptions}
                                                placeholder="Select group"
                                            />
                                        </div>
                                    </div>

                                    <fieldset className="space-y-1.5">
                                        <legend className="text-[13px] font-medium text-fg">
                                            Urgency
                                        </legend>
                                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                                            {urgencyOptions.map((option) => {
                                                const selected = form.urgency === option.value;
                                                return (
                                                    <label
                                                        key={option.value}
                                                        className={cn(
                                                            "flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2.5 transition-colors",
                                                            selected
                                                                ? option.value === "critical"
                                                                    ? "border-danger-border bg-danger-soft"
                                                                    : "border-brand-border bg-brand-soft"
                                                                : "border-line bg-surface hover:bg-surface-hover"
                                                        )}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="alert-urgency"
                                                            value={option.value}
                                                            checked={selected}
                                                            onChange={(e) =>
                                                                setForm((f) => ({
                                                                    ...f,
                                                                    urgency: e.target.value,
                                                                }))
                                                            }
                                                            className="h-3.5 w-3.5 accent-[var(--brand)]"
                                                        />
                                                        <span className="text-[12px] font-medium leading-snug text-fg">
                                                            {option.label.split(" — ")[0]}
                                                        </span>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </fieldset>

                                    <div className="space-y-1.5">
                                        <Label htmlFor="alert-message" required>
                                            Alert message
                                        </Label>
                                        <Input
                                            id="alert-message"
                                            value={form.message}
                                            onChange={(e) =>
                                                setForm((f) => ({
                                                    ...f,
                                                    message: e.target.value,
                                                }))
                                            }
                                            placeholder="Describe the shortage or requirement…"
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") e.currentTarget.form?.requestSubmit();
                                            }}
                                        />
                                    </div>

                                    {formError && (
                                        <p
                                            role="alert"
                                            className="rounded-lg border border-danger-border bg-danger-soft px-3 py-2 text-[12px] text-danger-text"
                                        >
                                            {formError}
                                        </p>
                                    )}

                                    <div className="flex flex-col gap-2 sm:flex-row-reverse sm:items-center sm:justify-between">
                                        <Button type="submit" className="gap-1.5">
                                            <Send className="h-4 w-4" aria-hidden="true" />
                                            Add to alert feed
                                        </Button>
                                        <p className="text-[11px] leading-relaxed text-fg-subtle sm:max-w-sm">
                                            Nothing is transmitted externally. The alert is
                                            stored in browser memory and clears on
                                            reload.
                                        </p>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Feed ─────────────────────────────────────────────── */}
            <section aria-label="Alert feed">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-sm font-semibold tracking-tight text-fg">
                        Alert feed
                        <span className="ml-2 text-[12px] font-normal text-fg-muted">
                            {visibleAlerts.length} record
                            {visibleAlerts.length === 1 ? "" : "s"}
                        </span>
                    </h2>
                    <div
                        className="inline-flex rounded-lg border border-line bg-surface p-0.5"
                        role="tablist"
                        aria-label="Filter alerts by status"
                    >
                        {statusFilters.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                role="tab"
                                aria-selected={filter === option.value}
                                onClick={() => setFilter(option.value)}
                                className={cn(
                                    "rounded-md px-2.5 py-1 text-[12px] font-medium transition-colors",
                                    filter === option.value
                                        ? "bg-surface-sunken text-fg"
                                        : "text-fg-muted hover:text-fg"
                                )}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>

                {visibleAlerts.length === 0 ? (
                    <EmptyState
                        icon={Bell}
                        title="No alerts in this view"
                        description="Try a different status filter, or broadcast a new alert to add one to the feed."
                        action={
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowForm(true)}
                                className="gap-1.5"
                            >
                                <Send className="h-3.5 w-3.5" aria-hidden="true" />
                                Broadcast alert
                            </Button>
                        }
                    />
                ) : (
                    <ul className="space-y-2.5">
                        <AnimatePresence initial={false}>
                            {visibleAlerts.map((alert) => {
                                const Icon = TYPE_ICON[alert.type];
                                const isCritical =
                                    alert.urgency === "critical" && alert.status !== "resolved";

                                return (
                                    <motion.li
                                        key={alert.id}
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                        transition={{ duration: 0.22 }}
                                        className={cn(
                                            "rounded-xl border bg-surface p-4 shadow-xs transition-colors",
                                            isCritical
                                                ? "border-danger-border"
                                                : "border-line"
                                        )}
                                    >
                                        <div className="flex flex-wrap items-start gap-3">
                                            <span
                                                className={cn(
                                                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                                                    isCritical
                                                        ? "bg-danger-soft text-danger-text"
                                                        : alert.status === "resolved"
                                                          ? "bg-success-soft text-success-text"
                                                          : "bg-surface-sunken text-fg-muted"
                                                )}
                                            >
                                                <Icon className="h-4 w-4" aria-hidden="true" />
                                            </span>

                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h3 className="text-[13px] font-semibold text-fg">
                                                        {alert.hospitalName}
                                                    </h3>
                                                    <BloodGroupBadge
                                                        group={alert.bloodGroup}
                                                        size="sm"
                                                    />
                                                    <UrgencyBadge urgency={alert.urgency} />
                                                    <AlertStatusBadge status={alert.status} />
                                                </div>

                                                <p className="mt-1.5 text-[13px] leading-relaxed text-fg-muted">
                                                    {alert.message}
                                                </p>

                                                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-fg-subtle">
                                                    <span className="flex items-center gap-1.5">
                                                        <Clock className="h-3 w-3" aria-hidden="true" />
                                                        {alert.timestamp}
                                                    </span>
                                                    <span className="flex items-center gap-1.5">
                                                        <MapPin className="h-3 w-3" aria-hidden="true" />
                                                        {alert.district}
                                                    </span>
                                                    <span>{ALERT_TYPE_LABEL[alert.type]}</span>
                                                    <span className="font-mono">{alert.id}</span>
                                                </div>
                                            </div>

                                            <div className="shrink-0">
                                                {alert.status === "resolved" ? (
                                                    <Badge tone="success" dot>
                                                        Closed
                                                    </Badge>
                                                ) : confirmId === alert.id ? (
                                                    <div className="flex items-center gap-1.5">
                                                        <Button
                                                            size="sm"
                                                            variant="danger"
                                                            onClick={() => resolveAlert(alert.id)}
                                                        >
                                                            Confirm
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => setConfirmId(null)}
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => setConfirmId(alert.id)}
                                                    >
                                                        Resolve
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </motion.li>
                                );
                            })}
                        </AnimatePresence>
                    </ul>
                )}
            </section>

            <p className="text-[11px] leading-relaxed text-fg-subtle">
                Alerts are generated from seeded records and local form submissions.
                The application sends no SMS, email or push notifications, and
                resolving an alert changes only the in-session feed.
            </p>
        </div>
    );
}
