export type TripType = "Road" | "Mountain" | "Gravel" | "E-Bike";

export type Market = {
  id: string;
  label: string;
  tripTypes: TripType[];
  /** When false, Accept routes to pickup-only then checkout */
  deliveryAvailable: boolean;
};

export type BikeType = "Road" | "Mountain" | "Gravel" | "E-Bike";

export type Bike = {
  id: string;
  marketId: string;
  name: string;
  brand: string;
  imageUrl: string;
  type: BikeType;
  model: string;
  size: string;
  dailyPrice: number;
  /** "good" = primary matches; "fallback" = other bikes */
  matchTier: "good" | "fallback";
};

export type DeliveryWindow = {
  id: string;
  label: string;
};

export type AddonSelection = {
  helmetSize?: string;
  padSpec?: string;
  pedalType?: string;
};

export type FeaturedLocation = {
  id: string;
  label: string;
  blurb: string;
  sampleBikeCount: number;
  fromDailyPrice: number;
};

export type RentalRecord = {
  id: string;
  location: string;
  bikeName: string;
  startDate: string;
  endDate: string;
  status: "upcoming" | "past";
};

export type Weekday =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type ShopProfile = {
  id: string;
  ownerName: string;
  email: string;
  shopName: string;
  addressLine1: string;
  city: string;
  state: string;
  postalCode: string;
  logoUrl: string;
  supportPhone: string;
  serviceAreaNotes: string;
};

export type ShopBikeStatus = "active" | "inactive";

export type ShopBike = {
  id: string;
  shopId: string;
  title: string;
  brand: string;
  model: string;
  type: BikeType;
  size: string;
  description: string;
  imageUrl: string;
  status: ShopBikeStatus;
};

export type AvailabilityRule = {
  bikeId: string;
  weekday: Weekday;
  open: string;
  close: string;
  enabled: boolean;
};

export type BlockedDate = {
  bikeId: string;
  date: string;
  reason: string;
};

export type RatePlan = {
  bikeId: string;
  dailyRate: number;
  weeklyRate: number;
  deposit: number;
  seasonalNote: string;
};

export type DeliveryZone = {
  id: string;
  shopId: string;
  label: string;
  notes: string;
};

export type PaymentConnectionStatus =
  | "not_connected"
  | "pending"
  | "connected"
  | "restricted";

export type PaymentConnection = {
  provider: "stripe";
  status: PaymentConnectionStatus;
  payoutsEnabled: boolean;
  accountLabel: string;
};

export type EmbedLink = {
  id: string;
  shopId: string;
  label: string;
  url: string;
};

/** Shop home activity log — prototype rows for owner inbox */
export type ShopReservationActivity = {
  id: string;
  bikeTitle: string;
  priceLine: string;
  requestedBy: string;
  startDateDisplay: string;
  endDateDisplay: string;
};
