"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge, BloodGroupBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { DemoBadge } from "@/components/ui/demo-badge";
import { useToast } from "@/components/ui/toast";
import { BLOOD_GROUP_CODES, codeToGroup } from "@/lib/blood-groups";
import { tnDistricts } from "@/lib/tn-data";
import { cn } from "@/lib/utils";

/** Eligibility thresholds — unchanged from the original implementation. */
const MINIMUM_AGE = 18;
const MINIMUM_WEIGHT = 50;

const STEPS = [
    { id: 1, title: "Personal details", description: "Identity and blood group" },
    { id: 2, title: "Contact & location", description: "How to reach you" },
    { id: 3, title: "Eligibility review", description: "Confirm donation suitability" },
] as const;

interface FormState {
    name: string
    age: string
    bloodGroup: string
    phone: string
    district: string
    location: string
    weight: string
    lastDonation: string
}

const INITIAL_FORM: FormState = {
    name: "",
    age: "",
    bloodGroup: "",
    phone: "",
    district: "",
    location: "",
    weight: "",
    lastDonation: "",
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const districtOptions = tnDistricts.map((d) => ({ label: d, value: d }));

export default function RegisterPage() {
    const { toast } = useToast();
    const [step, setStep] = React.useState(1);
    const [form, setForm] = React.useState<FormState>(INITIAL_FORM);
    const [errors, setErrors] = React.useState<FormErrors>({});
    const [done, setDone] = React.useState(false);

    const update = (key: keyof FormState, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
        setErrors((prev) => ({ ...prev, [key]: undefined }));
    };

    const age = Number(form.age);
    const weight = Number(form.weight);

    const eligibilityIssues = React.useMemo(() => {
        const issues: string[] = [];
        if (form.age && Number.isFinite(age) && age < MINIMUM_AGE) {
            issues.push(`Donors must be at least ${MINIMUM_AGE} years old.`);
        }
        if (form.weight && Number.isFinite(weight) && weight < MINIMUM_WEIGHT) {
            issues.push(`Donors must weigh at least ${MINIMUM_WEIGHT} kg.`);
        }
        return issues;
    }, [form.age, form.weight, age, weight]);

    const validateStep = (target: number): boolean => {
        const next: FormErrors = {};

        if (target >= 1) {
            if (!form.name.trim()) next.name = "Enter your full name.";
            if (!form.age) next.age = "Enter your age.";
            else if (!Number.isFinite(age) || age < 0 || age > 120) {
                next.age = "Enter an age between 0 and 120.";
            }
            if (!form.bloodGroup) next.bloodGroup = "Select your blood group.";
        }

        if (target >= 2) {
            if (!form.phone.trim()) next.phone = "Enter a contact number.";
            else if (form.phone.replace(/\D/g, "").length < 10) {
                next.phone = "Enter a 10-digit contact number.";
            }
            if (!form.district) next.district = "Select your district.";
            if (!form.location.trim()) next.location = "Enter your town or locality.";
        }

        if (target >= 3) {
            if (!form.weight) next.weight = "Enter your weight.";
            else if (!Number.isFinite(weight) || weight <= 0) {
                next.weight = "Enter a valid weight.";
            }
        }

        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const goNext = () => {
        if (!validateStep(step)) return;
        setStep((s) => Math.min(3, s + 1));
    };

    const goBack = () => {
        setErrors({});
        setStep((s) => Math.max(1, s - 1));
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (!validateStep(3)) return;
        if (eligibilityIssues.length > 0) return;
        setDone(true);
    };

    const restart = () => {
        setForm(INITIAL_FORM);
        setErrors({});
        setStep(1);
        setDone(false);
    };

    const group = codeToGroup(form.bloodGroup);

    return (
        <div className="space-y-6">
            <PageHeader
                eyebrow={
                    <>
                        <span>Community</span>
                        <span aria-hidden="true">·</span>
                        <span>Donor enrolment</span>
                    </>
                }
                title="Donor registration"
                description="Enrol in the district donor registry by completing three short steps. Your details stay in this browser session and are never sent to a server."
                actions={<DemoBadge label="Session-only form" />}
            />

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
                <div className="space-y-4">
                    {/* ── Step indicator ───────────────────────────────── */}
                    <nav aria-label="Registration progress">
                        <ol className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                            {STEPS.map((s) => {
                                const isCurrent = s.id === step;
                                const isComplete = s.id < step || done;
                                return (
                                    <li key={s.id}>
                                        <div
                                            aria-current={isCurrent ? "step" : undefined}
                                            className={cn(
                                                "flex items-start gap-2.5 rounded-lg border px-3 py-2.5 transition-colors",
                                                isCurrent
                                                    ? "border-brand-border bg-brand-soft"
                                                    : "border-line bg-surface"
                                            )}
                                        >
                                            <span
                                                className={cn(
                                                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                                                    isComplete
                                                        ? "bg-success-solid text-success-fg"
                                                        : isCurrent
                                                          ? "bg-brand text-brand-fg"
                                                          : "bg-surface-sunken text-fg-subtle"
                                                )}
                                            >
                                                {isComplete ? (
                                                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                                                ) : (
                                                    s.id
                                                )}
                                            </span>
                                            <span className="min-w-0">
                                                <span
                                                    className={cn(
                                                        "block text-[12px] font-semibold leading-tight",
                                                        isCurrent || isComplete
                                                            ? "text-fg"
                                                            : "text-fg-muted"
                                                    )}
                                                >
                                                    {s.title}
                                                </span>
                                                <span className="mt-0.5 block text-[11px] leading-tight text-fg-subtle">
                                                    {s.description}
                                                </span>
                                            </span>
                                        </div>
                                    </li>
                                );
                            })}
                        </ol>
                        <div
                            className="mt-3 h-1 w-full overflow-hidden rounded-full bg-surface-sunken"
                            role="progressbar"
                            aria-valuenow={done ? 3 : step}
                            aria-valuemin={1}
                            aria-valuemax={3}
                            aria-label="Registration progress"
                        >
                            <div
                                className="h-full rounded-full bg-brand transition-[width] duration-300"
                                style={{ width: `${((done ? 3 : step) / 3) * 100}%` }}
                            />
                        </div>
                    </nav>

                    {/* ── Form ──────────────────────────────────────────── */}
                    <Card>
                        <CardContent className="p-5 sm:p-6">
                            <AnimatePresence mode="wait">
                                {done ? (
                                    <motion.div
                                        key="done"
                                        initial={{ opacity: 0, scale: 0.97 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.25 }}
                                        className="flex flex-col items-center py-8 text-center"
                                    >
                                        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-success-soft text-success-text">
                                            <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
                                        </span>
                                        <h2 className="mt-4 text-lg font-semibold text-fg">
                                            Registration complete
                                        </h2>
                                        <p className="mt-2 max-w-md text-[13px] leading-relaxed text-fg-muted">
                                            {form.name} has been recorded as a{" "}
                                            <strong className="text-fg">{group}</strong>{" "}
                                            donor for {form.location}, {form.district}.
                                        </p>
                                        <div className="mt-4 w-full max-w-md rounded-lg border border-warning-border bg-warning-soft p-3.5 text-left">
                                            <p className="text-[12px] font-semibold text-fg">
                                                This is a demonstration only
                                            </p>
                                            <p className="mt-1 text-[12px] leading-relaxed text-fg-muted">
                                                Your details were kept in this browser tab
                                                and are not saved. Reloading the page
                                                clears them, and no donor registry was
                                                updated.
                                            </p>
                                        </div>
                                        <div className="mt-5 flex flex-wrap justify-center gap-2">
                                            <Button onClick={restart} variant="outline">
                                                Register another donor
                                            </Button>
                                            <Button
                                                onClick={() =>
                                                    toast({
                                                        tone: "info",
                                                        title: "No notification was sent",
                                                        description:
                                                            "Donor alerts are simulated in this demonstration.",
                                                    })
                                                }
                                            >
                                                What happens next
                                            </Button>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.form
                                        key={step}
                                        initial={{ opacity: 0, x: 16 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -16 }}
                                        transition={{ duration: 0.22 }}
                                        onSubmit={handleSubmit}
                                        noValidate
                                        className="space-y-5"
                                    >
                                        {step === 1 && (
                                            <>
                                                <div>
                                                    <h2 className="text-[15px] font-semibold text-fg">
                                                        Personal details
                                                    </h2>
                                                    <p className="mt-1 text-[13px] text-fg-muted">
                                                        Used to identify you in the donor
                                                        registry.
                                                    </p>
                                                </div>

                                                <div className="space-y-1.5">
                                                    <Label htmlFor="reg-name" required>
                                                        Full name
                                                    </Label>
                                                    <Input
                                                        id="reg-name"
                                                        value={form.name}
                                                        onChange={(e) => update("name", e.target.value)}
                                                        placeholder="Senthil Kumar R."
                                                        autoComplete="name"
                                                        invalid={Boolean(errors.name)}
                                                        aria-describedby={
                                                            errors.name ? "reg-name-error" : undefined
                                                        }
                                                    />
                                                    {errors.name && (
                                                        <p
                                                            id="reg-name-error"
                                                            className="text-[12px] text-danger-text"
                                                        >
                                                            {errors.name}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                    <div className="space-y-1.5">
                                                        <Label htmlFor="reg-age" required>
                                                            Age
                                                        </Label>
                                                        <Input
                                                            id="reg-age"
                                                            type="number"
                                                            inputMode="numeric"
                                                            min={18}
                                                            max={120}
                                                            value={form.age}
                                                            onChange={(e) => update("age", e.target.value)}
                                                            placeholder="25"
                                                            invalid={Boolean(errors.age)}
                                                            aria-describedby={
                                                                errors.age ? "reg-age-error" : undefined
                                                            }
                                                        />
                                                        {errors.age ? (
                                                            <p
                                                                id="reg-age-error"
                                                                className="text-[12px] text-danger-text"
                                                            >
                                                                {errors.age}
                                                            </p>
                                                        ) : (
                                                            <p className="text-[11px] text-fg-subtle">
                                                        Minimum {MINIMUM_AGE} years.
                                                    </p>
                                                        )}
                                                    </div>

                                                    <div className="space-y-1.5">
                                                        <Label htmlFor="reg-group" required>
                                                            Blood group
                                                        </Label>
                                                        <Select
                                                            id="reg-group"
                                                            value={form.bloodGroup}
                                                            onChange={(e) =>
                                                                update("bloodGroup", e.target.value)
                                                            }
                                                            options={BLOOD_GROUP_CODES.map((g) => ({
                                                                label: g.label,
                                                                value: g.value,
                                                            }))}
                                                            placeholder="Select group"
                                                            invalid={Boolean(errors.bloodGroup)}
                                                            aria-describedby={
                                                                errors.bloodGroup
                                                                    ? "reg-group-error"
                                                                    : undefined
                                                            }
                                                        />
                                                        {errors.bloodGroup && (
                                                            <p
                                                                id="reg-group-error"
                                                                className="text-[12px] text-danger-text"
                                                            >
                                                                {errors.bloodGroup}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        {step === 2 && (
                                            <>
                                                <div>
                                                    <h2 className="text-[15px] font-semibold text-fg">
                                                        Contact &amp; location
                                                    </h2>
                                                    <p className="mt-1 text-[13px] text-fg-muted">
                                                        How the network would reach you for a
                                                        matching donation.
                                                    </p>
                                                </div>

                                                <div className="space-y-1.5">
                                                    <Label htmlFor="reg-phone" required>
                                                        Phone number
                                                    </Label>
                                                    <Input
                                                        id="reg-phone"
                                                        type="tel"
                                                        inputMode="tel"
                                                        value={form.phone}
                                                        onChange={(e) => update("phone", e.target.value)}
                                                        placeholder="94430 00000"
                                                        autoComplete="tel"
                                                        invalid={Boolean(errors.phone)}
                                                        aria-describedby={
                                                            errors.phone ? "reg-phone-error" : undefined
                                                        }
                                                    />
                                                    {errors.phone && (
                                                        <p
                                                            id="reg-phone-error"
                                                            className="text-[12px] text-danger-text"
                                                        >
                                                            {errors.phone}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                    <div className="space-y-1.5">
                                                        <Label htmlFor="reg-district" required>
                                                            District
                                                        </Label>
                                                        <Select
                                                            id="reg-district"
                                                            value={form.district}
                                                            onChange={(e) =>
                                                                update("district", e.target.value)
                                                            }
                                                            options={districtOptions}
                                                            placeholder="Select district"
                                                            invalid={Boolean(errors.district)}
                                                            aria-describedby={
                                                                errors.district
                                                                    ? "reg-district-error"
                                                                    : undefined
                                                            }
                                                        />
                                                        {errors.district && (
                                                            <p
                                                                id="reg-district-error"
                                                                className="text-[12px] text-danger-text"
                                                            >
                                                                {errors.district}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="space-y-1.5">
                                                        <Label htmlFor="reg-location" required>
                                                            Town or locality
                                                        </Label>
                                                        <Input
                                                            id="reg-location"
                                                            value={form.location}
                                                            onChange={(e) =>
                                                                update("location", e.target.value)
                                                            }
                                                            placeholder="Namakkal"
                                                            invalid={Boolean(errors.location)}
                                                            aria-describedby={
                                                                errors.location
                                                                    ? "reg-location-error"
                                                                    : undefined
                                                            }
                                                        />
                                                        {errors.location && (
                                                            <p
                                                                id="reg-location-error"
                                                                className="text-[12px] text-danger-text"
                                                            >
                                                                {errors.location}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        {step === 3 && (
                                            <>
                                                <div>
                                                    <h2 className="text-[15px] font-semibold text-fg">
                                                        Eligibility review
                                                    </h2>
                                                    <p className="mt-1 text-[13px] text-fg-muted">
                                                        Confirm your donation suitability and
                                                        review what you have entered.
                                                    </p>
                                                </div>

                                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                    <div className="space-y-1.5">
                                                        <Label htmlFor="reg-weight" required>
                                                            Weight (kg)
                                                        </Label>
                                                        <Input
                                                            id="reg-weight"
                                                            type="number"
                                                            inputMode="numeric"
                                                            min={30}
                                                            max={200}
                                                            value={form.weight}
                                                            onChange={(e) =>
                                                                update("weight", e.target.value)
                                                            }
                                                            placeholder="65"
                                                            invalid={Boolean(errors.weight)}
                                                            aria-describedby={
                                                                errors.weight
                                                                    ? "reg-weight-error"
                                                                    : undefined
                                                            }
                                                        />
                                                        {errors.weight ? (
                                                            <p
                                                                id="reg-weight-error"
                                                                className="text-[12px] text-danger-text"
                                                            >
                                                                {errors.weight}
                                                            </p>
                                                        ) : (
                                                            <p className="text-[11px] text-fg-subtle">
                                                                Minimum {MINIMUM_WEIGHT} kg.
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="space-y-1.5">
                                                        <Label htmlFor="reg-last">
                                                            Last donation date
                                                        </Label>
                                                        <Input
                                                            id="reg-last"
                                                            type="date"
                                                            value={form.lastDonation}
                                                            onChange={(e) =>
                                                                update("lastDonation", e.target.value)
                                                            }
                                                        />
                                                        <p className="text-[11px] text-fg-subtle">
                                                            Optional.
                                                        </p>
                                                    </div>
                                                </div>

                                                {eligibilityIssues.length > 0 && (
                                                    <div
                                                        role="alert"
                                                        className="rounded-lg border border-danger-border bg-danger-soft p-3.5"
                                                    >
                                                        <p className="text-[12px] font-semibold text-danger-text">
                                                            Eligibility check failed
                                                        </p>
                                                        <ul className="mt-1.5 space-y-1">
                                                            {eligibilityIssues.map((issue) => (
                                                                <li
                                                                    key={issue}
                                                                    className="text-[12px] leading-relaxed text-fg-muted"
                                                                >
                                                                    {issue}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}

                                                <div className="rounded-lg border border-line bg-surface-sunken p-4">
                                                    <p className="text-[12px] font-semibold text-fg">
                                                        Your entry
                                                    </p>
                                                    <dl className="mt-2.5 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
                                                        <SummaryRow label="Name" value={form.name} />
                                                        <SummaryRow
                                                            label="Age"
                                                            value={
                                                                form.age
                                                                    ? `${form.age} years`
                                                                    : "—"
                                                            }
                                                        />
                                                        <SummaryRow
                                                            label="Blood group"
                                                            value={group || "—"}
                                                            badge={group ? group : undefined}
                                                        />
                                                        <SummaryRow label="Phone" value={form.phone} />
                                                        <SummaryRow
                                                            label="District"
                                                            value={form.district || "—"}
                                                        />
                                                        <SummaryRow
                                                            label="Location"
                                                            value={form.location || "—"}
                                                        />
                                                        <SummaryRow
                                                            label="Weight"
                                                            value={
                                                                form.weight
                                                                    ? `${form.weight} kg`
                                                                    : "—"
                                                            }
                                                        />
                                                        <SummaryRow
                                                            label="Last donation"
                                                            value={form.lastDonation || "Not provided"}
                                                        />
                                                    </dl>
                                                </div>
                                            </>
                                        )}

                                        {/* ── Navigation ────────────────────────────── */}
                                        <div className="flex items-center justify-between gap-3 border-t border-line pt-5">
                                            {step > 1 ? (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    onClick={goBack}
                                                    className="gap-1.5"
                                                >
                                                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                                                    Back
                                                </Button>
                                            ) : (
                                                <span />
                                            )}

                                            {step < 3 ? (
                                                <Button
                                                    type="button"
                                                    onClick={goNext}
                                                    className="gap-1.5"
                                                >
                                                    Continue
                                                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                                                </Button>
                                            ) : (
                                                <Button
                                                    type="submit"
                                                    className="gap-1.5"
                                                    disabled={eligibilityIssues.length > 0}
                                                >
                                                    <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                                                    Complete registration
                                                </Button>
                                            )}
                                        </div>
                                    </motion.form>
                                )}
                            </AnimatePresence>
                        </CardContent>
                    </Card>
                </div>

                {/* ── Sidebar ──────────────────────────────────────────── */}
                <aside className="space-y-4">
                    <Card>
                        <CardContent className="p-5">
                            <h2 className="text-[13px] font-semibold text-fg">
                                Eligibility criteria
                            </h2>
                            <ul className="mt-3 space-y-2.5">
                                {[
                                    `Age ${MINIMUM_AGE} years or above`,
                                    `Weight ${MINIMUM_WEIGHT} kg or above`,
                                    "Healthy on the day of donation",
                                    "No donation in the preceding three months",
                                ].map((criterion) => (
                                    <li
                                        key={criterion}
                                        className="flex items-start gap-2 text-[12px] leading-relaxed text-fg-muted"
                                    >
                                        <Check
                                            className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success-text"
                                            aria-hidden="true"
                                        />
                                        {criterion}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    <Card className="border-warning-border">
                        <CardContent className="p-5">
                            <h2 className="text-[13px] font-semibold text-fg">
                                Demonstration disclosure
                            </h2>
                            <p className="mt-2 text-[12px] leading-relaxed text-fg-muted">
                                This form has no backend. Nothing you type is transmitted,
                                stored or added to a donor registry — the values live in
                                this browser tab only and are cleared when you reload.
                            </p>
                            <div className="mt-3">
                                <Badge tone="warning" dot>
                                    Session-only
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                </aside>
            </div>
        </div>
    );
}

function SummaryRow({
    label,
    value,
    badge,
}: {
    label: string
    value: string
    badge?: string
}) {
    return (
        <div className="flex items-center justify-between gap-3 border-b border-line pb-2 last:border-b-0">
            <dt className="text-[11px] font-medium text-fg-subtle">{label}</dt>
            <dd className="flex items-center gap-2 text-right text-[12px] font-medium text-fg">
                {badge && <BloodGroupBadge group={badge} size="sm" />}
                {value}
            </dd>
        </div>
    );
}
