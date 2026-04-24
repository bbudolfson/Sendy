import type { Bike, DeliveryWindow, Market, TripType } from "@/lib/domain/types";

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
