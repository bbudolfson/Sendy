"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { searchBikes } from "@/app/actions/bikes";
import { getMarkets, resolveMarketFromLocation as resolveMarketRemote } from "@/app/actions/markets";
import { PocInput } from "@/components/poc-ui";
import { RiderAvatarMenu } from "@/components/rider-avatar-menu";
import { BikeTile } from "@/components/ui/BikeTile/BikeTile";
import { EmptyState } from "@/components/ui/EmptyState/EmptyState";
import { usePocSession } from "@/context/poc-session";
import { useSupabase } from "@/context/supabase-provider";
import type { Market } from "@/lib/domain/types";
import {
  DUMMY_RENTALS,
  SHOP_BIKES,
  getMarketById,
  getRatePlanForBike,
  resolveMarketFromLocation as resolveMarketLocal,
} from "@/lib/dummy-data";
import type { PublicBikeListing } from "@/lib/supabase/mappers";
import { formatDisplayDate } from "@/lib/format-display-date";
import styles from "./dashboard.module.css";

const HOME_ROWS = [
  { id: "bentonville", label: "Available Bikes in Bentonville, AR" },
  { id: "richmond", label: "Available Bikes in Richmond, VA" },
];

function BikeGrid({
  bikes,
  searching,
  onClearFilters,
}: {
  bikes: PublicBikeListing[] | typeof SHOP_BIKES;
  searching: boolean;
  onClearFilters?: () => void;
}) {
  if (searching) {
    return <p className={styles.resultsMeta}>Loading bikes…</p>;
  }
  if (bikes.length === 0) {
    return (
      <EmptyState
        title="Bummer, No Bikes Available Yet."
        description="We’re new and working on getting bikes up here as our community grows. Please check back later."
        actions={onClearFilters ? [{ label: "Clear Filters", onClick: onClearFilters }] : []}
      />
    );
  }
  return (
    <>
      {bikes.map((bike) => {
        const dailyRate =
          "dailyRate" in bike ? bike.dailyRate : getRatePlanForBike(bike.id)?.dailyRate;
        const priceLabel =
          dailyRate !== undefined ? `($${dailyRate} Per Day)` : "(Price on request)";
        const host =
          "shopName" in bike && typeof bike.shopName === "string" ? bike.shopName : "Bike Shop";
        return (
          <Link key={bike.id} href={`/bike/${bike.id}`} className={styles.bikeCardLink}>
            <BikeTile
              imageUrl={bike.imageUrl}
              title={bike.title}
              priceLine={priceLabel}
              hostedBy={host}
              typeLabel={bike.type}
            />
          </Link>
        );
      })}
    </>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { configured } = useSupabase();
  const { session, patch } = usePocSession();
  const [locationValue, setLocationValue] = useState(session.tripLocation ?? "");
  const [liveBikes, setLiveBikes] = useState<PublicBikeListing[]>([]);
  const [browseByMarket, setBrowseByMarket] = useState<
    { market: Market; bikes: PublicBikeListing[] }[]
  >([]);
  const [searching, setSearching] = useState(false);
  const [browseLoading, setBrowseLoading] = useState(false);
  const [startValue, setStartValue] = useState(session.tripStart ?? "");
  const [endValue, setEndValue] = useState(session.tripEnd ?? "");
  const [showPrevious, setShowPrevious] = useState(false);
  const startRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLInputElement>(null);
  const previous = configured ? [] : DUMMY_RENTALS.slice(0, 2);

  const searchMarket = session.marketId ? getMarketById(session.marketId) : undefined;
  const resultShopBikes = session.marketId
    ? configured
      ? liveBikes
      : SHOP_BIKES
    : [];

  useEffect(() => {
    if (!configured || !session.marketId) {
      setLiveBikes([]);
      return;
    }
    setSearching(true);
    searchBikes(session.marketId, session.tripStart, session.tripEnd).then(({ bikes }) => {
      setLiveBikes(bikes);
      setSearching(false);
    });
  }, [configured, session.marketId, session.tripStart, session.tripEnd]);

  useEffect(() => {
    if (!configured || session.marketId) {
      setBrowseByMarket([]);
      return;
    }
    setBrowseLoading(true);
    getMarkets().then(async ({ markets: loaded }) => {
      const grouped = await Promise.all(
        loaded.map(async (market) => {
          const { bikes } = await searchBikes(market.id, null, null);
          return { market, bikes };
        }),
      );
      setBrowseByMarket(grouped.filter((g) => g.bikes.length > 0));
      setBrowseLoading(false);
    });
  }, [configured, session.marketId]);

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

  const clearLocationSearch = useCallback(() => {
    setLocationValue("");
    setStartValue("");
    setEndValue("");
    setShowPrevious(false);
    patch({
      tripLocation: "",
      tripStart: null,
      tripEnd: null,
      marketId: null,
      datesKnown: false,
    });
  }, [patch]);

  const showLocationClear = session.marketId != null;

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.shell}>
          <div className={styles.heroTop}>
            <img src="/freewheel-logo-white.svg" alt="Freewheel" className={styles.logoImage} />
            <RiderAvatarMenu variant="hero" />
          </div>
          <div className={styles.searchWrap}>
          <form
            className={styles.searchCard}
            autoComplete="off"
            onSubmit={async (e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              const location = String(fd.get("location") ?? "").trim();
              const start = String(fd.get("start") ?? "").trim() || null;
              const end = String(fd.get("end") ?? "").trim() || null;
              const { exists, market } = configured
                ? await resolveMarketRemote(location)
                : resolveMarketLocal(location);

              patch({
                tripLocation: location,
                tripStart: start,
                tripEnd: end,
                marketId: market?.id ?? null,
                datesKnown: !!(start && end),
              });

              if (!exists) {
                router.push("/plan/request-market");
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
                <div
                  className={
                    showLocationClear
                      ? `${styles.locationInputWrap} ${styles.locationInputWrapWithClear}`
                      : styles.locationInputWrap
                  }
                >
                  <PocInput
                    name="location"
                    required
                    placeholder="Where do you want to ride?"
                    value={locationValue}
                    autoComplete="off"
                    onChange={(event) => setLocationValue(event.currentTarget.value)}
                  />
                  {showLocationClear ? (
                    <button
                      type="button"
                      className={styles.locationClear}
                      aria-label="Clear location and search"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={clearLocationSearch}
                    >
                      <svg className={styles.locationClearIcon} viewBox="0 0 24 24" fill="none" aria-hidden>
                        <path
                          d="M6 6l12 12M18 6L6 18"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  ) : null}
                </div>
                {showPrevious && previous.length > 0 ? (
                  <div className={styles.locationDropdown}>
                    <p className={styles.previousLabel}>Previous Searches</p>
                    <ul className={styles.previousList}>
                      {previous.map((trip) => (
                        <li key={trip.id}>
                          <button
                            type="button"
                            className={styles.previousOption}
                            onClick={async () => {
                              setLocationValue(trip.location);
                              setStartValue(trip.startDate);
                              setEndValue(trip.endDate);
                              const { exists, market } = configured
                                ? await resolveMarketRemote(trip.location)
                                : resolveMarketLocal(trip.location);
                              if (exists && market) {
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
                            {trip.location}, {formatDisplayDate(trip.startDate)}–
                            {formatDisplayDate(trip.endDate)}
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
                <PocInput
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
                <PocInput
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
        </div>
      </section>

      <section className={styles.resultsWrap}>
        <div className={styles.shell}>
        {session.marketId && searchMarket ? (
          <div className={styles.resultSection}>
            <h2 className={styles.sectionTitle}>Bikes in {searchMarket.label}</h2>
            <p className={styles.resultsMeta}>
              {startValue && endValue
                ? `${formatDisplayDate(startValue)} – ${formatDisplayDate(endValue)}`
                : "Add trip dates in the search bar to continue booking with dates."}
            </p>
            <div className={styles.bikeGrid}>
              <BikeGrid bikes={resultShopBikes} searching={searching} onClearFilters={clearLocationSearch} />
            </div>
          </div>
        ) : configured ? (
          browseLoading ? (
            <p className={styles.resultsMeta}>Loading listings…</p>
          ) : browseByMarket.length > 0 ? (
            browseByMarket.map(({ market, bikes }) => (
              <div key={market.id} className={styles.resultSection}>
                <h2 className={styles.sectionTitle}>Bikes in {market.label}</h2>
                <div className={styles.bikeGrid}>
                  <BikeGrid bikes={bikes} searching={false} />
                </div>
              </div>
            ))
          ) : (
            <EmptyState
              title="Bummer, No Bikes Available Yet."
              description="We’re new and working on getting bikes up here as our community grows. Please check back later."
            />
          )
        ) : (
          HOME_ROWS.map((row) => (
            <div key={row.id} className={styles.resultSection}>
              <h2 className={styles.sectionTitle}>{row.label}</h2>
              <div className={styles.bikeGrid}>
                {Array.from({ length: 5 }, (_, index) => {
                  const bike = SHOP_BIKES[index % SHOP_BIKES.length];
                  const rate = getRatePlanForBike(bike.id);
                  const priceLabel =
                    rate !== undefined ? `($${rate.dailyRate} Per Day)` : "(Price on request)";
                  return (
                    <a key={`${row.id}-${index}`} href={`/bike/${bike.id}`} className={styles.bikeCardLink}>
                      <BikeTile
                        imageUrl={bike.imageUrl}
                        title={bike.title}
                        priceLine={priceLabel}
                        hostedBy="Bike Shop"
                        typeLabel={bike.type}
                      />
                    </a>
                  );
                })}
              </div>
            </div>
          ))
        )}
        </div>
      </section>
    </div>
  );
}
