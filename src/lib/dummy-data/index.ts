import { formatDisplayDate, parseIsoDateOnlyLocal } from "@/lib/format-display-date";
import type {
  AvailabilityRule,
  Bike,
  BlockedDate,
  DeliveryWindow,
  DeliveryZone,
  EmbedLink,
  FeaturedLocation,
  Market,
  PaymentConnection,
  RentalRecord,
  RatePlan,
  ShopBike,
  ShopProfile,
  ShopReservationActivity,
  TripType,
  Weekday,
} from "@/lib/domain/types";

export const TRIP_TYPES: TripType[] = ["Road", "Mountain", "Gravel", "E-Bike"];

export const MARKETS: Market[] = [
  {
    id: "moab",
    label: "Moab, UT",
    tripTypes: ["Mountain", "Gravel"],
    deliveryAvailable: true,
  },
  {
    id: "bend",
    label: "Bend, OR",
    tripTypes: ["Gravel", "Road"],
    deliveryAvailable: false,
  },
  {
    id: "boulder",
    label: "Boulder, CO",
    tripTypes: ["Road", "Mountain", "Gravel"],
    deliveryAvailable: true,
  },
];

export const BIKES: Bike[] = [
  {
    id: "bike-yeti-sb130",
    marketId: "moab",
    name: "Yeti SB130",
    brand: "Yeti",
    imageUrl:
      "https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&w=1200&q=80",
    type: "Mountain",
    model: "SB130",
    size: "L",
    dailyPrice: 85,
    matchTier: "good",
  },
  {
    id: "bike-specialized-stumpjumper",
    marketId: "moab",
    name: "Stumpjumper EVO",
    brand: "Specialized",
    imageUrl:
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1200&q=80",
    type: "Mountain",
    model: "Stumpjumper EVO",
    size: "M",
    dailyPrice: 79,
    matchTier: "good",
  },
  {
    id: "bike-canyon-grail",
    marketId: "moab",
    name: "Canyon Grail",
    brand: "Canyon",
    imageUrl:
      "https://images.unsplash.com/photo-1511994298241-608e28f14fde?auto=format&fit=crop&w=1200&q=80",
    type: "Gravel",
    model: "Grail 7",
    size: "L",
    dailyPrice: 65,
    matchTier: "fallback",
  },
  {
    id: "bike-enve-mog",
    marketId: "bend",
    name: "ENVE Mog",
    brand: "ENVE",
    imageUrl:
      "https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&w=1200&q=80",
    type: "Gravel",
    model: "Mog",
    size: "56",
    dailyPrice: 95,
    matchTier: "good",
  },
  {
    id: "bike-cervelo-aspero",
    marketId: "bend",
    name: "Cervélo Áspero",
    brand: "Cervélo",
    imageUrl:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
    type: "Gravel",
    model: "Áspero 5",
    size: "54",
    dailyPrice: 88,
    matchTier: "fallback",
  },
  {
    id: "bike-specialized-roubaix",
    marketId: "boulder",
    name: "Roubaix Comp",
    brand: "Specialized",
    imageUrl:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80",
    type: "Road",
    model: "Roubaix",
    size: "58",
    dailyPrice: 72,
    matchTier: "good",
  },
];

const NO_MARKET_TRIGGERS = ["ghost", "nowhere", "nomarket", "n/a"];

/** Resolve market from free-text city / region (POC heuristic). */
export function resolveMarketFromLocation(input: string): {
  exists: boolean;
  market: Market | null;
} {
  const q = input.trim().toLowerCase();
  if (!q) return { exists: false, market: null };
  if (NO_MARKET_TRIGGERS.some((t) => q.includes(t))) {
    return { exists: false, market: null };
  }
  const hit = MARKETS.find(
    (m) =>
      m.label.toLowerCase().includes(q) ||
      q.includes(m.id) ||
      m.label.toLowerCase().replace(/\s/g, "").includes(q.replace(/\s/g, "")),
  );
  return { exists: !!hit, market: hit ?? null };
}

export function getMarketById(id: string): Market | undefined {
  return MARKETS.find((m) => m.id === id);
}

export function getBikesForMarket(
  marketId: string,
  opts?: { includeFallback: boolean },
): Bike[] {
  const list = BIKES.filter((b) => b.marketId === marketId);
  if (opts?.includeFallback) return list;
  return list.filter((b) => b.matchTier === "good");
}

