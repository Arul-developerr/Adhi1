"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Check,
    CheckCircle2,
    MapPin,
    RotateCcw,
    Search,
    Star,
    Siren,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge, BloodGroupBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { DemoBadge } from "@/components/ui/demo-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { useToast } from "@/components/ui/toast";
import { getCompatibleDonors, tnHospitals } from "@/lib/tn-data";
import { BLOOD_GROUP_CODES, codeToGroup } from "@/lib/blood-groups";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

type RequestStatus = "idle" | "searching" | "found";

const urgencyOptions = [
    { label: "Standard — within 24 hours", value: "standard" },
    { label: "High — within 6 hours", value: "high" },
    { label: "Critical — immediate", value: "critical" },
];

const hospitalOptions = tnHospitals.map((h) => ({
    label: `${h.name} — ${h.city}`,
    value: h.id,
}));

interface FormState {
    hospitalId: string
    units: string
    bloodGroup: string
    urgency: string
    ward: string
    notes: string
}

const INITIAL_FORM: FormState = {
    hospitalId: "",
    units: "2",
    bloodGroup: "",
    urgency: "standard",
    ward: "",
    notes: "",
};

export default function RequestPage() {
    const { toast } = useToast();
    const [form, setForm] = React.useState<FormState>(INITIAL_FORM);
    const [status, setStatus] = React.useState<RequestStatus>("idle");
    const [progress, setProgress] = React.useState(0);
    const [notified, setNotified] = React.useState<string[]>([]);
    const [errors, setErrors] = React.useState<Partial<Record<keyof FormState, string>>>({});

    const requiredGroup = codeToGroup(form.bloodGroup);

    const matches = React.useMemo(
        () => (requiredGroup ? getCompatibleDonors(requiredGroup) : []),
        [requiredGroup]
    );

    const validate = (): boolean => {
        const next: Partial<Record<keyof FormState, string>> = {};
        if (!form.hospitalId) next.hospitalId = "Select the requesting hospital.";
        if (!form.bloodGroup) next.bloodGroup = "Select the required blood group.";
        if (!form.ward.trim()) next.ward = "Add the ward or collection point.";
        const units = Number(form.units);
        if (!Number.isFinite(units) || units < 1) {
            next.units = "Units must be at least 1.";
        } else if (units > 10) {
            next.units = "Units must be 10 or fewer per request.";
        }
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (!validate()) return;

        setStatus("searching");
        setProgress(0);
        setNotified([]);

        const started = Date.now();
        const timer = window.setInterval(() => {
            const elapsed = Date.now() - started;
            const next = Math.min(100, Math.round((elapsed / 2400) * 100));
            setProgress(next);
            if (next >= 100) window.clearInterval(timer);
        }, 60);

        window.setTimeout(() => {
            setProgress(100);
            setStatus("found");
            window.clearInterval(timer);
        }, 2400);
    };

    const reset = () => {
        setStatus("idle");
        setProgress(0);
        setForm(INITIAL_FORM);
        setNotified([]);
        setErrors({});
    };

    const notifyDonor = (id: string, name: string) => {
        setNotified((prev) => [...prev, id]);
        toast({
            tone: "success",
            title: `Simulated alert to ${name}`,
            description:
                "Demonstration only — no call, SMS or message was placed to a real donor.",
        });
    };

    const isUrgent = form.urgency === "critical";

    return (
        <div className="space-y-6">
            <PageHeader
                eyebrow={
                    <>
                        <span>Blood operations</span>
                        <span aria-hidden="true">·</span>
                        <span>Emergency request</span>
                    </>
                }
                title="Request blood"
                description="Raise a blood requirement for a receiving facility and search the donor registry for compatible, available donors."
                actions={<DemoBadge label="Demonstration workflow" />}
            />

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {/* ── Form ──────────────────────────────────────────── */}
                <Card className={cn(isUrgent && "border-danger-border")}>
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2.5">
                                <span
                                    className={cn(
                                        "flex h-8 w-8 items-center justify-center rounded-lg",
                                        isUrgent
                                            ? "bg-danger-soft text-danger-text"
                                            : "bg-brand-soft text-brand-text"
                                    )}
                                >
                                    <Siren className="h-4 w-4" aria-hidden="true" />
                                </span>
                                <div>
                                    <CardTitle>Request details</CardTitle>
                                    <p className="mt-0.5 text-[12px] text-fg-muted">
                                        Fields marked with an asterisk are required.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} noValidate className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="req-hospital" required>
                                    Requesting hospital
                                </Label>
                                <Select
                                    id="req-hospital"
                                    value={form.hospitalId}
                                    onChange={(e) => {
                                        setForm((f) => ({ ...f, hospitalId: e.target.value }));
                                        setErrors((e) => ({ ...e, hospitalId: undefined }));
                                    }}
                                    options={hospitalOptions}
                                    placeholder="Select a facility"
                                    invalid={Boolean(errors.hospitalId)}
                                    aria-describedby={
                                        errors.hospitalId ? "req-hospital-error" : undefined
                                    }
                                />
                                {errors.hospitalId && (
                                    <p id="req-hospital-error" className="text-[12px] text-danger-text">
                                        {errors.hospitalId}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                    <Label htmlFor="req-group" required>
                                        Blood group
                                    </Label>
                                    <Select
                                        id="req-group"
                                        value={form.bloodGroup}
                                        onChange={(e) => {
                                            setForm((f) => ({ ...f, bloodGroup: e.target.value }));
                                            setErrors((e) => ({ ...e, bloodGroup: undefined }));
                                        }}
                                        options={BLOOD_GROUP_CODES.map((g) => ({
                                            label: g.label,
                                            value: g.value,
                                        }))}
                                        placeholder="Select group"
                                        invalid={Boolean(errors.bloodGroup)}
                                        aria-describedby={
                                            errors.bloodGroup ? "req-group-error" : undefined
                                        }
                                    />
                                    {errors.bloodGroup && (
                                        <p id="req-group-error" className="text-[12px] text-danger-text">
                                            {errors.bloodGroup}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="req-units" required>
                                        Units required
                                    </Label>
                                    <Input
                                        id="req-units"
                                        type="number"
                                        min={1}
                                        max={10}
                                        inputMode="numeric"
                                        value={form.units}
                                        onChange={(e) => {
                                            setForm((f) => ({ ...f, units: e.target.value }));
                                            setErrors((e) => ({ ...e, units: undefined }));
                                        }}
                                        invalid={Boolean(errors.units)}
                                        aria-describedby={
                                            errors.units ? "req-units-error" : undefined
                                        }
                                    />
                                    {errors.units && (
                                        <p id="req-units-error" className="text-[12px] text-danger-text">
                                            {errors.units}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="req-ward" required>
                                    Ward or collection point
                                </Label>
                                <Input
                                    id="req-ward"
                                    value={form.ward}
                                    onChange={(e) => {
                                        setForm((f) => ({ ...f, ward: e.target.value }));
                                        setErrors((e) => ({ ...e, ward: undefined }));
                                    }}
                                    placeholder="e.g. ICU, Ward 3, Block A"
                                    invalid={Boolean(errors.ward)}
                                    aria-describedby={errors.ward ? "req-ward-error" : undefined}
                                />
                                {errors.ward && (
                                    <p id="req-ward-error" className="text-[12px] text-danger-text">
                                        {errors.ward}
                                    </p>
                                )}
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
                                                    name="urgency"
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
                                <Label htmlFor="req-notes">Notes for the blood bank</Label>
                                <Input
                                    id="req-notes"
                                    value={form.notes}
                                    onChange={(e) =>
                                        setForm((f) => ({ ...f, notes: e.target.value }))
                                    }
                                    placeholder="Optional clinical context"
                                />
                            </div>

                            <Button
                                type="submit"
                                size="lg"
                                disabled={status === "searching"}
                                variant={isUrgent ? "danger" : "primary"}
                                className="w-full gap-2"
                            >
                                {status === "searching" ? (
                                    <>
                                        <Search className="h-4 w-4" aria-hidden="true" />
                                        Searching registry…
                                    </>
                                ) : (
                                    <>
                                        <Search className="h-4 w-4" aria-hidden="true" />
                                        Search compatible donors
                                    </>
                                )}
                            </Button>

                            <p className="text-[11px] leading-relaxed text-fg-subtle">
                                This request is not transmitted to any hospital, donor
                                or messaging service. It runs entirely in your browser
                                against the seeded registry.
                            </p>
                        </form>
                    </CardContent>
                </Card>

                {/* ── Results ───────────────────────────────────────── */}
                <div>
                    <AnimatePresence mode="wait">
                        {status === "idle" && (
                            <motion.div
                                key="idle"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <EmptyState
                                    icon={Search}
                                    title="Awaiting request details"
                                    description="Complete the form to search the seeded donor registry for compatible, available donors."
                                    className="min-h-[420px]"
                                />
                            </motion.div>
                        )}

                        {status === "searching" && (
                            <motion.div
                                key="searching"
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.2 }}
                                className="relative overflow-hidden rounded-xl border border-line bg-surface"
                            >
                                <div className="relative flex min-h-[420px] flex-col items-center justify-center gap-3 px-6 py-16 text-center">
                                    <div
                                        className="pointer-events-none absolute inset-x-0 top-0 h-24 scan-sweep bg-gradient-to-b from-transparent via-brand/10 to-transparent"
                                        aria-hidden="true"
                                    />
                                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-soft text-brand-text">
                                        <Search className="h-5 w-5" aria-hidden="true" />
                                    </span>
                                    <div>
                                        <h2 className="text-sm font-semibold text-fg">
                                            Searching the donor registry
                                        </h2>
                                        <p className="mt-1 text-[12px] text-fg-muted">
                                            Filtering available donors compatible with{" "}
                                            {requiredGroup}.
                                        </p>
                                    </div>
                                    <div className="mt-1 h-1.5 w-48 overflow-hidden rounded-full bg-surface-sunken">
                                        <div
                                            className="h-full rounded-full bg-brand transition-[width] duration-100"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                    <p className="text-[11px] text-fg-subtle">
                                        Local simulation — no donor is contacted.
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {status === "found" && (
                            <motion.div
                                key="found"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.25 }}
                                className="space-y-3"
                            >
                                <div
                                    className={cn(
                                        "rounded-xl border px-4 py-3",
                                        isUrgent
                                            ? "border-danger-border bg-danger-soft"
                                            : "border-success-border bg-success-soft"
                                    )}
                                >
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <div className="flex items-start gap-2.5">
                                            <CheckCircle2
                                                className={cn(
                                                    "mt-0.5 h-4 w-4 shrink-0",
                                                    isUrgent
                                                        ? "text-danger-text"
                                                        : "text-success-text"
                                                )}
                                                aria-hidden="true"
                                            />
                                            <div>
                                                <h2 className="text-sm font-semibold text-fg">
                                                    {matches.length} compatible donor
                                                    {matches.length === 1 ? "" : "s"} for{" "}
                                                    {requiredGroup}
                                                </h2>
                                                <p className="mt-0.5 text-[12px] text-fg-muted">
                                                    {form.units} unit
                                                    {form.units === "1" ? "" : "s"} requested
                                                    · {" "}
                                                    {form.urgency === "critical"
                                                        ? "Critical"
                                                        : form.urgency === "high"
                                                          ? "High"
                                                          : "Standard"}{" "}
                                                    urgency
                                                </p>
                                            </div>
                                        </div>
                                        <Badge tone={isUrgent ? "danger" : "success"} dot>
                                            Search complete
                                        </Badge>
                                    </div>
                                </div>

                                {matches.length === 0 ? (
                                    <EmptyState
                                        icon={Search}
                                        title="No compatible donors available"
                                        description={`No donor currently marked available can donate to ${requiredGroup}. Escalate this request to the alert centre instead.`}
                                    />
                                ) : (
                                    <ul className="space-y-2.5">
                                        {matches.map((donor, index) => {
                                            const isNotified = notified.includes(donor.id);
                                            return (
                                                <motion.li
                                                    key={donor.id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{
                                                        delay: index * 0.05,
                                                        duration: 0.25,
                                                    }}
                                                    className="rounded-xl border border-line bg-surface p-4 shadow-xs transition-[border-color,box-shadow] duration-200 hover:border-line-strong hover:shadow-sm"
                                                >
                                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                                        <div className="min-w-0 flex-1">
                                                            <div className="flex flex-wrap items-center gap-2">
                                                                <h3 className="text-[14px] font-semibold text-fg">
                                                                    {donor.name}
                                                                </h3>
                                                                <BloodGroupBadge
                                                                    group={donor.bloodGroup}
                                                                    size="sm"
                                                                />
                                                                <Badge tone="success" dot>
                                                                    Available
                                                                </Badge>
                                                            </div>
                                                            <dl className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-fg-muted">
                                                                <div className="flex items-center gap-1.5">
                                                                    <dt className="sr-only">Location</dt>
                                                                    <MapPin
                                                                        className="h-3.5 w-3.5"
                                                                        aria-hidden="true"
                                                                    />
                                                                    <dd>
                                                                        {donor.city}
                                                                        {donor.distance
                                                                            ? ` · ${donor.distance}`
                                                                            : ""}
                                                                    </dd>
                                                                </div>
                                                                {donor.eta && (
                                                                    <div className="flex items-center gap-1.5">
                                                                        <dt className="sr-only">
                                                                            Estimated travel time
                                                                        </dt>
                                                                        <dd>ETA {donor.eta}</dd>
                                                                    </div>
                                                                )}
                                                                <div className="flex items-center gap-1.5">
                                                                    <dt className="sr-only">Rating</dt>
                                                                    <Star
                                                                        className="h-3.5 w-3.5 fill-warning-text text-warning-text"
                                                                        aria-hidden="true"
                                                                    />
                                                                    <dd className="num">{donor.rating}</dd>
                                                                </div>
                                                                <div className="flex items-center gap-1.5">
                                                                    <dt className="sr-only">Last donation</dt>
                                                                    <dd>
                                                                        Last donation{" "}
                                                                        {formatDate(donor.lastDonation)}
                                                                    </dd>
                                                                </div>
                                                            </dl>
                                                        </div>

                                                        <Button
                                                            size="sm"
                                                            variant={isNotified ? "secondary" : "outline"}
                                                            onClick={() =>
                                                                notifyDonor(donor.id, donor.name)
                                                            }
                                                            disabled={isNotified}
                                                            className="shrink-0 gap-1.5"
                                                        >
                                                            {isNotified ? (
                                                                <>
                                                                    <Check
                                                                        className="h-3.5 w-3.5"
                                                                        aria-hidden="true"
                                                                    />
                                                                    Notified
                                                                </>
                                                            ) : (
                                                                "Notify donor"
                                                            )}
                                                        </Button>
                                                    </div>
                                                </motion.li>
                                            );
                                        })}
                                    </ul>
                                )}

                                <Button variant="outline" onClick={reset} className="w-full gap-1.5">
                                    <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                                    Start a new request
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
