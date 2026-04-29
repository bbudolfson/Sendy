"use client";

import { PocButton, PocButtonLink, PocCard, PocH1, PocInput, PocLabel, PocMuted, PocStack } from "@/components/poc-ui";
import { useShopSession } from "@/context/shop-session";
import type { Weekday } from "@/lib/domain/types";
import styles from "../../../shop-pages.module.css";

const DAYS: Weekday[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export default function BikeAvailabilityPage({ params }: { params: { id: string } }) {
  const { session, setBikeAvailabilityRules, addBikeBlockedDate, removeBikeBlockedDate } = useShopSession();
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

  const rules = session.availabilityRules.filter((rule) => rule.bikeId === bike.id);
  const blocked = session.blockedDates.filter((entry) => entry.bikeId === bike.id);

  return (
    <div className={styles.page}>
      <PocCard>
        <PocStack gap="md">
          <PocH1>Availability: {bike.title}</PocH1>
          <form
            className={styles.list}
            onSubmit={(event) => {
              event.preventDefault();
              const form = new FormData(event.currentTarget);
              const nextRules = DAYS.map((day) => ({
                bikeId: bike.id,
                weekday: day,
                enabled: !!form.get(`${day}-enabled`),
                open: String(form.get(`${day}-open`) ?? "09:00"),
                close: String(form.get(`${day}-close`) ?? "18:00"),
              }));
              setBikeAvailabilityRules(bike.id, nextRules);
            }}
          >
            {DAYS.map((day) => {
              const existing = rules.find((rule) => rule.weekday === day);
              return (
                <div key={day} className={styles.listItem}>
                  <div className={styles.row}>
                    <strong className={styles.capitalize}>{day}</strong>
                    <label>
                      <input type="checkbox" name={`${day}-enabled`} defaultChecked={existing?.enabled ?? false} /> Open
                    </label>
                  </div>
                  <div className={styles.actions}>
                    <PocInput type="time" name={`${day}-open`} defaultValue={existing?.open ?? "09:00"} />
                    <PocInput type="time" name={`${day}-close`} defaultValue={existing?.close ?? "18:00"} />
                  </div>
                </div>
              );
            })}
            <PocButton type="submit">Save weekly availability</PocButton>
          </form>
        </PocStack>
      </PocCard>

      <PocCard>
        <PocStack gap="sm">
          <PocH1>Blocked dates</PocH1>
          <form
            className={styles.actions}
            onSubmit={(event) => {
              event.preventDefault();
              const form = new FormData(event.currentTarget);
              const date = String(form.get("date") ?? "");
              const reason = String(form.get("reason") ?? "Unavailable");
              if (!date) return;
              addBikeBlockedDate({ bikeId: bike.id, date, reason });
              event.currentTarget.reset();
            }}
          >
            <div>
              <PocLabel>Date</PocLabel>
              <PocInput name="date" type="date" />
            </div>
            <div>
              <PocLabel>Reason</PocLabel>
              <PocInput name="reason" placeholder="Maintenance / Event" />
            </div>
            <PocButton type="submit" variant="secondary">
              Add blocked date
            </PocButton>
          </form>
          <ul className={styles.list}>
            {blocked.map((entry) => (
              <li key={entry.date} className={styles.listItem}>
                <div className={styles.row}>
                  <span>{entry.date}</span>
                  <button type="button" onClick={() => removeBikeBlockedDate(bike.id, entry.date)}>
                    Remove
                  </button>
                </div>
                <PocMuted>{entry.reason}</PocMuted>
              </li>
            ))}
            {blocked.length === 0 ? <PocMuted>No blocked dates yet.</PocMuted> : null}
          </ul>
        </PocStack>
      </PocCard>
    </div>
  );
}
