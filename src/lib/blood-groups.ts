/**
 * Canonical blood-group vocabulary.
 *
 * The seeded data model (`src/lib/tn-data.ts`) uses canonical labels
 * ("A+", "AB-", ...). Two forms in the original UI used a coded variant
 * ("a_pos", "ab_neg") for form select values, so both encodings live here
 * and every screen shares one source of truth.
 */

export const CANONICAL_BLOOD_GROUPS = [
    "A+",
    "A-",
    "B+",
    "B-",
    "O+",
    "O-",
    "AB+",
    "AB-",
] as const;

export type CanonicalBloodGroup = (typeof CANONICAL_BLOOD_GROUPS)[number];

/** Form-facing values, preserving the encoding the original UI used. */
export const BLOOD_GROUP_CODES = [
    { label: "A+", value: "a_pos" },
    { label: "A-", value: "a_neg" },
    { label: "B+", value: "b_pos" },
    { label: "B-", value: "b_neg" },
    { label: "O+", value: "o_pos" },
    { label: "O-", value: "o_neg" },
    { label: "AB+", value: "ab_pos" },
    { label: "AB-", value: "ab_neg" },
] as const;

export type BloodGroupCode = (typeof BLOOD_GROUP_CODES)[number]["value"];

const CODE_TO_GROUP: Record<string, CanonicalBloodGroup> = {
    a_pos: "A+",
    a_neg: "A-",
    b_pos: "B+",
    b_neg: "B-",
    o_pos: "O+",
    o_neg: "O-",
    ab_pos: "AB+",
    ab_neg: "AB-",
};

const GROUP_TO_CODE: Record<CanonicalBloodGroup, string> = {
    "A+": "a_pos",
    "A-": "a_neg",
    "B+": "b_pos",
    "B-": "b_neg",
    "O+": "o_pos",
    "O-": "o_neg",
    "AB+": "ab_pos",
    "AB-": "ab_neg",
};

/** "a_neg" -> "A-". Returns the input unchanged if it is not a known code. */
export function codeToGroup(code: string): string {
    return CODE_TO_GROUP[code] ?? code;
}

/** "A-" -> "a_neg". Returns the input unchanged if it is not a known group. */
export function groupToCode(group: string): string {
    return GROUP_TO_CODE[group as CanonicalBloodGroup] ?? group;
}

/** Display label for either encoding. */
export function bloodGroupLabel(value: string): string {
    return codeToGroup(value).toUpperCase();
}
