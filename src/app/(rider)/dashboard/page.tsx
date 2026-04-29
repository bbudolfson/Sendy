"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { PocInput } from "@/components/poc-ui";
import { RiderAvatarMenu } from "@/components/rider-avatar-menu";
import { usePocSession } from "@/context/poc-session";
import {
  DUMMY_RENTALS,
  SHOP_BIKES,
  getBikesForMarket,
  getMarketById,
  resolveMarketFromLocation,
} from "@/lib/dummy-data";
import { formatDisplayDate } from "@/lib/format-display-date";
import styles from "./dashboard.module.css";

const HOME_ROWS = [
  { id: "bentonville", label: "Available Bikes in Bentonville, AR" },
  { id: "richmond", label: "Available Bikes in Richmond, VA" },
];

export default function DashboardPage() {
  const router = useRouter();
  const { session, patch } = usePocSession();
  const [locationValue, setLocationValue] = useState(session.tripLocation ?? "");
  const [startValue, setStartValue] = useState(session.tripStart ?? "");
  const [endValue, setEndValue] = useState(session.tripEnd ?? "");
  const [showPrevious, setShowPrevious] = useState(false);
  /** Drives lower-half tiles after a successful location search (stays on dashboard). */
  const [resultsMarketId, setResultsMarketId] = useState<string | null>(null);
  const startRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLInputElement>(null);
  const previous = DUMMY_RENTALS.slice(0, 2);

  const searchMarket = resultsMarketId ? getMarketById(resultsMarketId) : undefined;
  const searchBikes = resultsMarketId
    ? getBikesForMarket(resultsMarketId, { includeFallback: true })
    : [];

  const openPicker = (ref: React.RefObject<HTMLInputElement | null>) => {
    const node = ref.current;
    if (!node) return;
    const picker = node as HTMLInputElement & { showPicker?: () => void };
    if (picker.showPicker) {
      picker.showPicker();
      return;
    }
    node.focus();
  };

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroTop}>
          <img src="/fitted-logo.png" alt="Fitted Premium Bike Rentals" className={styles.logoImage} />
          <RiderAvatarMenu variant="hero" />
        </div>
        <div className={styles.searchWrap}>
          <form
            className={styles.searchCard}
            autoComplete="off"
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
              if (market) {
                setResultsMarketId(market.id);
              }
            }}
          >
            <div className={styles.searchRow}>
              <div
                className={styles.locationField}
                onFocus={() => setShowPrevious(true)}
                onBlur={() => {
                  window.setTimeout(() => setShowPrevious(false), 120);
                }}
              >
                <PocInput
                  name="location"
                  required
                  placeholder="Where are you riding?"
                  value={locationValue}
                  autoComplete="off"
                  onChange={(event) => setLocationValue(event.currentTarget.value)}
                />
                {showPrevious ? (
                  <div className={styles.locationDropdown}>
                    <p className={styles.previousLabel}>Previous Searches</p>
                    <ul className={styles.previousList}>
                      {previous.map((trip) => (
                        <li key={trip.id}>
                          <button
                            type="button"
                            className={styles.previousOption}
                            onClick={() => {
                              setLocationValue(trip.location);
                              setStartValue(trip.startDate);
                              setEndValue(trip.endDate);
                              const { exists, market } = resolveMarketFromLocation(trip.location);
                              if (exists && market) {
                                setResultsMarketId(market.id);
                                patch({
                                  tripLocation: trip.location,
                                  tripStart: trip.startDate,
                                  tripEnd: trip.endDate,
                                  marketId: market.id,
                                  datesKnown: true,
                                });
                              }
                              setShowPrevious(false);
                            }}
                          >
                            {trip.location}, {formatDisplayDate(trip.startDate)}–{formatDisplayDate(trip.endDate)}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
              <div className={styles.dateField}>
                <button
                  type="button"
                  className={`${styles.dateButton} ${startValue ? styles.dateButtonFilled : ""}`}
                  onClick={() => openPicker(startRef)}
                >
                  {startValue ? formatDisplayDate(startValue) : "Start"}
                </button>
                <input
                  ref={startRef}
                  className={styles.dateNative}
                  name="start"
                  type="date"
                  value={startValue}
                  onChange={(event) => setStartValue(event.currentTarget.value)}
                />
              </div>
              <div className={styles.dateField}>
                <button
                  type="button"
                  className={`${styles.dateButton} ${endValue ? styles.dateButtonFilled : ""}`}
                  onClick={() => openPicker(endRef)}
                >
                  {endValue ? formatDisplayDate(endValue) : "End"}
                </button>
                <input
                  ref={endRef}
                  className={styles.dateNative}
                  name="end"
                  type="date"
                  value={endValue}
                  onChange={(event) => setEndValue(event.currentTarget.value)}
                />
              </div>
              <button type="submit" className={styles.searchSubmit} aria-label="Search bikes">
                <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" aria-hidden>
                  <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="2" />
                  <path d="M16 16l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className={styles.resultsWrap}>
        {resultsMarketId && searchMarket ? (
          <div className={styles.resultSection}>
            <h2 className={styles.sectionTitle}>Bikes in {searchMarket.label}</h2>
            <p className={styles.resultsMeta}>
              {startValue && endValue
                ? `${formatDisplayDate(startValue)} – ${formatDisplayDate(endValue)}`
                : "Add trip dates in the search bar to continue booking with dates."}
            </p>
            <div className={styles.bikeGrid}>
              {searchBikes.length === 0 ? (
                <p className={styles.resultsMeta}>No demo bikes for this market yet.</p>
              ) : (
                searchBikes.map((bike) => (
                  <Link key={bike.id} href={`/plan/bikes/${bike.id}`} className={styles.bikeCardLink}>
                    <article className={styles.bikeCard}>
                      <img src={bike.imageUrl} alt={bike.name} className={styles.bikeImage} />
                      <p className={styles.bikeTitle}>{bike.name}</p>
                      <p className={styles.bikePrice}>${bike.dailyPrice} / day</p>
                    </article>
                  </Link>
                ))
              )}
            </div>
            <div className={styles.continueRow}>
              {startValue && endValue ? (
                <Link href="/plan/bikes" className={styles.continueLink}>
                  Continue to full match list →
                </Link>
              ) : (
                <Link href="/plan/dates" className={styles.continueLink}>
                  Add dates and continue booking →
                </Link>
              )}
            </div>
          </div>
        ) : (
          HOME_ROWS.map((row) => (
            <div key={row.id} className={styles.resultSection}>
              <h2 className={styles.sectionTitle}>{row.label}</h2>
              <div className={styles.bikeGrid}>
                {Array.from({ length: 5 }, (_, index) => {
                  const bike = SHOP_BIKES[index % SHOP_BIKES.length];
                  return (
                    <a key={`${row.id}-${index}`} href={`/bike/${bike.id}`} className={styles.bikeCardLink}>
                      <article className={styles.bikeCard}>
                        <img src={bike.imageUrl} alt={bike.title} className={styles.bikeImage} />
                        <p className={styles.bikeTitle}>{bike.title}</p>
                        <p className={styles.bikePrice}>($200 Per Day)</p>
                      </article>
                    </a>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
