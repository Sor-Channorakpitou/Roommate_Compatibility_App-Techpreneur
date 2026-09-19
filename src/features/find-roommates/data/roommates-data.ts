import sovannImg from "@/assets/images/browse/sovann.jpg"
import sreynochImg from "@/assets/images/browse/sreynoch.jpg"
import sopheakImg from "@/assets/images/browse/sopheak.jpg"
import minimalistStudioImg from "@/assets/images/browse/minimalist-studio.jpg"
import bophaImg from "@/assets/images/browse/bopha.jpg"
import riversideImg from "@/assets/images/browse/riverside.jpg"
import sereyrothAvatar from "@/assets/images/member-sereyroth.jpg"

export type ListingType = "roommate" | "place" | "has_room"

export type HabitComparison = {
  habit: string
  you: string
  them: string
  match: boolean
}

export type BreakdownItem = {
  category: string
  score: number
  detail: string
}

export type RoommateListing = {
  id: string
  type: ListingType
  badgeLabel: string // "ROOM SEEKER" | "PLACE AVAILABLE" | "HAS EXTRA ROOM"
  name: string
  age?: number
  matchScore?: number
  matchRatingText?: string // "EXCEPTIONAL MATCH", "GREAT HARMONY", etc.
  priceDisplay: string
  priceMin: number
  priceMax: number
  subtitle: string // "UX Designer • Seeking 1 roommate"
  location: string // "BKK 1"
  availableDate: string // "Avail Nov 15"
  quote: string
  tags: string[]
  image: string
  avatarImage?: string
  connected?: boolean
  roommatesCountText?: string // e.g. "2 current roommates • Creative & balanced rhythm"
  housingType: "all" | "private-bath" | "entire-flat" | "room-available"
  areaCategory: "bkk" | "daun-penh" | "russian-market" | "toul-kork"
  lifestyleRhythms: string[] // ["early-bird", "quiet-hours", "non-smoker", "pet-friendly"]
  moveInHorizon: "anytime" | "next-30-days" | "2-3-months"
  habitComparisons: HabitComparison[]
  breakdown: BreakdownItem[]
  bio?: string
}

export type RoommateProfile = RoommateListing

export type FilterState = {
  categoryTab: "all" | "roommates" | "places"
  searchQuery: string
  sortBy: "best-match" | "budget" | "move-in"
  housingType: string
  area: string
  budgetRange: "any" | "under-250" | "250-400" | "400-plus"
  lifestyleRhythms: string[]
  moveInHorizon: string
}

export const HOUSING_TYPE_OPTIONS = [
  { id: "all", label: "All arrangements" },
  { id: "private-bath", label: "Private room with bath" },
  { id: "entire-flat", label: "Entire flat to co-lease" },
  { id: "room-available", label: "Room available in existing home" },
]

export const AREA_OPTIONS = [
  { id: "all", label: "All Phnom Penh areas" },
  { id: "bkk", label: "BKK 1 & BKK 2" },
  { id: "daun-penh", label: "Daun Penh / Riverside" },
  { id: "russian-market", label: "Toul Tom Poung (Russian Mkt)" },
  { id: "toul-kork", label: "Toul Kork" },
]

export const BUDGET_OPTIONS = [
  { id: "any", label: "Any" },
  { id: "under-250", label: "< $250" },
  { id: "250-400", label: "$250–$400" },
  { id: "400-plus", label: "$400+" },
]

export const LIFESTYLE_OPTIONS = [
  { id: "early-bird", label: "Early bird" },
  { id: "quiet-hours", label: "Quiet hours" },
  { id: "non-smoker", label: "Non-smoker" },
  { id: "pet-friendly", label: "Pet friendly" },
]

export const MOVE_IN_OPTIONS = [
  { id: "anytime", label: "Anytime / Flexible" },
  { id: "next-30-days", label: "Next 30 days (Nov 2026)" },
  { id: "2-3-months", label: "Within 2–3 months" },
]

