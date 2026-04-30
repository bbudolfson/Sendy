"use client";

import { PocButton, PocCard, PocH1, PocMuted, PocStack } from "@/components/poc-ui";
import { useShopSession } from "@/context/shop-session";
import styles from "../shop-pages.module.css";

const STATUSES = ["not_connected", "pending", "connected", "restricted"] as const;

export default function ShopPaymentsPage() {
  const { session, setPaymentConnectionState } = useShopSession();

  return (
    <div className={styles.page}>
      <div className={styles.shopPageHeaderRow}>
        <PocH1>Payments</PocH1>
      </div>
      <PocCard>
        <PocStack gap="md">
          <PocMuted>
            Prototype state machine for Stripe Connect-like onboarding. This is mock-only for now.
          </PocMuted>
          <p>
            Current status: <strong>{session.payment.status.replace("_", " ")}</strong>
          </p>
          <p>
            Payouts enabled: <strong>{session.payment.payoutsEnabled ? "yes" : "no"}</strong>
          </p>
          <div className={styles.actions}>
            {STATUSES.map((status) => (
              <PocButton
                key={status}
                type="button"
                variant={session.payment.status === status ? "primary" : "secondary"}
                onClick={() => setPaymentConnectionState(status)}
              >
                Set {status.replace("_", " ")}
              </PocButton>
            ))}
          </div>
        </PocStack>
      </PocCard>
    </div>
  );
}
