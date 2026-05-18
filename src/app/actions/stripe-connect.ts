"use server";

import { getMyShop, getMyShopWorkspace, updateMyShopPayment } from "@/app/actions/shops";
import type { PaymentConnection } from "@/lib/domain/types";
import {
  getAppOrigin,
  getStripeClient,
  paymentPatchFromStripeAccount,
} from "@/lib/stripe/connect";
import { revalidatePath } from "next/cache";

type ConnectFallback = {
  shopId: string;
  shopEmail: string;
  stripeAccountId?: string | null;
};

export async function startStripeConnectOnboarding(
  fallback?: ConnectFallback,
): Promise<{ ok: boolean; url?: string; stripeAccountId?: string; error?: string }> {
  const stripe = getStripeClient();
  if (!stripe) {
    return {
      ok: false,
      error: "Stripe is not configured. Add STRIPE_SECRET_KEY to .env.local and restart the dev server.",
    };
  }

  const shop = await getMyShop();
  const shopId = shop?.id ?? fallback?.shopId;
  const shopEmail = shop?.shop_email ?? fallback?.shopEmail ?? "";

  if (!shopId) {
    return { ok: false, error: "Sign in to your shop account before connecting Stripe." };
  }

  let accountId = shop?.stripe_account_id ?? fallback?.stripeAccountId ?? null;

  try {
    if (!accountId) {
      const account = await stripe.accounts.create({
        type: "express",
        country: "US",
        email: shopEmail || undefined,
        metadata: { shop_id: shopId },
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
      });
      accountId = account.id;

      if (shop) {
        const saveResult = await updateMyShopPayment({
          provider: "stripe",
          status: "pending",
          payoutsEnabled: false,
          accountLabel: "",
          stripeAccountId: accountId,
        });
        if (!saveResult.ok) return { ok: false, error: saveResult.error };
      }
    }

    const account = await stripe.accounts.retrieve(accountId);
    const origin = getAppOrigin();
    const linkType = account.details_submitted ? "account_update" : "account_onboarding";

    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      type: linkType,
      refresh_url: `${origin}/shop/payments?stripe=refresh`,
      return_url: `${origin}/shop/payments?stripe=return`,
    });

    revalidatePath("/shop/payments");
    return { ok: true, url: accountLink.url, stripeAccountId: accountId };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not start Stripe Connect.";
    return { ok: false, error: message };
  }
}

export async function syncStripeConnectAccount(
  fallback?: ConnectFallback,
): Promise<{
  ok: boolean;
  payment?: PaymentConnection;
  workspace?: Awaited<ReturnType<typeof getMyShopWorkspace>>;
  error?: string;
}> {
  const stripe = getStripeClient();
  if (!stripe) {
    return { ok: false, error: "Stripe is not configured." };
  }

  const shop = await getMyShop();
  const accountId = shop?.stripe_account_id ?? fallback?.stripeAccountId ?? null;

  if (!accountId) {
    return { ok: false, error: "No Stripe account is linked to this shop yet." };
  }

  try {
    const account = await stripe.accounts.retrieve(accountId);
    const payment: PaymentConnection = paymentPatchFromStripeAccount(account);

    if (shop) {
      const saveResult = await updateMyShopPayment(payment);
      if (!saveResult.ok) return { ok: false, error: saveResult.error };
      const workspace = await getMyShopWorkspace();
      revalidatePath("/shop/payments");
      revalidatePath("/shop");
      return { ok: true, payment, workspace: workspace ?? undefined };
    }

    revalidatePath("/shop/payments");
    return { ok: true, payment };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not refresh Stripe account status.";
    return { ok: false, error: message };
  }
}
