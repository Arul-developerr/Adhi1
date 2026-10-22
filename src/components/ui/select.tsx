import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
    label: string
    value: string
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    options: SelectOption[]
    placeholder?: string
    invalid?: boolean
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, options, placeholder, invalid, ...props }, ref) => {
        return (
            <div className="relative">
                <select
                    ref={ref}
                    aria-invalid={invalid || undefined}
                    className={cn(
                        "flex h-10 w-full appearance-none rounded-lg border border-line-strong bg-surface px-3 py-2 pr-9 text-sm text-fg",
                        "transition-[border-color,box-shadow] duration-150",
                        "focus-visible:outline-none focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/25",
                        "disabled:cursor-not-allowed disabled:opacity-55 disabled:bg-surface-sunken",
                        invalid &&
                            "border-danger/70 focus-visible:border-danger focus-visible:ring-danger/25",
                        className
                    )}
                    {...props}
                >
                    {placeholder && (
                        <option value="" disabled hidden>
                            {placeholder}
                        </option>
                    )}
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                <ChevronDown
                    className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-subtle"
                    aria-hidden="true"
                />
            </div>
        );
    }
);
Select.displayName = "Select";

export { Select };
