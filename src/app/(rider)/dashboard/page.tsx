"use client";

import { useRouter } from "next/navigation";
import { PocButton, PocCard, PocH1, PocInput, PocLabel, PocMuted, PocStack } from "@/components/poc-ui";
import { usePocSession } from "@/context/poc-session";
import {
  DUMMY_RENTALS,
  FEATURED_LOCATIONS,
  getDemoMarketForFeaturedLocation,
  resolveMarketFromLocation,
} from "@/lib/dummy-data";
import styles from "./dashboard.module.css";

export default function DashboardPage() {
  const router = useRouter();
  const { session, patch } = usePocSession();
  const routeToSearch = (location: string, marketId: string | null) => {
    patch({
      tripLocation: location,
      marketId,
      datesKnown: !!(session.tripStart && session.tripEnd),
    });
    router.push("/plan/bikes");
  };

  const upcomingTrip =
    (session.isLoggedIn &&
      session.checkoutConfirmed &&
      session.tripLocation &&
      session.bikeId &&
      session.tripStart &&
      session.tripEnd && {
        location: session.tripLocation,
        startDate: session.tripStart,
        endDate: session.tripEnd,
      }) ||
    (session.isLoggedIn ? DUMMY_RENTALS.find((r) => r.status === "upcoming") : null);

  return (
    <div className={styles.page}>
      <PocCard>
        <PocStack gap="md">
          <PocH1>Welcome to Sendy</PocH1>
          <PocMuted>
            {session.isLoggedIn
              ? "Where are you riding next?"
              : "Search bikes and trips without logging in, or log in to save your rentals."}
          </PocMuted>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              const location = String(fd.get("location") ?? "").trim();
              const start = String(fd.get("start") ?? "").trim() || null;
              const end = String(fd.get("end") ?? "").trim() || null;
              const { exists, market } = resolveMarketFromLocation(location);

              patch({
                tripLocation: location,
                tripStart: start,
                tripEnd: end,
                marketId: market?.id ?? null,
                datesKnown: !!(start && end),
              });

              if (!exists) {
                router.push("/plan/request-market");
                return;
              }
              if (start && end) {
                router.push("/plan/bikes");
              } else {
                router.push("/plan/dates");
              }
            }}
          >
            <PocStack gap="sm">
              <div>
                <PocLabel>Location</PocLabel>
                <PocInput
                  name="location"
                  required
                  placeholder="e.g. Moab, UT or Northwest Arkansas"
                  defaultValue={session.tripLocation}
                />
              </div>
              <div className={styles.dateRow}>
                <div>
                  <PocLabel>Start date</PocLabel>
                  <PocInput name="start" type="date" defaultValue={session.tripStart ?? ""} />
                </div>
                <div>
                  <PocLabel>End date</PocLabel>
                  <PocInput name="end" type="date" defaultValue={session.tripEnd ?? ""} />
                </div>
              </div>
              <PocButton type="submit">Search bikes</PocButton>
            </PocStack>
          </form>
        </PocStack>
      </PocCard>

      <PocCard>
        <PocStack gap="sm">
          <h2 className={styles.sectionTitle}>Upcoming trip</h2>
          {upcomingTrip ? (
            <>
              <p className={styles.meta}>
                {upcomingTrip.location} · {upcomingTrip.startDate} → {upcomingTrip.endDate}
              </p>
              <a className={styles.inlineLink} href="/plan/accept">
                View trip details
              </a>
            </>
          ) : (
            <>
              <p className={styles.meta}>No upcoming trips.</p>
              {!session.isLoggedIn ? (
                <a className={styles.inlineLink} href="/sign-in">
                  Login
                </a>
              ) : null}
            </>
          )}
        </PocStack>
      </PocCard>

      <PocCard>
        <PocStack gap="sm">
          <h2 className={styles.sectionTitle}>Featured locations</h2>
          <div className={styles.featureGrid}>
            {FEATURED_LOCATIONS.map((loc) => (
              <button
                key={loc.id}
                type="button"
                className={styles.featureCard}
                onClick={() => {
                  const demoMarket = getDemoMarketForFeaturedLocation(loc.label);
                  routeToSearch(loc.label, demoMarket?.id ?? null);
                }}
              >
                <h3>{loc.label}</h3>
                <p>{loc.blurb}</p>
                <p className={styles.meta}>
                  {loc.sampleBikeCount} bikes · from ${loc.fromDailyPrice}/day
                </p>
              </button>
            ))}
          </div>
        </PocStack>
      </PocCard>
    </div>
  );
}
