import type { PaymentConnection, ShopBike, ShopProfile } from "@/lib/domain/types";

/** Renters can see who/where the shop is — name + mailing address. */
export function isShopProfileReadyForRenters(profile: ShopProfile): boolean {
  return !!(
    profile.shopName.trim() &&
    profile.addressLine1.trim() &&
    profile.city.trim() &&
    profile.state.trim() &&
    profile.postalCode.trim()
  );
}

export function isShopPaymentReadyForRentals(payment: PaymentConnection): boolean {
  return payment.status === "connected" && payment.payoutsEnabled;
}

export function isShopFleetReady(inventory: ShopBike[]): boolean {
  return inventory.length >= 1;
}

export function isShopReservationsDashboardUnlocked(profile: ShopProfile, payment: PaymentConnection, inventory: ShopBike[]): boolean {
  return (
    isShopProfileReadyForRenters(profile) &&
    isShopPaymentReadyForRentals(payment) &&
    isShopFleetReady(inventory)
  );
}
