
export interface Hospital {
    id: string
    name: string
    city: string
    district: string
    type: "government" | "private"
    bloodBankCapacity: number
    contact: string
    address: string
    hours?: string
    lat: number
    lng: number
    inventory: BloodInventory
}

export interface BloodInventory {
    "A+": number
    "A-": number
    "B+": number
    "B-": number
    "O+": number
    "O-": number
    "AB+": number
    "AB-": number
}

export interface Donor {
    id: string
    name: string
    bloodGroup: string
    city: string
    district: string
    phone: string
    lastDonation: string
    isAvailable: boolean
    rating: number
    distance?: string
    eta?: string
}

export interface EmergencyAlert {
    id: string
    type: "critical_shortage" | "emergency_request" | "expiry_warning" | "donor_match"
    hospitalId: string
    hospitalName: string
    bloodGroup: string
    message: string
    urgency: "critical" | "high" | "standard"
    timestamp: string
    status: "active" | "resolved" | "pending"
    district: string
}

export interface PredictionZone {
    district: string
    currentDemand: number
    predictedDemand: number
    changePercent: number
    riskLevel: "low" | "medium" | "high" | "critical"
    topShortage: string
    season: string
}

export const tnHospitals: Hospital[] = [
    {
        id: "gov-01",
        name: "Govt. Headquarters Hospital Blood Bank",
        city: "Namakkal",
        district: "Namakkal",
        type: "government",
        bloodBankCapacity: 1500,
        contact: "04286-221411 / 9942933213",
        address: "Namakkal Town, Namakkal District",
        lat: 11.2189,
        lng: 78.1674,
        inventory: { "A+": 120, "A-": 15, "B+": 105, "B-": 12, "O+": 180, "O-": 22, "AB+": 38, "AB-": 6 }
    },
    {
        id: "gov-02",
        name: "Govt. Hospital Blood Bank, Tiruchengode",
        city: "Tiruchengode",
        district: "Namakkal",
        type: "government",
        bloodBankCapacity: 800,
        contact: "04288-222333",
        address: "Tiruchengode, Namakkal District",
        lat: 11.3932,
        lng: 77.9943,
        inventory: { "A+": 65, "A-": 8, "B+": 55, "B-": 7, "O+": 95, "O-": 12, "AB+": 20, "AB-": 3 }
    },
    {
        id: "gov-03",
        name: "Govt. Hospital Blood Bank, Rasipuram",
        city: "Rasipuram",
        district: "Namakkal",
        type: "government",
        bloodBankCapacity: 800,
        contact: "04287-231555",
        address: "Rasipuram East, Namakkal District",
        lat: 11.4600,
        lng: 78.1800,
        inventory: { "A+": 60, "A-": 7, "B+": 50, "B-": 6, "O+": 88, "O-": 10, "AB+": 18, "AB-": 3 }
    },

    {
        id: "pvt-01",
        name: "Vivekananda Blood Bank",
        city: "Tiruchengode",
        district: "Namakkal",
        type: "private",
        bloodBankCapacity: 600,
        contact: "04288-225500",
        address: "Elayampalayam, Tiruchengode",
        hours: "Open 24 Hours",
        lat: 11.3850,
        lng: 77.9850,
        inventory: { "A+": 48, "A-": 6, "B+": 42, "B-": 5, "O+": 72, "O-": 9, "AB+": 15, "AB-": 2 }
    },
    {
        id: "pvt-02",
        name: "Shharc Charity Blood Bank",
        city: "Namakkal",
        district: "Namakkal",
        type: "private",
        bloodBankCapacity: 500,
        contact: "04286-228899",
        address: "39A, Dr. Shankaram Road, Gandhi Nagar (Near BSNL Office), Namakkal",
        lat: 11.2200,
        lng: 78.1650,
        inventory: { "A+": 40, "A-": 5, "B+": 35, "B-": 4, "O+": 60, "O-": 7, "AB+": 12, "AB-": 2 }
    },
    {
        id: "pvt-03",
        name: "Bharath Clinical Laboratory And Blood Bank",
        city: "Namakkal",
        district: "Namakkal",
        type: "private",
        bloodBankCapacity: 400,
        contact: "04286-227766",
        address: "No. 71/13, Trichy Main Road, Namakkal",
        lat: 11.2150,
        lng: 78.1700,
        inventory: { "A+": 32, "A-": 4, "B+": 28, "B-": 3, "O+": 48, "O-": 6, "AB+": 10, "AB-": 2 }
    },
]

