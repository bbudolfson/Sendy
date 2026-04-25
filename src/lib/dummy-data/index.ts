import type {
  Bike,
  DeliveryWindow,
  FeaturedLocation,
  Market,
  RentalRecord,
  TripType,
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