export function getBikeById(id: string): Bike | undefined {
  return BIKES.find((b) => b.id === id);
}

export function getMarketsForTripType(tripType: TripType): Market[] {
  return MARKETS.filter((m) => m.tripTypes.includes(tripType));
}

/** Fake 14-day availability for calendar POC */
export function getAvailabilityForBike(
  bikeId: string,
  start: Date,
): { date: string; available: boolean }[] {
  const bike = getBikeById(bikeId);
  const seed = bike ? bike.id.length : 0;
  return Array.from({ length: 14 }, (_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const iso = d.toISOString().slice(0, 10);
    const available = (i + seed) % 5 !== 0;
    return { date: iso, available };
  });
}

export const DELIVERY_WINDOWS: DeliveryWindow[] = [
  { id: "win-morning", label: "8am – 12pm" },
  { id: "win-afternoon", label: "12pm – 5pm" },
  { id: "win-evening", label: "5pm – 8pm" },
];

export const LOCATION_TYPES = [
  "Hotel",
  "Residence",
  "Trailhead",
  "Other",
] as const;

export const RETURN_PICKUP_FEE = 35;

export const FEATURED_LOCATIONS: FeaturedLocation[] = [
  {
    id: "nw-arkansas",
    label: "Northwest Arkansas",
    blurb: "Flow trails, XC loops, and growing bike park access.",
    sampleBikeCount: 34,
    fromDailyPrice: 62,
  },
  {
    id: "richmond-va",
    label: "Richmond, VA",
    blurb: "Urban singletrack and James River tech laps.",
    sampleBikeCount: 21,
    fromDailyPrice: 55,
  },
  {
    id: "snowshoe-wv",
    label: "Snowshoe, West Virginia",
    blurb: "Bike park days with enduro and DH options.",
    sampleBikeCount: 27,
    fromDailyPrice: 78,
  },
];

const FEATURED_LOCATION_MARKET_MAP: Record<string, string> = {
  "Northwest Arkansas": "moab",
  "Richmond, VA": "boulder",
  "Snowshoe, West Virginia": "bend",
};

/**
 * Map featured marketing locations to inventory-backed demo markets so
 * one-click dashboard actions can jump directly into bike search.
 */
export function getDemoMarketForFeaturedLocation(label: string): Market | null {
  const marketId = FEATURED_LOCATION_MARKET_MAP[label];
  if (!marketId) return null;
  return getMarketById(marketId) ?? null;
}

export const DUMMY_RENTALS: RentalRecord[] = [
  {
    id: "rent-upcoming-moab",
    location: "Moab, UT",
    bikeName: "Yeti SB130",
    startDate: "2026-05-12",
    endDate: "2026-05-15",
    status: "upcoming",
  },
  {
    id: "rent-past-bend",
    location: "Bend, OR",
    bikeName: "ENVE Mog",
    startDate: "2026-03-03",
    endDate: "2026-03-06",
    status: "past",
  },
  {
    id: "rent-past-boulder",
    location: "Boulder, CO",
    bikeName: "Roubaix Comp",
    startDate: "2025-10-09",
    endDate: "2025-10-12",
    status: "past",
  },
];

export const SHOP_PROFILE_DEMO: ShopProfile = {
  id: "shop-demo",
  shopName: "Outpost Bike Shop",
  shopEmail: "hello@outpostbikeshop.example",
  addressLine1: "240 Trail Ave",
  city: "Bend",
  state: "OR",
  postalCode: "97701",
  logoUrl: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=640&q=80",
  websiteUrl: "https://outpostbikeshop.example",
  supportPhone: "(541) 555-0189",
  serviceAreaNotes: "Downtown Bend, Phil's Trailhead, and west-side hotels.",
};