export const tnDonors: Donor[] = [
    { id: "D001", name: "Senthil Kumar R.", bloodGroup: "O+", city: "Namakkal", district: "Namakkal", phone: "+91 94430 XXXXX", lastDonation: "2025-11-15", isAvailable: true, rating: 4.9, distance: "1.5 km", eta: "6 mins" },
    { id: "D002", name: "Kavitha Devi M.", bloodGroup: "A+", city: "Namakkal", district: "Namakkal", phone: "+91 97890 XXXXX", lastDonation: "2025-10-20", isAvailable: true, rating: 5.0, distance: "2.2 km", eta: "9 mins" },
    { id: "D003", name: "Rajesh Kannan P.", bloodGroup: "B+", city: "Tiruchengode", district: "Namakkal", phone: "+91 98650 XXXXX", lastDonation: "2025-12-01", isAvailable: true, rating: 4.8, distance: "3.0 km", eta: "12 mins" },
    { id: "D004", name: "Lakshmi Priya S.", bloodGroup: "O-", city: "Rasipuram", district: "Namakkal", phone: "+91 94440 XXXXX", lastDonation: "2025-09-10", isAvailable: true, rating: 4.7, distance: "4.2 km", eta: "16 mins" },
    { id: "D005", name: "Murugan K.", bloodGroup: "AB+", city: "Namakkal", district: "Namakkal", phone: "+91 98940 XXXXX", lastDonation: "2025-11-28", isAvailable: true, rating: 4.9, distance: "1.8 km", eta: "7 mins" },
    { id: "D006", name: "Priya Narayanan T.", bloodGroup: "A-", city: "Tiruchengode", district: "Namakkal", phone: "+91 99420 XXXXX", lastDonation: "2025-10-05", isAvailable: false, rating: 4.6, distance: "5.0 km", eta: "20 mins" },
    { id: "D007", name: "Balaji N.", bloodGroup: "B-", city: "Paramathi-Velur", district: "Namakkal", phone: "+91 94450 XXXXX", lastDonation: "2025-12-10", isAvailable: true, rating: 5.0, distance: "6.1 km", eta: "22 mins" },
    { id: "D008", name: "Deepika Sundaram V.", bloodGroup: "O+", city: "Mohanur", district: "Namakkal", phone: "+91 97860 XXXXX", lastDonation: "2025-08-22", isAvailable: true, rating: 4.8, distance: "8.5 km", eta: "28 mins" },
]

export const tnAlerts: EmergencyAlert[] = [
    {
        id: "ALT-001",
        type: "critical_shortage",
        hospitalId: "gov-01",
        hospitalName: "Govt. HQ Hospital Blood Bank, Namakkal",
        bloodGroup: "O-",
        message: "Critical O-Negative shortage. Only 8 units remaining. Urgent replenishment required due to accident cases.",
        urgency: "critical",
        timestamp: "5 mins ago",
        status: "active",
        district: "Namakkal"
    },
    {
        id: "ALT-002",
        type: "emergency_request",
        hospitalId: "pvt-01",
        hospitalName: "Vivekananda Blood Bank, Tiruchengode",
        bloodGroup: "AB-",
        message: "Emergency surgery requires 3 units of AB-Negative. Immediate donor match needed.",
        urgency: "critical",
        timestamp: "12 mins ago",
        status: "active",
        district: "Namakkal"
    },
    {
        id: "ALT-003",
        type: "expiry_warning",
        hospitalId: "gov-02",
        hospitalName: "Govt. Hospital Blood Bank, Tiruchengode",
        bloodGroup: "A+",
        message: "12 units of A-Positive expiring within 48 hours. Transfer to high-demand zones recommended.",
        urgency: "high",
        timestamp: "25 mins ago",
        status: "pending",
        district: "Namakkal"
    },
    {
        id: "ALT-004",
        type: "donor_match",
        hospitalId: "pvt-02",
        hospitalName: "Shharc Charity Blood Bank, Namakkal",
        bloodGroup: "B+",
        message: "2 compatible donors found within 3km radius for pending B+ request.",
        urgency: "standard",
        timestamp: "40 mins ago",
        status: "resolved",
        district: "Namakkal"
    },
    {
        id: "ALT-005",
        type: "critical_shortage",
        hospitalId: "gov-03",
        hospitalName: "Govt. Hospital Blood Bank, Rasipuram",
        bloodGroup: "B-",
        message: "B-Negative stock depleted. Festival season demand spike anticipated. Urgent replenishment needed.",
        urgency: "critical",
        timestamp: "1 hour ago",
        status: "active",
        district: "Namakkal"
    },
    {
        id: "ALT-006",
        type: "emergency_request",
        hospitalId: "gov-01",
        hospitalName: "Govt. HQ Hospital Blood Bank, Namakkal",
        bloodGroup: "O+",
        message: "Road accident case. 5 units O+ needed urgently for multiple victims.",
        urgency: "critical",
        timestamp: "1.5 hours ago",
        status: "active",
        district: "Namakkal"
    },
    {
        id: "ALT-007",
        type: "expiry_warning",
        hospitalId: "pvt-03",
        hospitalName: "Bharath Clinical Lab & Blood Bank, Namakkal",
        bloodGroup: "AB+",
        message: "8 units of AB+ approaching expiry in 72 hours. Redistribution recommended.",
        urgency: "high",
        timestamp: "2 hours ago",
        status: "pending",
        district: "Namakkal"
    },
    {
        id: "ALT-008",
        type: "donor_match",
        hospitalId: "pvt-01",
        hospitalName: "Vivekananda Blood Bank, Tiruchengode",
        bloodGroup: "O-",
        message: "Rare O-Negative donor identified 2.5km away. Awaiting confirmation.",
        urgency: "high",
        timestamp: "3 hours ago",
        status: "pending",
        district: "Namakkal"
    },
]

