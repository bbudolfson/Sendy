"use client";

import { PocButton, PocButtonLink, PocCard, PocH1, PocInput, PocLabel, PocMuted, PocStack } from "@/components/poc-ui";
import { useShopSession } from "@/context/shop-session";
import styles from "../../../shop-pages.module.css";

export default function BikeRatesPage({ params }: { params: { id: string } }) {
  const { session, setBikeRates } = useShopSession();
  const bike = session.inventory.find((item) => item.id === params.id);
  if (!bike) {
    return (
      <div className={styles.page}>
        <PocCard>
          <PocStack gap="sm">
            <PocH1>Bike not found</PocH1>
            <PocButtonLink href="/shop/inventory" variant="secondary">
              Back to inventory
            </PocButtonLink>
          </PocStack>
        </PocCard>
      </div>
    );
  }
  const ratePlan = session.rates.find((plan) => plan.bikeId === bike.id);

  return (
    <div className={styles.page}>
      <PocCard>
        <PocStack gap="md">
          <PocH1>Rates: {bike.title}</PocH1>
          <form
            className={styles.twoCol}
            onSubmit={(event) => {
              event.preventDefault();
              const form = new FormData(event.currentTarget);
              const rawHalf = form.get("halfDayRate");
              const halfParsed = typeof rawHalf === "string" && rawHalf.trim() !== "" ? Number(rawHalf) : NaN;
              setBikeRates({
                bikeId: bike.id,
                dailyRate: Number(form.get("dailyRate") ?? 0),
                halfDayRate: Number.isFinite(halfParsed) && halfParsed >= 0 ? Math.round(halfParsed) : undefined,
                weeklyRate: Number(form.get("weeklyRate") ?? 0),
                deposit: Number(form.get("deposit") ?? 0),
                seasonalNote: String(form.get("seasonalNote") ?? ""),
              });
            }}
          >
            <div>
              <PocLabel>Daily rate</PocLabel>
              <PocInput type="number" name="dailyRate" defaultValue={ratePlan?.dailyRate ?? 0} min={0} />
            </div>
            <div>
              <PocLabel>Half day rate</PocLabel>
              <PocInput
                type="number"
                name="halfDayRate"
                defaultValue={
                  ratePlan?.halfDayRate ??
                  (ratePlan?.dailyRate !== undefined ? Math.round(ratePlan.dailyRate * 0.625) : "")
                }
                min={0}
              />
            </div>
            <div>
              <PocLabel>Weekly rate</PocLabel>
              <PocInput type="number" name="weeklyRate" defaultValue={ratePlan?.weeklyRate ?? 0} min={0} />
            </div>
            <div>
              <PocLabel>Security deposit</PocLabel>
              <PocInput type="number" name="deposit" defaultValue={ratePlan?.deposit ?? 0} min={0} />
            </div>
            <div className={styles.fullSpan}>
              <PocLabel>Seasonal note</PocLabel>
              <PocInput name="seasonalNote" defaultValue={ratePlan?.seasonalNote ?? ""} />
            </div>
            <div className={`${styles.actions} ${styles.fullSpan}`}>
              <PocButton type="submit">Save rates</PocButton>
            </div>
          </form>
          <PocMuted>
            Rider-facing preview: ${ratePlan?.dailyRate ?? 0}/day or ${ratePlan?.weeklyRate ?? 0}/week with ${ratePlan?.deposit ?? 0} deposit.
          </PocMuted>
        </PocStack>
      </PocCard>
    </div>
  );
}
