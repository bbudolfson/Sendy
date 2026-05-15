import type { DbBike, DbMarket, DbReservation, DbShop } from "@/lib/supabase/database.types";
import type {
  PaymentConnection,
  RatePlan,
  ShopBike,
  ShopProfile,
} from "@/lib/domain/types";

export function shopRowToProfile(row: DbShop): ShopProfile {
  return {
    id: row.id,
    shopName: row.shop_name,
    shopEmail: row.shop_email,
    addressLine1: row.address_line1,
    city: row.city,
    state: row.state,
    postalCode: row.postal_code,
    logoUrl: row.logo_url,
    websiteUrl: row.website_url,
    supportPhone: row.support_phone,
    serviceAreaNotes: row.service_area_notes,
  };
}

export function shopRowToPayment(row: DbShop): PaymentConnection {
  return {
    provider: row.payment_provider,
    status: row.payment_status,
    payoutsEnabled: row.payouts_enabled,
    accountLabel: row.payment_account_label,
  };
}

export function bikeRowToShopBike(row: DbBike): ShopBike {
  return {
    id: row.id,
    shopId: row.shop_id,
    title: row.title,
    brand: row.brand,
    model: row.model,
    type: row.bike_type,
    size: row.size,
    description: row.description,
    imageUrl: row.image_url,
    photoUrls: row.photo_urls?.length ? row.photo_urls : undefined,
    status: row.status,
  };
}

export function bikeRowToRatePlan(row: DbBike): RatePlan {
  return {
    bikeId: row.id,
    dailyRate: Number(row.daily_rate),
    halfDayRate: row.half_day_rate != null ? Number(row.half_day_rate) : undefined,
    weeklyRate: Number(row.weekly_rate),
    deposit: Number(row.deposit),
    seasonalNote: row.seasonal_note,
  };
}

export function shopProfileToUpdate(row: ShopProfile, marketId?: string | null) {
  return {
    shop_name: row.shopName,
    shop_email: row.shopEmail,
    address_line1: row.addressLine1,
    city: row.city,
    state: row.state,
    postal_code: row.postalCode,
    logo_url: row.logoUrl,
    website_url: row.websiteUrl,
    support_phone: row.supportPhone,
    service_area_notes: row.serviceAreaNotes,
    ...(marketId !== undefined ? { market_id: marketId } : {}),
  };
}

export function shopBikeToInsert(
  bike: ShopBike,
  rates: Pick<RatePlan, "dailyRate" | "halfDayRate" | "weeklyRate" | "deposit" | "seasonalNote">,
  marketId: string | null,
) {
  const isUuid = /^[0-9a-f-]{36}$/i.test(bike.id);
  return {
    ...(isUuid ? { id: bike.id } : {}),
    shop_id: bike.shopId,
    market_id: marketId,
    title: bike.title,
    brand: bike.brand,
    model: bike.model,
    bike_type: bike.type,
    size: bike.size,
    description: bike.description,
    image_url: bike.imageUrl,
    photo_urls: bike.photoUrls ?? [],
    status: bike.status,
    daily_rate: rates.dailyRate,
    half_day_rate: rates.halfDayRate ?? null,
    weekly_rate: rates.weeklyRate,
    deposit: rates.deposit,
    seasonal_note: rates.seasonalNote,
  };
}

export type PublicBikeListing = ShopBike & {
  dailyRate: number;
  marketId: string | null;
  shopName: string;
};

export function bikeToListing(row: DbBike, shopName: string): PublicBikeListing {
  return {
    ...bikeRowToShopBike(row),
    dailyRate: Number(row.daily_rate),
    marketId: row.market_id,
    shopName,
  };
}

export function marketRowToDomain(row: DbMarket) {
  return {
    id: row.id,
    label: row.label,
    tripTypes: row.trip_types as ("Road" | "Mountain" | "Gravel" | "E-Bike")[],
    deliveryAvailable: row.delivery_available,
  };
}

export function reservationToRental(row: DbReservation, bikeTitle: string, location: string) {
  return {
    id: row.id,
    location,
    bikeName: bikeTitle,
    startDate: row.start_date,
    endDate: row.end_date,
    status: (row.end_date < new Date().toISOString().slice(0, 10) ? "past" : "upcoming") as
      | "upcoming"
      | "past",
  };
}