export const ROOMMATES_LISTINGS: RoommateListing[] = [
  {
    id: "sovann-24",
    type: "roommate",
    badgeLabel: "ROOM SEEKER",
    name: "Sovann",
    age: 24,
    matchScore: 94,
    matchRatingText: "EXCEPTIONAL MATCH",
    priceDisplay: "$220–350/mo",
    priceMin: 220,
    priceMax: 350,
    subtitle: "UX Designer • Seeking 1 roommate",
    location: "BKK 1",
    availableDate: "Avail Nov 15",
    quote: '"Quiet evening reader, tidy common areas, loves making drip coffee."',
    tags: ["Early riser", "Quiet hours", "Non-smoker"],
    image: sovannImg,
    avatarImage: sovannImg,
    housingType: "all",
    areaCategory: "bkk",
    lifestyleRhythms: ["early-bird", "quiet-hours", "non-smoker"],
    moveInHorizon: "next-30-days",
    bio: "Senior UI/UX designer working in BKK 1. Early riser who values calm mornings, mindful shared spaces, and clean countertops.",
    habitComparisons: [
      {
        habit: "Sleep schedule",
        you: "Early bird (10pm)",
        them: "Early bird (10pm)",
        match: true,
      },
      {
        habit: "Cleanliness",
        you: "Tidy kitchen",
        them: "Tidy daily",
        match: true,
      },
      {
        habit: "Guest frequency",
        you: "Rarely",
        them: "Quiet weekdays",
        match: true,
      },
      {
        habit: "Smoking",
        you: "Non-smoker",
        them: "Non-smoker",
        match: true,
      },
    ],
    breakdown: [
      { category: "Sleep & Wake Rhythm", score: 98, detail: "Both wind down before 10:30 PM with zero night noise" },
      { category: "Cleanliness & Chores", score: 92, detail: "Immediate dish cleaning & shared chore roster" },
      { category: "Visitor Policy", score: 94, detail: "Low visitor footprint during workdays" },
      { category: "Quiet Focus Hours", score: 92, detail: "Respectful silent work environment" },
    ],
  },
  {
    id: "sreynoch-28",
    type: "roommate",
    badgeLabel: "ROOM SEEKER",
    name: "Sreynoch",
    age: 28,
    matchScore: 89,
    matchRatingText: "GREAT HARMONY",
    priceDisplay: "$260–400/mo",
    priceMin: 260,
    priceMax: 400,
    subtitle: "Content Producer • Seeking place/roomie",
    location: "Daun Penh",
    availableDate: "Avail Dec 1",
    quote: '"Sociable on weekends, respectful of deep work hours during the..."',
    tags: ["Flexible schedule", "Tidy", "Social weekends"],
    image: sreynochImg,
    avatarImage: sreynochImg,
    housingType: "private-bath",
    areaCategory: "daun-penh",
    lifestyleRhythms: ["quiet-hours", "non-smoker"],
    moveInHorizon: "2-3-months",
    bio: "Creative producer at a digital studio in Daun Penh. Calm weekday rhythm, creative weekend adventures, respectful of privacy.",
    habitComparisons: [
      {
        habit: "Sleep schedule",
        you: "Early bird (10pm)",
        them: "Flexible (11pm)",
        match: true,
      },
      {
        habit: "Cleanliness",
        you: "Tidy kitchen",
        them: "Tidy common spaces",
        match: true,
      },
      {
        habit: "Guest frequency",
        you: "Rarely",
        them: "Social weekends",
        match: true,
      },
      {
        habit: "Smoking",
        you: "Non-smoker",
        them: "Non-smoker",
        match: true,
      },
    ],
    breakdown: [
      { category: "Sleep & Wake Rhythm", score: 88, detail: "Complementary daytime focus and quiet nighttime habits" },
      { category: "Cleanliness & Chores", score: 90, detail: "Weekly rotating cleaning plan & spotless kitchen" },
      { category: "Visitor Policy", score: 86, detail: "Advance notice given for weekend friends" },
      { category: "Quiet Focus Hours", score: 92, detail: "Headphones and silent mode during focus sessions" },
    ],
  },
  {
    id: "sopheak-chan-26",
    type: "roommate",
    badgeLabel: "ROOM SEEKER",
    name: "Sopheak Chan",
    age: 26,
    matchScore: 91,
    matchRatingText: "EXCEPTIONAL MATCH",
    priceDisplay: "$280–400/mo",
    priceMin: 280,
    priceMax: 400,
    subtitle: "Software Dev • Seeking 1–2 roomies",
    location: "Toul Tom Poung",
    availableDate: "Avail Dec 1",
    quote: '"WFH engineer during weekdays. Love brewing pour-over coffee,..."',
    tags: ["Early riser", "WFH setup", "Non-smoker"],
    image: sopheakImg,
    avatarImage: sopheakImg,
    housingType: "all",
    areaCategory: "russian-market",
    lifestyleRhythms: ["early-bird", "quiet-hours", "non-smoker"],
    moveInHorizon: "2-3-months",
    bio: "Fullstack software engineer working remotely. Quiet during the day, passionate about pour-over specialty coffee and acoustic music.",
    habitComparisons: [
      {
        habit: "Sleep schedule",
        you: "Early bird (10pm)",
        them: "Early bird (10:30pm)",
        match: true,
      },
      {
        habit: "Cleanliness",
        you: "Tidy kitchen",
        them: "Immaculate workspace",
        match: true,
      },
      {
        habit: "Guest frequency",
        you: "Rarely",
        them: "Quiet weekdays",
        match: true,
      },
      {
        habit: "Smoking",
        you: "Non-smoker",
        them: "Non-smoker",
        match: true,
      },
    ],
    breakdown: [
      { category: "Sleep & Wake Rhythm", score: 93, detail: "Synchronized circadian rhythm and silent morning coffee" },
      { category: "Cleanliness & Chores", score: 92, detail: "Tidy shared countertops & mindful appliance use" },
      { category: "Visitor Policy", score: 88, detail: "Low visitor footprint during WFH hours" },
      { category: "Quiet Focus Hours", score: 91, detail: "Dedicated noise-cancelled work periods" },
    ],
  },
  {
    id: "minimalist-studio",
    type: "place",
    badgeLabel: "PLACE AVAILABLE",
    name: "Minimalist Studio Room w/ Desk",
    priceDisplay: "$260/mo",
    priceMin: 260,
    priceMax: 260,
    subtitle: "Private room • Toul Kork",
    location: "Toul Kork",
    availableDate: "Avail Immediately",
    quote: '"Spacious private room in an eco-conscious 3BR townhouse. Shared..."',
    tags: ["Furnished", "Quiet hours 10pm", "Solar water"],
    image: minimalistStudioImg,
    avatarImage: minimalistStudioImg,
    connected: true,
    housingType: "room-available",
    areaCategory: "toul-kork",
    lifestyleRhythms: ["quiet-hours", "non-smoker"],
    moveInHorizon: "next-30-days",
    bio: "Private master suite with en-suite desk and private balcony in a green townhouse near CADT and Toul Kork market. Shared solar power and fiber internet.",
    habitComparisons: [
      {
        habit: "Quiet hours",
        you: "10:00 PM",
        them: "10:00 PM strictly observed",
        match: true,
      },
      {
        habit: "House cleanliness",
        you: "Tidy kitchen",
        them: "Weekly professional deep clean",
        match: true,
      },
      {
        habit: "Utilities",
        you: "Even split",
        them: "Solar hot water & wifi included",
        match: true,
      },
      {
        habit: "Smoking",
        you: "Non-smoker",
        them: "Strictly smoke-free property",
        match: true,
      },
    ],
    breakdown: [
      { category: "Acoustic Insulation", score: 95, detail: "Double-glazed balcony doors with zero street echo" },
      { category: "Household Maintenance", score: 96, detail: "Professional cleaning twice monthly" },
      { category: "Natural Light & Ventilation", score: 94, detail: "South-facing panoramic garden view" },
      { category: "Co-Living Norms", score: 90, detail: "Clear quiet hours & chore agreements" },
    ],
  },
  {
    id: "bopha-lim-27",
    type: "has_room",
    badgeLabel: "HAS EXTRA ROOM",
    name: "Bopha Lim",
    age: 27,
    matchScore: 81,
    matchRatingText: "STRONG MATCH",
    priceDisplay: "$300–450/mo",
    priceMin: 300,
    priceMax: 450,
    subtitle: "Archivist • Has 2BR in BKK 2",
    location: "BKK 2",
    availableDate: "Available Dec 1",
    quote: '"Looking for a kindred soul to share my sunlit 2BR apartment. Into..."',
    tags: ["Non-smoker", "Tidy", "Social weekends"],
    image: bophaImg,
    avatarImage: sereyrothAvatar,
    housingType: "room-available",
    areaCategory: "bkk",
    lifestyleRhythms: ["quiet-hours", "non-smoker"],
    moveInHorizon: "2-3-months",
    bio: "Archivist and researcher with a spacious 2-bedroom sanctuary in BKK 2. Beautiful hardwood floors, reading balcony, and plenty of plants.",
    habitComparisons: [
      {
        habit: "Sleep schedule",
        you: "Early bird (10pm)",
        them: "Flexible (11:30pm)",
        match: true,
      },
      {
        habit: "Cleanliness",
        you: "Tidy kitchen",
        them: "Tidy daily + weekly maid",
        match: true,
      },
      {
        habit: "Guest frequency",
        you: "Rarely",
        them: "Quiet dinner with friends",
        match: true,
      },
      {
        habit: "Smoking",
        you: "Non-smoker",
        them: "Non-smoker",
        match: true,
      },
    ],
    breakdown: [
      { category: "Sleep & Wake Rhythm", score: 80, detail: "Quiet bedrooms on opposite wings of the flat" },
      { category: "Cleanliness & Chores", score: 85, detail: "Included bi-weekly housekeeping service" },
      { category: "Visitor Policy", score: 82, detail: "Intimate dinner guests welcome on Friday/Saturday" },
      { category: "Quiet Focus Hours", score: 78, detail: "Peaceful ambient living room with book collection" },
    ],
  },
  {
    id: "riverside-colonial-flat",
    type: "place",
    badgeLabel: "PLACE AVAILABLE",
    name: "Riverside Colonial Flat",
    priceDisplay: "$380/mo",
    priceMin: 380,
    priceMax: 380,
    subtitle: "Daun Penh • Ready Jan 1",
    location: "Daun Penh",
    availableDate: "Ready Jan 1",
    roommatesCountText: "2 current roommates • Creative & balanced rhythm",
    quote: "High ceilings, tiled French balcony overlooking peaceful side street, handcrafted wooden fixtures, and generous natural airflow.",
    tags: ["Ensuite bath", "Pet friendly", "Cleaning shared"],
    image: riversideImg,
    avatarImage: riversideImg,
    housingType: "entire-flat",
    areaCategory: "daun-penh",
    lifestyleRhythms: ["pet-friendly", "non-smoker"],
    moveInHorizon: "2-3-months",
    bio: "Restored French colonial flat facing the serene river breeze in Daun Penh. Features original vintage encaustic tiles, 4-meter ceilings, and lush veranda garden.",
    habitComparisons: [
      {
        habit: "Noise & Vibe",
        you: "Quiet sanctuary",
        them: "Serene acoustic riverfront ambient",
        match: true,
      },
      {
        habit: "Cleanliness",
        you: "Tidy kitchen",
        them: "Equal chore rotation & shared kitchen",
        match: true,
      },
      {
        habit: "Pets",
        you: "Pet friendly",
        them: "Well-behaved cat welcome",
        match: true,
      },
      {
        habit: "Smoking",
        you: "Non-smoker",
        them: "Non-smoker interior (balcony only)",
        match: true,
      },
    ],
    breakdown: [
      { category: "Architectural Charm", score: 98, detail: "Original 1930s colonial architecture & tall ceilings" },
      { category: "Roommate Balance", score: 91, detail: "Two respectful professionals in media & architecture" },
      { category: "Location & Amenities", score: 95, detail: "Steps from riverside cafes, CADT shuttle, and bakeries" },
      { category: "Shared Agreement", score: 90, detail: "Signed domestic charter for bills & guest notice" },
    ],
  },
]
