import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: "class",
    theme: {
        container: {
            center: true,
            padding: "1.5rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            fontFamily: {
                sans: ["Inter", "Segoe UI", "system-ui", "-apple-system", "sans-serif"],
                mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
            },
            colors: {
                /* ── Surfaces ───────────────────────────────────── */
                bg: "var(--bg)",
                surface: {
                    DEFAULT: "var(--surface)",
                    raised: "var(--surface-raised)",
                    sunken: "var(--surface-sunken)",
                    hover: "var(--surface-hover)",
                },

                /* ── Text ───────────────────────────────────────── */
                fg: {
                    DEFAULT: "var(--fg)",
                    muted: "var(--fg-muted)",
                    subtle: "var(--fg-subtle)",
                },

                /* ── Lines ──────────────────────────────────────── */
                line: {
                    DEFAULT: "var(--border)",
                    strong: "var(--border-strong)",
                },

                /* ── Brand ──────────────────────────────────────── */
                brand: {
                    DEFAULT: "var(--brand)",
                    hover: "var(--brand-hover)",
                    fg: "var(--brand-fg)",
                    text: "var(--brand-text)",
                    soft: "var(--brand-soft)",
                    softer: "var(--brand-softer)",
                    border: "var(--brand-border)",
                },
                forest: {
                    DEFAULT: "var(--forest)",
                    hover: "var(--forest-hover)",
                    fg: "var(--forest-fg)",
                },
                gold: "var(--gold)",

                /* ── Semantic ───────────────────────────────────── */
                success: {
                    DEFAULT: "var(--success)",
                    text: "var(--success-text)",
                    solid: "var(--success-solid)",
                    fg: "var(--success-fg)",
                    soft: "var(--success-soft)",
                    border: "var(--success-border)",
                },
                warning: {
                    DEFAULT: "var(--warning)",
                    text: "var(--warning-text)",
                    solid: "var(--warning-solid)",
                    fg: "var(--warning-fg)",
                    soft: "var(--warning-soft)",
                    border: "var(--warning-border)",
                },
                danger: {
                    DEFAULT: "var(--danger)",
                    text: "var(--danger-text)",
                    solid: "var(--danger-solid)",
                    fg: "var(--danger-fg)",
                    soft: "var(--danger-soft)",
                    border: "var(--danger-border)",
                },
                info: {
                    DEFAULT: "var(--info)",
                    text: "var(--info-text)",
                    solid: "var(--info-solid)",
                    fg: "var(--info-fg)",
                    soft: "var(--info-soft)",
                    border: "var(--info-border)",
                },

                /* ── Legacy aliases kept for compatibility ─────── */
                background: "var(--bg)",
                foreground: "var(--fg)",
                border: "var(--border)",
                input: "var(--border-strong)",
                ring: "var(--ring)",
                primary: {
                    DEFAULT: "var(--brand)",
                    foreground: "var(--brand-fg)",
                },
                secondary: {
                    DEFAULT: "var(--surface-raised)",
                    foreground: "var(--fg)",
                },
                muted: {
                    DEFAULT: "var(--surface-sunken)",
                    foreground: "var(--fg-muted)",
                },
                destructive: {
                    DEFAULT: "var(--danger-solid)",
                    foreground: "var(--danger-fg)",
                },
                popover: {
                    DEFAULT: "var(--surface)",
                    foreground: "var(--fg)",
                },
                card: {
                    DEFAULT: "var(--surface)",
                    foreground: "var(--fg)",
                },
            },
            boxShadow: {
                xs: "var(--shadow-xs)",
                sm: "var(--shadow-sm)",
                md: "var(--shadow-md)",
                lg: "var(--shadow-lg)",
                pop: "var(--shadow-pop)",
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
            },
        },
    },
    plugins: [],
};
export default config;
