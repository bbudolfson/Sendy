"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PocButton, PocCard, PocInput, PocLabel, PocMuted, PocStack } from "@/components/poc-ui";
import { startStripeConnectOnboarding, syncStripeConnectAccount } from "@/app/actions/stripe-connect";
import { useShopSession } from "@/context/shop-session";
import { useSupabase } from "@/context/supabase-provider";
import type { PaymentConnectionStatus } from "@/lib/domain/types";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import pageStyles from "../shop-pages.module.css";
import blockStyles from "./blocks.module.css";

const shopContentCardClass = blockStyles.shopContentCard;

function humanizePaymentStatus(status: PaymentConnectionStatus): string {
  return status.replace(/_/g, " ");
}

function statusDescription(status: PaymentConnectionStatus): string {
  switch (status) {
    case "connected":
      return "Stripe is connected. You can accept rider payments and receive payouts.";
    case "pending":
      return "Your Stripe setup is incomplete. Continue onboarding to start accepting payments.";
    case "restricted":
      return "Stripe needs additional information before payouts can be enabled.";
    default:
      return "Connect your Stripe account to accept payments from riders and receive payouts.";
  }
}

export function SettingsPaymentsCard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stripeReturn = searchParams.get("stripe");
  const { configured } = useSupabase();
  const { session, loadWorkspace, patchShopPayment } = useShopSession();
  const [pending, setPending] = useState(false);
  const [syncing, setSyncing] = useState(
    stripeReturn === "return" || stripeReturn === "refresh",
  );
  const [error, setError] = useState<string | null>(null);

  const connectFallback = useMemo(
    () => ({
      shopId: session.profile.id,
      shopEmail: session.profile.shopEmail,
      stripeAccountId: session.payment.stripeAccountId,
    }),
    [session.payment.stripeAccountId, session.profile.id, session.profile.shopEmail],
  );

  const usePersistedShop = isSupabaseConfigured() && configured;

  useEffect(() => {
    if (stripeReturn !== "return" && stripeReturn !== "refresh") return;

    let cancelled = false;

    void (async () => {
      setSyncing(true);
      setError(null);
      const result = await syncStripeConnectAccount(usePersistedShop ? undefined : connectFallback);
      if (cancelled) return;

      if (!result.ok) {
        setError(result.error ?? "Could not update Stripe status.");
        setSyncing(false);
        return;
      }

      if (result.workspace) {
        loadWorkspace(result.workspace);
      } else if (result.payment) {
        patchShopPayment(result.payment);
      }

      setSyncing(false);
      router.replace("/shop/payments");
    })();

    return () => {
      cancelled = true;
    };
  }, [
    connectFallback,
    loadWorkspace,
    patchShopPayment,
    router,
    stripeReturn,
    usePersistedShop,
  ]);

  const handleConnect = async () => {
    setPending(true);
    setError(null);
    const result = await startStripeConnectOnboarding(usePersistedShop ? undefined : connectFallback);
    if (!result.ok || !result.url) {
      setError(result.error ?? "Could not open Stripe Connect.");
      setPending(false);
      return;
    }
    if (result.stripeAccountId) {
      patchShopPayment({
        stripeAccountId: result.stripeAccountId,
        status: "pending",
        provider: "stripe",
      });
    }
    window.location.assign(result.url);
  };

  const showConnectCta = session.payment.status !== "connected";

  return (
    <PocCard className={shopContentCardClass}>
      <PocStack gap="md">
        <PocMuted>{statusDescription(session.payment.status)}</PocMuted>
        <p>
          Status: <strong>{humanizePaymentStatus(session.payment.status)}</strong>
        </p>
        {session.payment.accountLabel ? (
          <p>
            Account: <strong>{session.payment.accountLabel}</strong>
          </p>
        ) : null}
        {syncing ? <PocMuted>Updating your Stripe connection…</PocMuted> : null}
        {error ? <p className={blockStyles.paymentError}>{error}</p> : null}
        {showConnectCta ? (
          <div className={pageStyles.actions}>
            <PocButton
              type="button"
              variant="primary"
              disabled={pending || syncing}
              onClick={() => void handleConnect()}
            >
              {pending ? "Opening Stripe…" : "Connect Stripe Account"}
            </PocButton>
          </div>
        ) : null}
      </PocStack>
    </PocCard>
  );
}

export function SettingsEmbedCard() {
  const { session, addEmbedLink, canEnableEmbed } = useShopSession();
  const shopSlug = session.profile.shopName.trim().toLowerCase().replace(/\s+/g, "-") || "shop";

  return (
    <PocCard className={shopContentCardClass}>
      <PocStack gap="md">
        <PocMuted>
          Generate copy-ready booking links for your existing website. Embed enablement depends on profile
          completeness and connected payouts.
        </PocMuted>
        <p>
          Embed ready: <strong>{canEnableEmbed ? "yes" : "no"}</strong>
        </p>
        <form
          className={blockStyles.embedForm}
          onSubmit={(event) => {
            event.preventDefault();
            const form = new FormData(event.currentTarget);
            const label = String(form.get("label") ?? "Website booking");
            const source = String(form.get("source") ?? "site");
            const bikeId = String(form.get("bikeId") ?? "");
            const id = `embed-${Date.now()}`;
            const bikeQuery = bikeId ? `&bike=${encodeURIComponent(bikeId)}` : "";
            addEmbedLink({
              id,
              shopId: session.profile.id,
              label,
              url: `https://sendy.example.com/book/${shopSlug}?utm_source=${encodeURIComponent(source)}${bikeQuery}`,
            });
            event.currentTarget.reset();
          }}
        >
          <div className={blockStyles.embedFormFields}>
            <div>
              <PocLabel htmlFor="settings-embed-label">Link label</PocLabel>
              <PocInput id="settings-embed-label" name="label" placeholder="Homepage button" />
            </div>
            <div>
              <PocLabel htmlFor="settings-embed-source">Source tag</PocLabel>
              <PocInput id="settings-embed-source" name="source" placeholder="main_site" />
            </div>
            <div>
              <PocLabel htmlFor="settings-embed-bike">Bike id (optional)</PocLabel>
              <PocInput id="settings-embed-bike" name="bikeId" placeholder="shop-bike-1" />
            </div>
          </div>
          <PocButton type="submit" variant="secondary">
            Generate link
          </PocButton>
        </form>
        <ul className={pageStyles.list}>
          {session.embedLinks.map((link) => (
            <li key={link.id} className={pageStyles.listItem}>
              <p>
                <strong>{link.label}</strong>
              </p>
              <p className={pageStyles.mutedText}>{link.url}</p>
              <code>{`<a href="${link.url}">Book now</a>`}</code>
            </li>
          ))}
        </ul>
      </PocStack>
    </PocCard>
  );
}
