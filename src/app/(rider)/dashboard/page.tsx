"use client";

import { useRouter } from "next/navigation";
import { PocInput } from "@/components/poc-ui";
import { usePocSession } from "@/context/poc-session";
import {
  DUMMY_RENTALS,
  SHOP_BIKES,
  resolveMarketFromLocation,
} from "@/lib/dummy-data";
import styles from "./dashboard.module.css";

const HOME_ROWS = [
  { id: "bentonville", label: "Available Bikes in Bentonville, AR" },
  { id: "richmond", label: "Available Bikes in Richmond, VA" },
];

export default function DashboardPage() {
  const router = useRouter();
  const { session, patch, resetAll, openAuthModal } = usePocSession();
  const previous = DUMMY_RENTALS.slice(0, 2);
  const label = session.isLoggedIn ? session.riderName || "Rider" : "Login";
  const initial = label.slice(0, 2).toUpperCase();

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroTop}>
          <img src="/fitted-logo.png" alt="Fitted Premium Bike Rentals" className={styles.logoImage} />
          <details className={styles.profileMenu}>
            <summary className={styles.avatar}>{initial}</summary>
            <div className={styles.menuPanel}>
              {session.isLoggedIn ? (
                <a href="/rider-profile" className={styles.menuItem}>
                  Profile
                </a>
              ) : (
                <button
                  type="button"
                  className={styles.menuItemButton}
                  onClick={() => openAuthModal("sign-in")}
                >
                  Login
                </button>
              )}
              <a href="/trips" className={styles.menuItem}>
                Trips
              </a>
              <a href="/shop" className={styles.menuItem}>
                Switch to renter
              </a>
              {session.isLoggedIn ? (
                <button
                  type="button"
                  className={styles.menuItemButton}
                  onClick={() => {
                    resetAll();
                    router.push("/dashboard");
                  }}
                >
                  Log out
                </button>
              ) : null}
            </div>
          </details>
        </div>
        <div className={styles.searchWrap}>
          <form
            className={styles.searchCard}
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
            <div className={styles.searchRow}>
              <PocInput
                name="location"
                required
                placeholder="Where are you riding?"
                defaultValue={session.tripLocation}
              />
              <PocInput name="start" type="date" defaultValue={session.tripStart ?? ""} />
              <PocInput name="end" type="date" defaultValue={session.tripEnd ?? ""} />
              <button type="submit" className={styles.searchSubmit} aria-label="Search bikes">
                <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" aria-hidden>
                  <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="2" />
                  <path d="M16 16l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </form>
          <div className={styles.previousCard}>
            <p className={styles.previousLabel}>Previous Searches</p>
            <ul className={styles.previousList}>
              {previous.map((trip) => (
                <li key={trip.id}>
                  {trip.location}, {trip.startDate.slice(5)}-{trip.endDate.slice(5)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className={styles.resultsWrap}>
        {HOME_ROWS.map((row) => (
          <div key={row.id} className={styles.resultSection}>
            <h2 className={styles.sectionTitle}>{row.label}</h2>
            <div className={styles.bikeGrid}>
              {Array.from({ length: 5 }, (_, index) => {
                const bike = SHOP_BIKES[index % SHOP_BIKES.length];
                return (
                  <article key={`${row.id}-${index}`} className={styles.bikeCard}>
                    <img src={bike.imageUrl} alt={bike.title} className={styles.bikeImage} />
                    <p className={styles.bikeTitle}>{bike.title}</p>
                    <p className={styles.bikePrice}>($200 Per Day)</p>
                  </article>
                );
              })}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
