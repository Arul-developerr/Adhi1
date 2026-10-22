import * as React from "react";
import { cn } from "@/lib/utils";
import { Slot } from "./slot";

export type ButtonVariant =
    | "primary"
    | "danger"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "subtle";
export type ButtonSize = "sm" | "default" | "lg" | "xl" | "icon";

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    asChild?: boolean
    variant?: ButtonVariant
    size?: ButtonSize
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
    primary:
        "bg-brand text-brand-fg shadow-sm hover:bg-brand-hover active:bg-brand-hover disabled:bg-brand/45",
    danger:
        "bg-danger-solid text-danger-fg shadow-sm hover:bg-danger-solid/90 active:bg-danger-solid",
    outline:
        "border border-line-strong bg-surface text-fg hover:bg-surface-hover hover:border-fg-subtle",
    secondary: "bg-forest text-forest-fg hover:bg-forest-hover",
    ghost: "text-fg-muted hover:bg-surface-hover hover:text-fg",
    link: "text-brand-text underline-offset-4 hover:underline",
    subtle: "bg-brand-soft text-brand-text hover:bg-brand-soft/70",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
    sm: "h-8 gap-1.5 rounded-md px-3 text-[13px]",
    default: "h-10 gap-2 rounded-lg px-4 text-sm",
    lg: "h-11 gap-2 rounded-lg px-5 text-[15px]",
    xl: "h-12 gap-2.5 rounded-lg px-6 text-base",
    icon: "h-10 w-10 rounded-lg",
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "default", asChild = false, type, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";

        return (
            <Comp
                ref={asChild ? undefined : ref}
                className={cn(
                    "inline-flex select-none items-center justify-center whitespace-nowrap font-medium",
                    "transition-[background-color,border-color,color,box-shadow,transform] duration-150",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
                    "disabled:pointer-events-none disabled:opacity-55",
                    "active:translate-y-px",
                    "[&_svg]:shrink-0",
                    VARIANT_CLASSES[variant],
                    SIZE_CLASSES[size],
                    className
                )}
                {...(asChild ? {} : { type: type ?? "button" })}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button };
