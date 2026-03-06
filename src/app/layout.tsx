import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { BackgroundParticles } from "@/components/background-particles";
import { Loader } from "@/components/loader";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "TN LifeBlood - Smart Blood Bank Management System | Tamil Nadu",
    description: "Smart Blood Bank Management System with Automated Donor Matching for Tamil Nadu Government and Private Hospitals. AI-powered blood demand prediction, real-time inventory tracking, and emergency alert system.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem
                    disableTransitionOnChange
                >
                    <Loader />
                    <BackgroundParticles />
                    <Navbar />
                    <main className="min-h-screen pt-16">
                        {children}
                    </main>
                    <Footer />
                </ThemeProvider>
            </body>
        </html>
    );
}
