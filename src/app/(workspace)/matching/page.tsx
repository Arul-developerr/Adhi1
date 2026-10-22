"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Activity,
    Check,
    MapPin,
    RotateCcw,
    Search,
    Star,
    Users,
    X,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge, BloodGroupBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { DemoBadge } from "@/components/ui/demo-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { useToast } from "@/components/ui/toast";
import { bloodCompatibility, getCompatibleDonors, tnDonors } from "@/lib/tn-data";
import { getCompatibleDonorGroups } from "@/lib/operations";
import { CANONICAL_BLOOD_GROUPS } from "@/lib/blood-groups";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

type MatchStatus = "idle" | "scanning" | "matched";

const groupOptions = CANONICAL_BLOOD_GROUPS.map((g) => ({ label: g, value: g }));

export default function MatchingPage() {
    const { toast } = useToast();
    const [selectedGroup, setSelectedGroup] = React.useState("");
    const [status, setStatus] = React.useState<MatchStatus>("idle");
    const [progress, setProgress] = React.useState(0);
    const [notified, setNotified] = React.useState<string[]>([]);

    const compatibleGroups = React.useMemo(
        () => (selectedGroup ? getCompatibleDonorGroups(selectedGroup) : []),
        [selectedGroup]
    );

    const matchedDonors = React.useMemo(
        () => (selectedGroup ? getCompatibleDonors(selectedGroup) : []),
        [selectedGroup]
    );

    const startMatching = () => {
        if (!selectedGroup) return;
        setStatus("scanning");
        setProgress(0);
        setNotified([]);

        const started = Date.now();
        const timer = window.setInterval(() => {
            const elapsed = Date.now() - started;
            const next = Math.min(100, Math.round((elapsed / 2200) * 100));
            setProgress(next);
            if (next >= 100) window.clearInterval(timer);
        }, 60);

        window.setTimeout(() => {
            setProgress(100);
            setStatus("matched");
            window.clearInterval(timer);
        }, 2200);
    };

    const reset = () => {
        setStatus("idle");
        setProgress(0);
        setSelectedGroup("");
        setNotified([]);
    };

    const notifyDonor = (donorId: string, donorName: string) => {
        setNotified((prev) => [...prev, donorId]);
        toast({
            tone: "success",
            title: `Simulated notification to ${donorName}`,
            description:
                "Demonstration only — no SMS, push or email was sent to a real donor.",
        });
    };

    return (
        <div className="space-y-6">
            <PageHeader
                eyebrow={
                    <>
                        <span>Blood operations</span>
                        <span aria-hidden="true">·</span>
                        <span>Compatibility</span>
                    </>
                }
                title="Donor matching"
                description="Search the donor registry for donors whose red cells are compatible with a required blood group, ranked by proximity."
                actions={<DemoBadge label="Simulated matching" />}
            />

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
                {/* ── Control panel ─────────────────────────────────── */}
                <div className="space-y-4">
                    <Card>
                        <CardHeader className="pb-4">
                            <CardTitle>Match parameters</CardTitle>
                            <p className="text-[12px] text-fg-muted">
                                Select a required group to begin a compatibility search.
                            </p>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="match-group">Required blood group</Label>
                                <Select
                                    id="match-group"
                                    value={selectedGroup}
                                    onChange={(e) => {
                                        setSelectedGroup(e.target.value);
                                        setStatus("idle");
                                        setProgress(0);
                                    }}
                                    options={groupOptions}
                                    placeholder="Select a blood group"
                                />
                            </div>

                            <AnimatePresence initial={false}>
                                {selectedGroup && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.22 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="rounded-lg border border-line bg-surface-sunken p-3.5">
                                            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-fg-subtle">
                                                Compatible donor groups
                                            </p>
                                            <div className="mt-2 flex flex-wrap gap-1.5">
                                                {compatibleGroups.map((group) => (
                                                    <BloodGroupBadge
                                                        key={group}
                                                        group={group}
                                                        size="sm"
                                                    />
                                                ))}
                                            </div>
                                            <p className="mt-2.5 text-[12px] leading-relaxed text-fg-muted">
                                                These are the groups whose red cells can
                                                be transfused to {selectedGroup} recipients.
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <Button
                                onClick={status === "matched" ? reset : startMatching}
                                disabled={!selectedGroup || status === "scanning"}
                                className="w-full gap-2"
                                size="lg"
                            >
                                {status === "idle" && (
                                    <>
                                        <Search className="h-4 w-4" aria-hidden="true" />
                                        Run compatibility search
                                    </>
                                )}
                                {status === "scanning" && "Scanning registry…"}
                                {status === "matched" && (
                                    <>
                                        <RotateCcw className="h-4 w-4" aria-hidden="true" />
                                        New search
                                    </>
                                )}
                            </Button>

                            {status === "scanning" && (
                                <div className="space-y-2" role="status" aria-live="polite">
                                    <div className="flex items-center justify-between text-[12px]">
                                        <span className="text-fg-muted">
                                            Scanning {tnDonors.length} registered donors
                                        </span>
                                        <span className="num font-semibold text-fg">
                                            {progress}%
                                        </span>
                                    </div>
                                    <div
                                        className="h-1.5 w-full overflow-hidden rounded-full bg-surface-sunken"
                                        role="progressbar"
                                        aria-valuenow={progress}
                                        aria-valuemin={0}
                                        aria-valuemax={100}
                                        aria-label="Compatibility search progress"
                                    >
                                        <div
                                            className="h-full rounded-full bg-brand transition-[width] duration-100"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                    <p className="text-[11px] text-fg-subtle">
                                        Simulation running locally — the registry is not
                                        contacted.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* ── Compatibility reference ───────────────────── */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle>Red cell compatibility</CardTitle>
                            <p className="text-[12px] text-fg-muted">
                                Rows are recipients, columns are donor groups.
                            </p>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto scrollbar-thin">
                                <table className="w-full min-w-[420px] border-separate border-spacing-0 text-[11px]">
                                    <caption className="sr-only">
                                        Red blood cell compatibility matrix. A check mark
                                        indicates the donor group in that column can donate
                                        to the recipient group in that row.
                                    </caption>
                                    <thead>
                                        <tr>
                                            <th
                                                scope="col"
                                                className="sticky left-0 z-10 bg-surface pb-2 pr-2 text-left font-semibold text-fg-subtle"
                                            >
                                                Recipient
                                            </th>
                                            {Object.keys(bloodCompatibility).map((group) => (
                                                <th
                                                    key={group}
                                                    scope="col"
                                                    className="pb-2 text-center font-semibold text-fg-subtle"
                                                >
                                                    {group}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.keys(bloodCompatibility).map((recipient) => (
                                            <tr key={recipient}>
                                                <th
                                                    scope="row"
                                                    className="sticky left-0 z-10 bg-surface py-1.5 pr-2 text-left font-semibold text-fg"
                                                >
                                                    {recipient}
                                                </th>
                                                {Object.keys(bloodCompatibility).map((donor) => {
                                                    const canDonate = bloodCompatibility[
                                                        donor
                                                    ]?.includes(recipient);
                                                    return (
                                                        <td key={donor} className="py-1.5 text-center">
                                                            <span
                                                                className={cn(
                                                                    "inline-flex h-5 w-5 items-center justify-center rounded",
                                                                    canDonate
                                                                        ? "bg-success-soft text-success-text"
                                                                        : "text-fg-subtle/40"
                                                                )}
                                                                aria-label={
                                                                    canDonate
                                                                        ? `${donor} can donate to ${recipient}`
                                                                        : `${donor} cannot donate to ${recipient}`
                                                                }
                                                            >
                                                                {canDonate ? (
                                                                    <Check className="h-3 w-3" aria-hidden="true" />
                                                                ) : (
                                                                    <X className="h-3 w-3" aria-hidden="true" />
                                                                )}
                                                            </span>
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* ── Results ───────────────────────────────────────── */}
                <div className="space-y-4">
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
                                    icon={Users}
                                    title="No search running"
                                    description="Choose a required blood group and start a compatibility search to see ranked donor matches."
                                    className="min-h-[420px]"
                                />
                            </motion.div>
                        )}

                        {status === "scanning" && (
                            <motion.div
                                key="scanning"
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
                                        <Activity className="h-5 w-5" aria-hidden="true" />
                                    </span>
                                    <div>
                                        <h2 className="text-sm font-semibold text-fg">
                                            Scanning donor registry
                                        </h2>
                                        <p className="mt-1 text-[12px] text-fg-muted">
                                            Comparing {tnDonors.length} seeded profiles against
                                            {selectedGroup} compatibility.
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

                        {status === "matched" && (
                            <motion.div
                                key="matched"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.25 }}
                                className="space-y-3"
                            >
                                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-success-border bg-success-soft px-4 py-3">
                                    <div>
                                        <h2 className="text-sm font-semibold text-fg">
                                            {matchedDonors.length} compatible donor
                                            {matchedDonors.length === 1 ? "" : "s"} found
                                        </h2>
                                        <p className="mt-0.5 text-[12px] text-fg-muted">
                                            Available donors able to donate to {selectedGroup},
                                            closest first.
                                        </p>
                                    </div>
                                    <Badge tone="success" dot>
                                        Search complete
                                    </Badge>
                                </div>

                                {matchedDonors.length === 0 ? (
                                    <EmptyState
                                        icon={Users}
                                        title="No available donors"
                                        description={`No currently available donor in the registry is compatible with ${selectedGroup}.`}
                                    />
                                ) : (
                                    <ul className="space-y-2.5">
                                        {matchedDonors.map((donor, index) => {
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
                                                                        <dt className="sr-only">Estimated travel time</dt>
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
                                            onClick={() => notifyDonor(donor.id, donor.name)}
                                            disabled={isNotified}
                                            className="shrink-0 gap-1.5"
                                        >
                                            {isNotified ? (
                                                <>
                                                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
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
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <p className="text-[11px] leading-relaxed text-fg-subtle">
                Compatibility follows the red-blood-cell donor rules held in the
                project data and is unchanged by this interface. Distances, travel
                times and ratings are seeded values for the demonstration donor
                registry, and the notify action does not contact anyone.
            </p>
        </div>
    );
}
