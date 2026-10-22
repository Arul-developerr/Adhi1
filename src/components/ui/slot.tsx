import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Minimal Slot implementation so primitives can render as another element
 * (e.g. a `Link`) without pulling in an extra dependency.
 */
export function Slot({
    children,
    ...slotProps
}: React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }) {
    if (!React.isValidElement(children)) return null;

    const child = children as React.ReactElement<Record<string, unknown>>;

    return React.cloneElement(child, {
        ...slotProps,
        ...child.props,
        className: cn(slotProps.className as string, child.props.className as string),
    });
}
