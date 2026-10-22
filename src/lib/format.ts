/** Number, date and label formatting helpers shared across the product. */

const numberFormatter = new Intl.NumberFormat("en-IN");

export function formatNumber(value: number): string {
    return numberFormatter.format(value);
}

export function formatPercent(value: number, digits = 1): string {
    const sign = value > 0 ? "+" : "";
    return `${sign}${value.toFixed(digits)}%`;
}

export function formatCompact(value: number): string {
    if (Math.abs(value) >= 1000) {
        return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k`;
    }
    return String(value);
}

/** "2025-11-15" -> "15 Nov 2025". Returns the raw string if unparseable. */
export function formatDate(value: string): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
    return `${formatNumber(count)} ${count === 1 ? singular : plural}`;
}

export function titleCase(value: string): string {
    return value
        .split(/[\s_-]+/)
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}
