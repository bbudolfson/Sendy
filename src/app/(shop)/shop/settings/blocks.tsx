"use client";

import { PocButton, PocCard, PocInput, PocLabel, PocMuted, PocStack } from "@/components/poc-ui";
import { useShopSession } from "@/context/shop-session";
import type { PaymentConnectionStatus } from "@/lib/domain/types";
import pageStyles from "../shop-pages.module.css";
import blockStyles from "./blocks.module.css";

const shopContentCardClass = blockStyles.shopContentCard;

const PAYMENT_STATUSES: PaymentConnectionStatus[] = ["not_connected", "pending", "connected", "restricted"];

function humanizePaymentStatus(status: PaymentConnectionStatus): string {
  return status.replace(/_/g, " ");
}

export function SettingsPaymentsCard() {
  const { session, setPaymentConnectionState } = useShopSession();

  return (
    <PocCard className={shopContentCardClass}>
      <PocStack gap="md">
        <PocMuted>
          Prototype state machine for Stripe Connect-like onboarding. This is mock-only for now.
        </PocMuted>
        <p>
          Current status: <strong>{humanizePaymentStatus(session.payment.status)}</strong>
        </p>
        <p>
          Payouts enabled: <strong>{session.payment.payoutsEnabled ? "yes" : "no"}</strong>
        </p>
        <div className={pageStyles.actions}>
          {PAYMENT_STATUSES.map((status) => (
            <PocButton
              key={status}
              type="button"
              variant={session.payment.status === status ? "primary" : "secondary"}
              onClick={() => setPaymentConnectionState(status)}
            >
              Set {humanizePaymentStatus(status)}
            </PocButton>
          ))}
        </div>
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
