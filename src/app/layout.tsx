import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ToastProvider } from "@/components/ui/toast";

export const metadata: Metadata = {
    title: {
        default: "TN LifeBlood — Smart Blood Bank Management | Namakkal District",
        template: "%s · TN LifeBlood",
    },
    description:
        "A blood-bank management interface for Namakkal District, Tamil Nadu: donor registration, compatibility matching, stock monitoring, emergency alerting and demand forecasting across government and private blood banks.",
    applicationName: "TN LifeBlood",
};

export const viewport: Viewport = {
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#f6f0e7" },
        { media: "(prefers-color-scheme: dark)", color: "#111713" },
    ],
    width: "device-width",
    initialScale: 1,
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className="font-sans">
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem
                    disableTransitionOnChange
                >
                    <ToastProvider>{children}</ToastProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
