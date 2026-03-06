// Tamil Nadu Government & Private Hospital Data
// Smart Blood Bank Management System

export interface Hospital {
    id: string
    name: string
    city: string
    district: string
    type: "government" | "private"
    bloodBankCapacity: number
    contact: string
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

// ──────────────────────────────────────────────
// Tamil Nadu Hospitals
// ──────────────────────────────────────────────
export const tnHospitals: Hospital[] = [
    // Government Hospitals
    {
        id: "gov-01",
        name: "Rajiv Gandhi Government General Hospital",
        city: "Chennai",
        district: "Chennai",
        type: "government",
        bloodBankCapacity: 5000,
        contact: "044-25305000",
        lat: 13.0827,
        lng: 80.2707,
        inventory: { "A+": 320, "A-": 45, "B+": 280, "B-": 38, "O+": 410, "O-": 52, "AB+": 95, "AB-": 18 }
    },
    {
        id: "gov-02",
        name: "Government Kilpauk Medical College Hospital",
        city: "Chennai",
        district: "Chennai",
        type: "government",
        bloodBankCapacity: 3500,
        contact: "044-26432414",
        lat: 13.0878,
        lng: 80.2454,
        inventory: { "A+": 210, "A-": 30, "B+": 190, "B-": 25, "O+": 340, "O-": 40, "AB+": 72, "AB-": 12 }
    },
    {
        id: "gov-03",
        name: "Government Royapettah Hospital",
        city: "Chennai",
        district: "Chennai",
        type: "government",
        bloodBankCapacity: 2000,
        contact: "044-28193111",
        lat: 13.0539,
        lng: 80.2636,
        inventory: { "A+": 150, "A-": 22, "B+": 130, "B-": 18, "O+": 220, "O-": 28, "AB+": 55, "AB-": 8 }
    },
    {
        id: "gov-04",
        name: "Government Rajaji Hospital",
        city: "Madurai",
        district: "Madurai",
        type: "government",
        bloodBankCapacity: 4000,
        contact: "0452-2532535",
        lat: 9.9252,
        lng: 78.1198,
        inventory: { "A+": 260, "A-": 35, "B+": 240, "B-": 30, "O+": 380, "O-": 45, "AB+": 80, "AB-": 14 }
    },
    {
        id: "gov-05",
        name: "Coimbatore Medical College Hospital",
        city: "Coimbatore",
        district: "Coimbatore",
        type: "government",
        bloodBankCapacity: 3500,
        contact: "0422-2301393",
        lat: 11.0168,
        lng: 76.9558,
        inventory: { "A+": 230, "A-": 28, "B+": 200, "B-": 22, "O+": 350, "O-": 38, "AB+": 68, "AB-": 11 }
    },
    {
        id: "gov-06",
        name: "Government Hospital Tiruchirappalli",
        city: "Tiruchirappalli",
        district: "Tiruchirappalli",
        type: "government",
        bloodBankCapacity: 3000,
        contact: "0431-2414969",
        lat: 10.7905,
        lng: 78.7047,
        inventory: { "A+": 200, "A-": 25, "B+": 180, "B-": 20, "O+": 310, "O-": 35, "AB+": 62, "AB-": 10 }
    },
    {
        id: "gov-07",
        name: "Government Mohan Kumaramangalam Medical College Hospital",
        city: "Salem",
        district: "Salem",
        type: "government",
        bloodBankCapacity: 2500,
        contact: "0427-2312780",
        lat: 11.6643,
        lng: 78.1460,
        inventory: { "A+": 170, "A-": 20, "B+": 150, "B-": 16, "O+": 260, "O-": 30, "AB+": 52, "AB-": 8 }
    },
    {
        id: "gov-08",
        name: "Government Vellore Medical College Hospital",
        city: "Vellore",
        district: "Vellore",
        type: "government",
        bloodBankCapacity: 2000,
        contact: "0416-2263363",
        lat: 12.9165,
        lng: 79.1325,
        inventory: { "A+": 140, "A-": 18, "B+": 120, "B-": 14, "O+": 210, "O-": 24, "AB+": 45, "AB-": 7 }
    },
    {
        id: "gov-09",
        name: "Thanjavur Medical College Hospital",
        city: "Thanjavur",
        district: "Thanjavur",
        type: "government",
        bloodBankCapacity: 2000,
        contact: "04362-231871",
        lat: 10.7870,
        lng: 79.1378,
        inventory: { "A+": 130, "A-": 15, "B+": 110, "B-": 12, "O+": 200, "O-": 22, "AB+": 40, "AB-": 6 }
    },
    {
        id: "gov-10",
        name: "Tirunelveli Medical College Hospital",
        city: "Tirunelveli",
        district: "Tirunelveli",
        type: "government",
        bloodBankCapacity: 2500,
        contact: "0462-2572736",
        lat: 8.7139,
        lng: 77.7567,
        inventory: { "A+": 160, "A-": 19, "B+": 140, "B-": 17, "O+": 240, "O-": 28, "AB+": 48, "AB-": 8 }
    },

    // Private Hospitals
    {
        id: "pvt-01",
        name: "Apollo Hospitals",
        city: "Chennai",
        district: "Chennai",
        type: "private",
        bloodBankCapacity: 6000,
        contact: "044-28293333",
        lat: 13.0069,
        lng: 80.2206,
        inventory: { "A+": 400, "A-": 55, "B+": 350, "B-": 45, "O+": 500, "O-": 65, "AB+": 120, "AB-": 22 }
    },
    {
        id: "pvt-02",
        name: "MIOT International Hospital",
        city: "Chennai",
        district: "Chennai",
        type: "private",
        bloodBankCapacity: 4000,
        contact: "044-42002288",
        lat: 13.0154,
        lng: 80.1638,
        inventory: { "A+": 280, "A-": 38, "B+": 250, "B-": 32, "O+": 380, "O-": 48, "AB+": 90, "AB-": 16 }
    },
    {
        id: "pvt-03",
        name: "Fortis Malar Hospital",
        city: "Chennai",
        district: "Chennai",
        type: "private",
        bloodBankCapacity: 3000,
        contact: "044-42892222",
        lat: 13.0339,
        lng: 80.2542,
        inventory: { "A+": 220, "A-": 30, "B+": 190, "B-": 24, "O+": 310, "O-": 38, "AB+": 72, "AB-": 12 }
    },
    {
        id: "pvt-04",
        name: "Kauvery Hospital",
        city: "Tiruchirappalli",
        district: "Tiruchirappalli",
        type: "private",
        bloodBankCapacity: 3500,
        contact: "0431-4077777",
        lat: 10.8203,
        lng: 78.6870,
        inventory: { "A+": 240, "A-": 32, "B+": 210, "B-": 26, "O+": 360, "O-": 42, "AB+": 78, "AB-": 13 }
    },
    {
        id: "pvt-05",
        name: "Meenakshi Mission Hospital",
        city: "Madurai",
        district: "Madurai",
        type: "private",
        bloodBankCapacity: 3000,
        contact: "0452-2588741",
        lat: 9.9129,
        lng: 78.1297,
        inventory: { "A+": 200, "A-": 26, "B+": 180, "B-": 22, "O+": 300, "O-": 35, "AB+": 65, "AB-": 11 }
    },
    {
        id: "pvt-06",
        name: "PSG Hospitals",
        city: "Coimbatore",
        district: "Coimbatore",
        type: "private",
        bloodBankCapacity: 3000,
        contact: "0422-2570170",
        lat: 11.0240,
        lng: 77.0028,
        inventory: { "A+": 210, "A-": 28, "B+": 190, "B-": 24, "O+": 320, "O-": 38, "AB+": 70, "AB-": 12 }
    },
    {
        id: "pvt-07",
        name: "Ganga Medical Centre",
        city: "Coimbatore",
        district: "Coimbatore",
        type: "private",
        bloodBankCapacity: 2500,
        contact: "0422-2485000",
        lat: 11.0145,
        lng: 76.9988,
        inventory: { "A+": 180, "A-": 22, "B+": 160, "B-": 20, "O+": 270, "O-": 32, "AB+": 58, "AB-": 10 }
    },
    {
        id: "pvt-08",
        name: "Sri Ramachandra Medical Centre",
        city: "Chennai",
        district: "Chennai",
        type: "private",
        bloodBankCapacity: 3500,
        contact: "044-24768027",
        lat: 13.0350,
        lng: 80.1418,
        inventory: { "A+": 250, "A-": 34, "B+": 220, "B-": 28, "O+": 370, "O-": 44, "AB+": 82, "AB-": 14 }
    },
    {
        id: "pvt-09",
        name: "CMC Vellore (Christian Medical College)",
        city: "Vellore",
        district: "Vellore",
        type: "private",
        bloodBankCapacity: 5000,
        contact: "0416-2281000",
        lat: 12.9249,
        lng: 79.1353,
        inventory: { "A+": 350, "A-": 48, "B+": 300, "B-": 40, "O+": 450, "O-": 58, "AB+": 105, "AB-": 20 }
    },
    {
        id: "pvt-10",
        name: "GKNM Hospital",
        city: "Coimbatore",
        district: "Coimbatore",
        type: "private",
        bloodBankCapacity: 2500,
        contact: "0422-2216500",
        lat: 11.0052,
        lng: 76.9613,
        inventory: { "A+": 170, "A-": 20, "B+": 150, "B-": 18, "O+": 250, "O-": 30, "AB+": 55, "AB-": 9 }
    },
]

// ──────────────────────────────────────────────
// Mock Donors across Tamil Nadu
// ──────────────────────────────────────────────
export const tnDonors: Donor[] = [
    { id: "D001", name: "Arun Kumar S.", bloodGroup: "O+", city: "Chennai", district: "Chennai", phone: "+91 98410 XXXXX", lastDonation: "2025-11-15", isAvailable: true, rating: 4.9, distance: "2.3 km", eta: "8 mins" },
    { id: "D002", name: "Priya Lakshmi R.", bloodGroup: "A+", city: "Chennai", district: "Chennai", phone: "+91 94440 XXXXX", lastDonation: "2025-10-20", isAvailable: true, rating: 5.0, distance: "3.1 km", eta: "12 mins" },
    { id: "D003", name: "Karthikeyan M.", bloodGroup: "B+", city: "Madurai", district: "Madurai", phone: "+91 97890 XXXXX", lastDonation: "2025-12-01", isAvailable: true, rating: 4.8, distance: "1.8 km", eta: "6 mins" },
    { id: "D004", name: "Meena Sundari V.", bloodGroup: "O-", city: "Coimbatore", district: "Coimbatore", phone: "+91 98650 XXXXX", lastDonation: "2025-09-10", isAvailable: true, rating: 4.7, distance: "4.5 km", eta: "18 mins" },
    { id: "D005", name: "Rajesh Kannan T.", bloodGroup: "AB+", city: "Tiruchirappalli", district: "Tiruchirappalli", phone: "+91 98430 XXXXX", lastDonation: "2025-11-28", isAvailable: true, rating: 4.9, distance: "2.0 km", eta: "9 mins" },
    { id: "D006", name: "Sangeetha D.", bloodGroup: "A-", city: "Salem", district: "Salem", phone: "+91 99420 XXXXX", lastDonation: "2025-10-05", isAvailable: false, rating: 4.6, distance: "5.2 km", eta: "22 mins" },
    { id: "D007", name: "Murugan P.", bloodGroup: "B-", city: "Vellore", district: "Vellore", phone: "+91 94430 XXXXX", lastDonation: "2025-12-10", isAvailable: true, rating: 5.0, distance: "1.5 km", eta: "5 mins" },
    { id: "D008", name: "Deepika Narayanan.", bloodGroup: "O+", city: "Thanjavur", district: "Thanjavur", phone: "+91 97860 XXXXX", lastDonation: "2025-08-22", isAvailable: true, rating: 4.8, distance: "3.8 km", eta: "15 mins" },
    { id: "D009", name: "Senthil Kumar B.", bloodGroup: "A+", city: "Tirunelveli", district: "Tirunelveli", phone: "+91 98940 XXXXX", lastDonation: "2025-11-01", isAvailable: true, rating: 4.5, distance: "6.1 km", eta: "25 mins" },
    { id: "D010", name: "Kavitha Rajan.", bloodGroup: "O+", city: "Chennai", district: "Chennai", phone: "+91 98400 XXXXX", lastDonation: "2025-12-18", isAvailable: true, rating: 4.9, distance: "1.2 km", eta: "4 mins" },
    { id: "D011", name: "Balaji Narasimhan.", bloodGroup: "B+", city: "Chennai", district: "Chennai", phone: "+91 94450 XXXXX", lastDonation: "2025-10-15", isAvailable: true, rating: 4.7, distance: "2.8 km", eta: "10 mins" },
    { id: "D012", name: "Lakshmi Priya G.", bloodGroup: "AB-", city: "Madurai", district: "Madurai", phone: "+91 97870 XXXXX", lastDonation: "2025-09-28", isAvailable: true, rating: 4.8, distance: "3.5 km", eta: "14 mins" },
]

// ──────────────────────────────────────────────
// Emergency Alerts
// ──────────────────────────────────────────────
export const tnAlerts: EmergencyAlert[] = [
    {
        id: "ALT-001",
        type: "critical_shortage",
        hospitalId: "gov-01",
        hospitalName: "Rajiv Gandhi GGH, Chennai",
        bloodGroup: "O-",
        message: "Critical O-Negative shortage. Only 12 units remaining. Expected surge due to road accident cases.",
        urgency: "critical",
        timestamp: "2 mins ago",
        status: "active",
        district: "Chennai"
    },
    {
        id: "ALT-002",
        type: "emergency_request",
        hospitalId: "pvt-04",
        hospitalName: "Kauvery Hospital, Trichy",
        bloodGroup: "AB-",
        message: "Emergency surgery requires 4 units of AB-Negative. Immediate donor match needed.",
        urgency: "critical",
        timestamp: "8 mins ago",
        status: "active",
        district: "Tiruchirappalli"
    },
    {
        id: "ALT-003",
        type: "expiry_warning",
        hospitalId: "gov-05",
        hospitalName: "Coimbatore Medical College Hospital",
        bloodGroup: "A+",
        message: "28 units of A-Positive expiring within 48 hours. Transfer required to high-demand zones.",
        urgency: "high",
        timestamp: "15 mins ago",
        status: "pending",
        district: "Coimbatore"
    },
    {
        id: "ALT-004",
        type: "donor_match",
        hospitalId: "pvt-01",
        hospitalName: "Apollo Hospitals, Chennai",
        bloodGroup: "B+",
        message: "3 compatible donors found within 5km radius for pending B+ request.",
        urgency: "standard",
        timestamp: "22 mins ago",
        status: "resolved",
        district: "Chennai"
    },
    {
        id: "ALT-005",
        type: "critical_shortage",
        hospitalId: "gov-04",
        hospitalName: "Govt. Rajaji Hospital, Madurai",
        bloodGroup: "B-",
        message: "B-Negative stock depleted. Festival season demand spike anticipated. Urgent replenishment needed.",
        urgency: "critical",
        timestamp: "35 mins ago",
        status: "active",
        district: "Madurai"
    },
    {
        id: "ALT-006",
        type: "emergency_request",
        hospitalId: "gov-07",
        hospitalName: "Govt. Medical College, Salem",
        bloodGroup: "O+",
        message: "Mass casualty incident. 10 units O+ needed urgently for accident victims.",
        urgency: "critical",
        timestamp: "1 hour ago",
        status: "active",
        district: "Salem"
    },
    {
        id: "ALT-007",
        type: "expiry_warning",
        hospitalId: "pvt-09",
        hospitalName: "CMC Vellore",
        bloodGroup: "AB+",
        message: "15 units of AB+ approaching expiry in 72 hours. Redistribution recommended.",
        urgency: "high",
        timestamp: "1.5 hours ago",
        status: "pending",
        district: "Vellore"
    },
    {
        id: "ALT-008",
        type: "donor_match",
        hospitalId: "pvt-05",
        hospitalName: "Meenakshi Mission Hospital, Madurai",
        bloodGroup: "O-",
        message: "Rare O-Negative donor identified 3.2km away. Awaiting confirmation.",
        urgency: "high",
        timestamp: "2 hours ago",
        status: "pending",
        district: "Madurai"
    },
]

// ──────────────────────────────────────────────
// AI Prediction Zone Data
// ──────────────────────────────────────────────
export const tnPredictionZones: PredictionZone[] = [
    { district: "Chennai", currentDemand: 1850, predictedDemand: 2200, changePercent: 18.9, riskLevel: "high", topShortage: "O-", season: "Monsoon" },
    { district: "Madurai", currentDemand: 980, predictedDemand: 1150, changePercent: 17.3, riskLevel: "high", topShortage: "B-", season: "Festival" },
    { district: "Coimbatore", currentDemand: 1100, predictedDemand: 1250, changePercent: 13.6, riskLevel: "medium", topShortage: "A-", season: "Summer" },
    { district: "Tiruchirappalli", currentDemand: 750, predictedDemand: 820, changePercent: 9.3, riskLevel: "medium", topShortage: "O-", season: "Monsoon" },
    { district: "Salem", currentDemand: 620, predictedDemand: 740, changePercent: 19.4, riskLevel: "high", topShortage: "O+", season: "Festival" },
    { district: "Vellore", currentDemand: 540, predictedDemand: 580, changePercent: 7.4, riskLevel: "low", topShortage: "AB-", season: "Normal" },
    { district: "Thanjavur", currentDemand: 430, predictedDemand: 510, changePercent: 18.6, riskLevel: "high", topShortage: "B+", season: "Monsoon" },
    { district: "Tirunelveli", currentDemand: 510, predictedDemand: 590, changePercent: 15.7, riskLevel: "medium", topShortage: "O-", season: "Summer" },
    { district: "Erode", currentDemand: 380, predictedDemand: 410, changePercent: 7.9, riskLevel: "low", topShortage: "A+", season: "Normal" },
    { district: "Thoothukudi", currentDemand: 310, predictedDemand: 380, changePercent: 22.6, riskLevel: "critical", topShortage: "O-", season: "Monsoon" },
    { district: "Kanchipuram", currentDemand: 420, predictedDemand: 460, changePercent: 9.5, riskLevel: "medium", topShortage: "B-", season: "Normal" },
    { district: "Dindigul", currentDemand: 280, predictedDemand: 340, changePercent: 21.4, riskLevel: "critical", topShortage: "AB-", season: "Festival" },
]

// ──────────────────────────────────────────────
// Monthly trend data for charts
// ──────────────────────────────────────────────
export const monthlyTrendData = [
    { month: "Jan", demand: 4200, supply: 4500, donations: 1200 },
    { month: "Feb", demand: 3800, supply: 4100, donations: 1100 },
    { month: "Mar", demand: 4100, supply: 3900, donations: 980 },
    { month: "Apr", demand: 4800, supply: 4200, donations: 1050 },
    { month: "May", demand: 5200, supply: 4600, donations: 1150 },
    { month: "Jun", demand: 4500, supply: 4400, donations: 1300 },
    { month: "Jul", demand: 4900, supply: 4300, donations: 1080 },
    { month: "Aug", demand: 5100, supply: 4500, donations: 1200 },
    { month: "Sep", demand: 4700, supply: 4600, donations: 1350 },
    { month: "Oct", demand: 5500, supply: 4800, donations: 1100 },
    { month: "Nov", demand: 5800, supply: 5000, donations: 1250 },
    { month: "Dec", demand: 5200, supply: 5100, donations: 1400 },
]

// ──────────────────────────────────────────────
// Blood compatibility matrix
// ──────────────────────────────────────────────
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

// ──────────────────────────────────────────────
// Helper functions
// ──────────────────────────────────────────────
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

export const tnDistricts = [...new Set(tnHospitals.map(h => h.district))]
