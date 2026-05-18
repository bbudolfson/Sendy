import type { PaymentConnectionStatus } from "@/lib/domain/types";
import Stripe from "stripe";

export function getStripeClient(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

export function getAppOrigin(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

export function paymentStatusFromStripeAccount(account: Stripe.Account): PaymentConnectionStatus {
  if (account.requirements?.disabled_reason) return "restricted";
  if (account.charges_enabled && account.payouts_enabled) return "connected";
  if (account.details_submitted || account.charges_enabled) return "pending";
  return "not_connected";
}

export function paymentPatchFromStripeAccount(account: Stripe.Account) {
  return {
    provider: "stripe" as const,
    status: paymentStatusFromStripeAccount(account),
    payoutsEnabled: Boolean(account.payouts_enabled),
    accountLabel:
      account.business_profile?.name?.trim() ||
      account.settings?.dashboard?.display_name?.trim() ||
      account.email ||
      account.id,
    stripeAccountId: account.id,
  };
}
