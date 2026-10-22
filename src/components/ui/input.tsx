import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    /** Marks the field as invalid and wires up aria-invalid. */
    invalid?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, invalid, ...props }, ref) => {
        return (
            <input
                type={type}
                aria-invalid={invalid || undefined}
                className={cn(
                    "flex h-10 w-full rounded-lg border border-line-strong bg-surface px-3 py-2 text-sm text-fg",
                    "placeholder:text-fg-subtle",
                    "transition-[border-color,box-shadow] duration-150",
                    "focus-visible:outline-none focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/25",
                    "disabled:cursor-not-allowed disabled:opacity-55 disabled:bg-surface-sunken",
                    invalid &&
                        "border-danger/70 focus-visible:border-danger focus-visible:ring-danger/25",
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Input.displayName = "Input";

export { Input };
