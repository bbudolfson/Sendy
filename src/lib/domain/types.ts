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
