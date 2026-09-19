export type RoommateProfile = {
  id: string
  name: string
  age: number
  matchScore: number
  area: string
  priceMin: number
  priceMax: number
  priceDisplay: string
  availableDate: string
  moveInMonth: "October 2026" | "November 2026" | "December 2026"
  tags: string[]
  initials: string
  hasRoom?: boolean
  bio?: string
  occupation?: string
  breakdown: {
    category: string
    score: number
    detail: string
  }[]
}

export type FilterState = {
  area: string
  budget: string
  moveInDate: string
}

export const AREA_OPTIONS = [
  "All areas",
  "BKK1",
  "BKK2",
  "Daun Penh",
  "Toul Tom Poung",
  "Russian Market",
  "Toul Kork",
] as const

export const BUDGET_OPTIONS = [
  "Any budget",
  "Under $200",
  "$200–$300",
  "$300–$400",
  "$400–$500",
  "$500+",
] as const

export const MOVE_IN_DATE_OPTIONS = [
  "Any date",
  "October 2026",
  "November 2026",
  "December 2026",
] as const

export const ROOMMATES_DATA: RoommateProfile[] = [
  {
    id: "malis-heng",
    name: "Malis Heng",
    age: 28,
    matchScore: 91,
    area: "Daun Penh",
    priceMin: 350,
    priceMax: 500,
    priceDisplay: "$350–500/mo",
    availableDate: "Available Oct 1, 2026",
    moveInMonth: "October 2026",
    tags: ["Early bird", "Tidy kitchen", "Non-smoker"],
    initials: "MH",
    hasRoom: false,
    bio: "Senior UI/UX designer working in Daun Penh. Early riser who enjoys quiet morning coffee and keeping common areas spotless.",
    occupation: "UI/UX Designer",
    breakdown: [
      {
        category: "Sleep & Wake Rhythm",
        score: 95,
        detail: "10:30 PM - 6:30 AM schedule alignment",
      },
      {
        category: "Cleanliness & Chores",
        score: 92,
        detail: "Immediate dish cleaning & shared chore roster",
      },
      {
        category: "Visitor Policy",
        score: 88,
        detail: "Weekend guests welcome with 24h notice",
      },
      {
        category: "Quiet Focus Hours",
        score: 90,
        detail: "Quiet study window from 9:30 PM",
      },
    ],
  },
  {
    id: "sopheak-chan",
    name: "Sopheak Chan",
    age: 26,
    matchScore: 87,
    area: "BKK1",
    priceMin: 300,
    priceMax: 400,
    priceDisplay: "$300–400/mo",
    availableDate: "Available Nov 1, 2026",
    moveInMonth: "November 2026",
    tags: ["Early bird", "Quiet weekdays", "Works from home"],
    initials: "SC",
    hasRoom: false,
    bio: "Software developer working remotely from BKK1. Value clear communication and organized living spaces.",
    occupation: "Software Engineer",
    breakdown: [
      {
        category: "Sleep & Wake Rhythm",
        score: 90,
        detail: "11:00 PM - 7:00 AM regular schedule",
      },
      {
        category: "Cleanliness & Chores",
        score: 85,
        detail: "Clean kitchen policy & organized workspace",
      },
      {
        category: "Visitor Policy",
        score: 86,
        detail: "Low visitor footprint during work hours",
      },
      {
        category: "Quiet Focus Hours",
        score: 88,
        detail: "Work-from-home focus time during daytime",
      },
    ],
  },
  {
    id: "bopha-lim",
    name: "Bopha Lim",
    age: 27,
    matchScore: 78,
    area: "BKK2",
    priceMin: 300,
    priceMax: 450,
    priceDisplay: "$300–450/mo",
    availableDate: "Available Oct 15, 2026",
    moveInMonth: "October 2026",
    tags: ["Has a room", "Non-smoker", "Social weekends"],
    initials: "BL",
    hasRoom: true,
    bio: "Already signed a 2-bedroom apartment in BKK2 with balcony and pool. Looking for a respectful roommate to share the sanctuary.",
    occupation: "Marketing Lead",
    breakdown: [
      {
        category: "Sleep & Wake Rhythm",
        score: 80,
        detail: "11:30 PM - 7:30 AM cadence",
      },
      {
        category: "Cleanliness & Chores",
        score: 76,
        detail: "Weekly maid service included in rent",
      },
      {
        category: "Visitor Policy",
        score: 80,
        detail: "Occasional dinner gatherings on weekends",
      },
      {
        category: "Quiet Focus Hours",
        score: 75,
        detail: "Flexible study and relaxation spaces",
      },
    ],
  },
  {
    id: "dara-keo",
    name: "Dara Keo",
    age: 24,
    matchScore: 73,
    area: "Toul Tom Poung",
    priceMin: 250,
    priceMax: 350,
    priceDisplay: "$250–350/mo",
    availableDate: "Available Nov 15, 2026",
    moveInMonth: "November 2026",
    tags: ["Night owl", "Non-smoker", "Keeps to himself"],
    initials: "DK",
    hasRoom: false,
    bio: "Architecture master's student near Russian Market. Quiet, respectful of boundaries, and studious.",
    occupation: "Architecture Student",
    breakdown: [
      {
        category: "Sleep & Wake Rhythm",
        score: 72,
        detail: "1:00 AM - 8:30 AM night owl schedule",
      },
      {
        category: "Cleanliness & Chores",
        score: 75,
        detail: "Tidy personal studio space",
      },
      {
        category: "Visitor Policy",
        score: 78,
        detail: "Rare visitors, values personal space",
      },
      {
        category: "Quiet Focus Hours",
        score: 68,
        detail: "Late night drafting & laptop sessions",
      },
    ],
  },
  {
    id: "virak-prum",
    name: "Virak Prum",
    age: 25,
    matchScore: 65,
    area: "Russian Market",
    priceMin: 200,
    priceMax: 300,
    priceDisplay: "$200–300/mo",
    availableDate: "Available Oct 1, 2026",
    moveInMonth: "October 2026",
    tags: ["Very tidy", "No guests", "Quiet only"],
    initials: "VP",
    hasRoom: false,
    bio: "Accountant seeking a very quiet, serene apartment near Russian Market. Extremely clean and organized.",
    occupation: "Accountant",
    breakdown: [
      {
        category: "Sleep & Wake Rhythm",
        score: 70,
        detail: "10:00 PM - 6:00 AM strict sleep window",
      },
      {
        category: "Cleanliness & Chores",
        score: 95,
        detail: "Impeccable cleanliness standards",
      },
      {
        category: "Visitor Policy",
        score: 45,
        detail: "Prefers no outside guests",
      },
      {
        category: "Quiet Focus Hours",
        score: 90,
        detail: "Silent environment after 9:30 PM",
      },
    ],
  },
  {
    id: "narith-sok",
    name: "Narith Sok",
    age: 23,
    matchScore: 58,
    area: "Toul Kork",
    priceMin: 150,
    priceMax: 250,
    priceDisplay: "$150–250/mo",
    availableDate: "Available Dec 1, 2026",
    moveInMonth: "December 2026",
    tags: ["Flexible schedule", "Social", "Occasional smoker"],
    initials: "NS",
    hasRoom: false,
    bio: "Final year student at RUPP. Easy-going, friendly, looking for affordable housing near Toul Kork.",
    occupation: "Media Student",
    breakdown: [
      {
        category: "Sleep & Wake Rhythm",
        score: 60,
        detail: "Flexible sleeping routine",
      },
      {
        category: "Cleanliness & Chores",
        score: 62,
        detail: "Casual weekly cleaning",
      },
      {
        category: "Visitor Policy",
        score: 65,
        detail: "Social atmosphere with friends",
      },
      {
        category: "Quiet Focus Hours",
        score: 50,
        detail: "Flexible focus times",
      },
    ],
  },
]
