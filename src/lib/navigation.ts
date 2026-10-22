import {
    Activity,
    Bell,
    Brain,
    Building2,
    Droplet,
    LayoutDashboard,
    Siren,
    UserPlus,
    type LucideIcon,
} from "lucide-react";

export interface NavItem {
    name: string
    href: string
    icon: LucideIcon
    /** Short descriptor used in the mobile drawer. */
    description: string
}

export interface NavGroup {
    label: string
    items: NavItem[]
}

export const navGroups: NavGroup[] = [
    {
        label: "Overview",
        items: [
            {
                name: "Dashboard",
                href: "/dashboard",
                icon: LayoutDashboard,
                description: "District operations at a glance",
            },
        ],
    },
    {
        label: "Blood Operations",
        items: [
            {
                name: "Inventory",
                href: "/inventory",
                icon: Droplet,
                description: "Stock across every blood bank",
            },
            {
                name: "Donor Matching",
                href: "/matching",
                icon: Activity,
                description: "Find compatible donors",
            },
            {
                name: "Emergency Requests",
                href: "/request",
                icon: Siren,
                description: "Raise a blood requirement",
            },
            {
                name: "Alerts",
                href: "/alerts",
                icon: Bell,
                description: "Broadcast and resolve incidents",
            },
        ],
    },
    {
        label: "Intelligence",
        items: [
            {
                name: "Predictions",
                href: "/predictions",
                icon: Brain,
                description: "Demand forecasting and risk",
            },
        ],
    },
    {
        label: "Community",
        items: [
            {
                name: "Donor Registration",
                href: "/register",
                icon: UserPlus,
                description: "Enrol a new blood donor",
            },
        ],
    },
];

/** Flat list of every operational route, used by the mobile drawer. */
export const allNavItems: NavItem[] = navGroups.flatMap((group) => group.items);

/** Marketing (public) navigation. */
export const marketingNav = [
    { name: "Overview", href: "/#overview" },
    { name: "Platform", href: "/#platform" },
    { name: "Inventory", href: "/#inventory" },
    { name: "Forecasting", href: "/#forecasting" },
];

export const districtScope = {
    name: "Namakkal District",
    state: "Tamil Nadu",
    icon: Building2,
};
