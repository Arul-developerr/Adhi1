import * as React from "react";
import { FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Marks an interface as operating on demonstration data.
 *
 * The application has no backend, so any screen showing seeded values
 * carries this indicator rather than implying a live operational feed.
 */
export function DemoBadge({
    className,
    label = "Demonstration data",
}: {
    className?: string
    label?: string
}) {
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 rounded-md border border-line bg-surface-sunken px-2 py-1",
                "text-[11px] font-medium leading-4 text-fg-muted",
                className
            )}
        >
            <FlaskConical className="h-3 w-3" aria-hidden="true" />
            {label}
        </span>
    );
}
