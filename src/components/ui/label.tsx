import * as React from "react";
import { cn } from "@/lib/utils";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
    /** Appends a required marker and sets the matching ARIA state. */
    required?: boolean
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
    ({ className, children, required, ...props }, ref) => (
        <label
            ref={ref}
            className={cn(
                "text-[13px] font-medium leading-none text-fg",
                "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                className
            )}
            {...props}
        >
            {children}
            {required && (
                <span className="ml-1 text-brand-text" aria-hidden="true">
                    *
                </span>
            )}
        </label>
    )
);
Label.displayName = "Label";

export { Label };