export const tnPredictionZones: PredictionZone[] = [
    { district: "Namakkal Town", currentDemand: 420, predictedDemand: 510, changePercent: 21.4, riskLevel: "high", topShortage: "O-", season: "Festival" },
    { district: "Tiruchengode", currentDemand: 310, predictedDemand: 380, changePercent: 22.6, riskLevel: "critical", topShortage: "AB-", season: "Monsoon" },
    { district: "Rasipuram", currentDemand: 250, predictedDemand: 290, changePercent: 16.0, riskLevel: "high", topShortage: "B-", season: "Festival" },
    { district: "Paramathi-Velur", currentDemand: 140, predictedDemand: 160, changePercent: 14.3, riskLevel: "medium", topShortage: "O+", season: "Summer" },
    { district: "Mohanur", currentDemand: 100, predictedDemand: 110, changePercent: 10.0, riskLevel: "medium", topShortage: "A-", season: "Normal" },
]

export const monthlyTrendData = [
    { month: "Jan", demand: 520, supply: 560, donations: 150 },
    { month: "Feb", demand: 480, supply: 510, donations: 140 },
    { month: "Mar", demand: 510, supply: 490, donations: 125 },
    { month: "Apr", demand: 600, supply: 530, donations: 135 },
    { month: "May", demand: 650, supply: 580, donations: 145 },
    { month: "Jun", demand: 560, supply: 550, donations: 165 },
    { month: "Jul", demand: 610, supply: 540, donations: 138 },
    { month: "Aug", demand: 640, supply: 560, donations: 155 },
    { month: "Sep", demand: 590, supply: 570, donations: 170 },
    { month: "Oct", demand: 690, supply: 600, donations: 142 },
    { month: "Nov", demand: 720, supply: 630, donations: 160 },
    { month: "Dec", demand: 650, supply: 640, donations: 180 },
]

export const bloodCompatibility: Record<string, string[]> = {
    "O-": ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
    "O+": ["O+", "A+", "B+", "AB+"],
    "A-": ["A-", "A+", "AB-", "AB+"],
    "A+": ["A+", "AB+"],
    "B-": ["B-", "B+", "AB-", "AB+"],
    "B+": ["B+", "AB+"],
    "AB-": ["AB-", "AB+"],
    "AB+": ["AB+"],
}

export function getHospitalsByDistrict(district: string): Hospital[] {
    return tnHospitals.filter(h => h.district === district)
}

export function getHospitalsByType(type: "government" | "private"): Hospital[] {
    return tnHospitals.filter(h => h.type === type)
}

export function getDonorsByBloodGroup(bloodGroup: string): Donor[] {
    return tnDonors.filter(d => d.bloodGroup === bloodGroup && d.isAvailable)
}

export function getCompatibleDonors(requiredGroup: string): Donor[] {
    const compatibleGroups = Object.entries(bloodCompatibility)
        .filter(([_, canDonateTo]) => canDonateTo.includes(requiredGroup))
        .map(([group]) => group)
    return tnDonors.filter(d => compatibleGroups.includes(d.bloodGroup) && d.isAvailable)
}

export function getTotalInventory(): BloodInventory {
    const total: BloodInventory = { "A+": 0, "A-": 0, "B+": 0, "B-": 0, "O+": 0, "O-": 0, "AB+": 0, "AB-": 0 }
    tnHospitals.forEach(h => {
        (Object.keys(total) as Array<keyof BloodInventory>).forEach(key => {
            total[key] += h.inventory[key]
        })
    })
    return total
}

export const tnDistricts = Array.from(new Set(tnHospitals.map(h => h.district)))