export const SHOP_BIKES: ShopBike[] = [
  {
    id: "shop-bike-1",
    shopId: "shop-demo",
    title: "Santa Cruz Tallboy",
    brand: "Santa Cruz",
    model: "Tallboy C",
    type: "Mountain",
    size: "L",
    description: "Efficient trail setup with 130mm front travel and modern geo.",
    imageUrl:
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1200&q=80",
    status: "active",
  },
  {
    id: "shop-bike-2",
    shopId: "shop-demo",
    title: "Specialized Diverge",
    brand: "Specialized",
    model: "Diverge Comp",
    type: "Gravel",
    size: "56",
    description: "All-road gravel bike tuned for mixed-surface adventure rides.",
    imageUrl:
      "https://images.unsplash.com/photo-1511994298241-608e28f14fde?auto=format&fit=crop&w=1200&q=80",
    status: "active",
  },
  {
    id: "shop-bike-3",
    shopId: "shop-demo",
    title: "Trek Domane",
    brand: "Trek",
    model: "Domane SL 6",
    type: "Road",
    size: "54",
    description: "Endurance road option with comfortable fit for long days.",
    imageUrl:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80",
    status: "inactive",
  },
];

const BASE_WEEKLY_HOURS: Array<{
  weekday: Weekday;
  open: string;
  close: string;
  enabled: boolean;
}> = [
  { weekday: "monday", open: "09:00", close: "18:00", enabled: true },
  { weekday: "tuesday", open: "09:00", close: "18:00", enabled: true },
  { weekday: "wednesday", open: "09:00", close: "18:00", enabled: true },
  { weekday: "thursday", open: "09:00", close: "18:00", enabled: true },
  { weekday: "friday", open: "09:00", close: "18:00", enabled: true },
  { weekday: "saturday", open: "08:00", close: "16:00", enabled: true },
  { weekday: "sunday", open: "09:00", close: "14:00", enabled: false },
];

export const SHOP_AVAILABILITY_RULES: AvailabilityRule[] = SHOP_BIKES.flatMap((bike) =>
  BASE_WEEKLY_HOURS.map((hours) => ({ bikeId: bike.id, ...hours })),
);

/** Default weekly slots for bikes created from the shop app (matches demo bikes). */
export function createDefaultAvailabilityRulesForBike(bikeId: string): AvailabilityRule[] {
  return BASE_WEEKLY_HOURS.map((hours) => ({ bikeId, ...hours }));
}

export const SHOP_BLOCKED_DATES: BlockedDate[] = [
  { bikeId: "shop-bike-1", date: "2026-05-11", reason: "Tune-up" },
  { bikeId: "shop-bike-2", date: "2026-05-15", reason: "Group booking" },
];

export const SHOP_RATE_PLANS: RatePlan[] = [
  { bikeId: "shop-bike-1", dailyRate: 92, weeklyRate: 560, deposit: 250, seasonalNote: "Peak pricing July-August." },
  { bikeId: "shop-bike-2", dailyRate: 78, weeklyRate: 468, deposit: 200, seasonalNote: "" },
  { bikeId: "shop-bike-3", dailyRate: 68, weeklyRate: 395, deposit: 175, seasonalNote: "Road package includes lights." },
];

export const SHOP_DELIVERY_ZONES: DeliveryZone[] = [
  { id: "zone-1", shopId: "shop-demo", label: "Phil's Trailhead", notes: "Morning drop-offs only" },
  { id: "zone-2", shopId: "shop-demo", label: "Old Mill District Hotels", notes: "2-hour delivery window" },
];

export const SHOP_PAYMENT_CONNECTION: PaymentConnection = {
  provider: "stripe",
  status: "pending",
  payoutsEnabled: false,
  accountLabel: "Outpost Bike Shop Payouts",
};

export const SHOP_EMBED_LINKS: EmbedLink[] = [
  {
    id: "embed-main",
    shopId: "shop-demo",
    label: "Main booking page",
    url: "https://sendy.example.com/book/canyon-cycles",
  },
];

const ACTIVITY_RIDER = "Brett Budolfson";
const ACTIVITY_BIKE = "Santa Cruz Nomad";
const ACTIVITY_PRICE = "($200 Per Day)";

