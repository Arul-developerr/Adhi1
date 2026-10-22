"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Info, TriangleAlert, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastTone = "success" | "info" | "warning" | "danger";

export interface ToastItem {
    id: string
    title: string
    description?: string
    tone: ToastTone
}

interface ToastContextValue {
    toast: (item: Omit<ToastItem, "id">) => void
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
    const context = React.useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}

const TONE_STYLES: Record<ToastTone, { icon: typeof Info; accent: string }> = {
    success: { icon: CheckCircle2, accent: "text-success-text" },
    info: { icon: Info, accent: "text-info-text" },
    warning: { icon: TriangleAlert, accent: "text-warning-text" },
    danger: { icon: TriangleAlert, accent: "text-danger-text" },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = React.useState<ToastItem[]>([]);
    const timers = React.useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

    const dismiss = React.useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
        const timer = timers.current.get(id);
        if (timer) {
            clearTimeout(timer);
            timers.current.delete(id);
        }
    }, []);

    const toast = React.useCallback(
        (item: Omit<ToastItem, "id">) => {
            const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
            setToasts((prev) => [...prev.slice(-2), { ...item, id }]);
            const timer = setTimeout(() => dismiss(id), 5000);
            timers.current.set(id, timer);
        },
        [dismiss]
    );

    React.useEffect(() => {
        const map = timers.current;
        return () => {
            map.forEach((timer) => clearTimeout(timer));
            map.clear();
        };
    }, []);

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}
            <div
                role="region"
                aria-label="Notifications"
                className="pointer-events-none fixed inset-x-0 bottom-0 z-[80] flex flex-col items-center gap-2 p-4 sm:inset-x-auto sm:right-0 sm:top-0 sm:bottom-auto sm:items-end"
            >
                <AnimatePresence initial={false}>
                    {toasts.map((item) => {
                        const { icon: Icon, accent } = TONE_STYLES[item.tone];
                        return (
                            <motion.div
                                key={item.id}
                                layout
                                role="status"
                                aria-live="polite"
                                initial={{ opacity: 0, y: 16, scale: 0.97 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                                className={cn(
                                    "pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-lg border border-line bg-surface-raised p-3.5 shadow-pop"
                                )}
                            >
                                <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", accent)} aria-hidden="true" />
                                <div className="min-w-0 flex-1">
                                    <p className="text-[13px] font-semibold leading-snug text-fg">
                                        {item.title}
                                    </p>
                                    {item.description && (
                                        <p className="mt-0.5 text-[12px] leading-snug text-fg-muted">
                                            {item.description}
                                        </p>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => dismiss(item.id)}
                                    className="-m-1 rounded p-1 text-fg-subtle transition-colors hover:text-fg"
                                    aria-label="Dismiss notification"
                                >
                                    <X className="h-3.5 w-3.5" aria-hidden="true" />
                                </button>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}
