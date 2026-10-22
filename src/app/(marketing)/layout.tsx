import type { ReactNode } from "react";
import { MarketingNavbar } from "@/components/marketing-navbar";
import { MarketingFooter } from "@/components/marketing-footer";

export default function MarketingLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col bg-bg">
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-brand focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-brand-fg"
            >
                Skip to content
            </a>
            <MarketingNavbar />
            <main id="main-content" className="flex-1">
                {children}
            </main>
            <MarketingFooter />
        </div>
    );
}