function addDaysIso(iso: string, days: number): string {
  const d = parseIsoDateOnlyLocal(iso);
  d.setDate(d.getDate() + days);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function activityRow(
  id: string,
  startDateIso: string,
  options?: { bikeTitle?: string; rentalDays?: number },
): ShopReservationActivity {
  const rentalDays = options?.rentalDays ?? 3;
  const endDateIso = addDaysIso(startDateIso, rentalDays);
  return {
    id,
    bikeTitle: options?.bikeTitle ?? ACTIVITY_BIKE,
    priceLine: ACTIVITY_PRICE,
    requestedBy: ACTIVITY_RIDER,
    startDateIso,
    endDateIso,
    startDateDisplay: formatDisplayDate(startDateIso),
    endDateDisplay: formatDisplayDate(endDateIso),
  };
}

/** Confirmed / in-progress — pickup dates span demo ranges for time filters */
export const SHOP_ACTIVITY_RESERVATIONS_TODAY: ShopReservationActivity[] = [
  activityRow("act-today-1", "2026-04-30"),
  activityRow("act-today-2", "2026-05-01"),
  activityRow("act-today-3", "2026-05-18", { bikeTitle: "Santa Cruz Tallboy" }),
];

/** Pending owner approval */
export const SHOP_ACTIVITY_OPEN_REQUESTS: ShopReservationActivity[] = [
  activityRow("act-open-1", "2026-04-28"),
  activityRow("act-open-2", "2026-04-30"),
  activityRow("act-open-3", "2026-05-15"),
  activityRow("act-open-4", "2026-07-01"),
];

const SHOP_BIKE_GALLERY: Record<string, string[]> = {
  "shop-bike-1": [
    "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1544191696-102dbdaeeaa0?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1518655048521-f130df041f66?auto=format&fit=crop&w=1400&q=80",
  ],
  "shop-bike-2": [
    "https://images.unsplash.com/photo-1511994298241-608e28f14fde?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1571333250630-f0230c320b6d?auto=format&fit=crop&w=1400&q=80",
  ],
  "shop-bike-3": [
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&w=1400&q=80",
  ],
};

export function getShopBikeById(id: string): ShopBike | undefined {
  return SHOP_BIKES.find((bike) => bike.id === id);
}

export function getShopBikeGallery(id: string): string[] {
  const bike = getShopBikeById(id);
  if (!bike) return [];
  if (bike.photoUrls?.length) return bike.photoUrls;
  const gallery = SHOP_BIKE_GALLERY[id];
  if (gallery?.length) return gallery;
  return [bike.imageUrl];
}

export function getShopBikesByStatus(status: "all" | "active" | "inactive"): ShopBike[] {
  if (status === "all") return SHOP_BIKES;
  return SHOP_BIKES.filter((bike) => bike.status === status);
}

export function getAvailabilityRulesForBike(bikeId: string): AvailabilityRule[] {
  return SHOP_AVAILABILITY_RULES.filter((rule) => rule.bikeId === bikeId);
}

export function getBlockedDatesForBike(bikeId: string): BlockedDate[] {
  return SHOP_BLOCKED_DATES.filter((entry) => entry.bikeId === bikeId);
}

function weekdayIndex(weekday: Weekday): number {
  const map: Record<Weekday, number> = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  };
  return map[weekday];
}

export function getShopBikeAvailabilityCalendar(
  bikeId: string,
  startDateIso?: string,
  days = 14,
): Array<{ date: string; available: boolean; reason?: string }> {
  const rules = getAvailabilityRulesForBike(bikeId);
  const blocked = new Set(getBlockedDatesForBike(bikeId).map((entry) => entry.date));
  const start = startDateIso ? new Date(`${startDateIso}T00:00:00`) : new Date();
  const safeDays = Math.max(1, days);

  return Array.from({ length: safeDays }, (_, index) => {
    const d = new Date(start);
    d.setDate(start.getDate() + index);
    const iso = d.toISOString().slice(0, 10);
    const dayRule = rules.find((rule) => weekdayIndex(rule.weekday) === d.getDay());
    const availableByRule = dayRule ? dayRule.enabled : false;
    const isBlocked = blocked.has(iso);
    return {
      date: iso,
      available: availableByRule && !isBlocked,
      reason: isBlocked ? "Blocked date" : undefined,
    };
  });
}

export function getRatePlanForBike(bikeId: string): RatePlan | undefined {
  return SHOP_RATE_PLANS.find((plan) => plan.bikeId === bikeId);
}

export function getShopProfileByShopId(shopId: string): ShopProfile | undefined {
  if (shopId === SHOP_PROFILE_DEMO.id) return SHOP_PROFILE_DEMO;
  return undefined;
}
