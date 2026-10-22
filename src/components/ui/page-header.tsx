import * as React from "react";
import { cn } from "@/lib/utils";

export interface PageHeaderProps {
    /** Small uppercase context line above the title. */
    eyebrow?: React.ReactNode
    title: string
    description?: React.ReactNode
    /** Right-aligned controls (filters, actions, demo badge). */
    actions?: React.ReactNode
    className?: string
}

export function PageHeader({
    eyebrow,
    title,
    description,
    actions,
    className,
}: PageHeaderProps) {
    return (
        <header
            className={cn(
                "flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-start sm:justify-between sm:gap-6",
                className
            )}
        >
            <div className="min-w-0 flex-1">
                {eyebrow && (
                    <div className="label-eyebrow mb-2 flex items-center gap-2">
                        {eyebrow}
                    </div>
                )}
                <h1 className="text-[26px] font-semibold leading-tight tracking-tight text-fg sm:text-[30px]">
                    {title}
                </h1>
                {description && (
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-fg-muted">
                        {description}
                    </p>
                )}
            </div>
            {actions && (
                <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
                    {actions}
                </div>
            )}
        </header>
    );
}
