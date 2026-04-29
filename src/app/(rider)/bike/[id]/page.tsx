"use client";

import { useRef, useState } from "react";
import { useParams } from "next/navigation";
import { PocButton, PocButtonLink } from "@/components/poc-ui";
import {
  getShopBikeById,
  getShopBikeGallery,
  getRatePlanForBike,
  getShopProfileByShopId,
} from "@/lib/dummy-data";
import styles from "./bike-detail.module.css";

export default function BikeDetailPage() {
  const params = useParams();
  const id = String(params.id ?? "");
  const bike = getShopBikeById(id);
  const gallery = getShopBikeGallery(id);
  const ratePlan = bike ? getRatePlanForBike(bike.id) : undefined;
  const shop = bike ? getShopProfileByShopId(bike.shopId) : undefined;

  const [activeIndex, setActiveIndex] = useState(0);
  const [startValue, setStartValue] = useState("");
  const [endValue, setEndValue] = useState("");
  const startRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLInputElement>(null);

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

  if (!bike) {
    return (
      <div className={styles.page}>
        <div className={styles.detailsCard}>
          <p className={styles.pageTitle}>Bike not found</p>
          <PocButtonLink href="/dashboard" variant="secondary">
            Back to search
          </PocButtonLink>
        </div>
      </div>
    );
  }

  const priceLabel =
    ratePlan !== undefined ? `($${ratePlan.dailyRate} Per Day)` : "(Price on request)";

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <a href="/dashboard" className={styles.backLink} aria-label="Back to dashboard">
          ←
        </a>
        <h1 className={styles.pageTitle}>{bike.title}</h1>
      </header>
      <div className={styles.carousel}>
        <img
          src={gallery[activeIndex] ?? bike.imageUrl}
          alt={`${bike.title} photo ${activeIndex + 1}`}
          className={styles.heroImage}
        />
        <div className={styles.thumbRow}>
          {gallery.map((src, index) => (
            <img
              key={src}
              src={src}
              alt={`${bike.title} thumbnail ${index + 1}`}
              className={styles.thumb}
              data-active={index === activeIndex || undefined}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      </div>

      <article className={styles.detailsCard}>
        <div className={styles.detailsSplit}>
          <div className={styles.detailsLeft}>
            <div className={styles.detailsLeftCopy}>
              <p className={styles.meta}>{priceLabel}</p>
              <p className={styles.description}>{bike.description}</p>
            </div>
            {shop ? (
              <p className={styles.hostedBy}>
                Hosted by <span className={styles.hostedByName}>{shop.shopName}</span>
              </p>
            ) : null}
          </div>

          <div className={styles.detailsRight}>
            <h2 className={styles.reserveHeading}>Check Availability</h2>
            <form
              className={styles.reserveForm}
              onSubmit={(event) => {
                event.preventDefault();
              }}
            >
              <div className={styles.dateRangeRow} aria-label="Rental dates">
                <div className={styles.dateField}>
                  <button
                    type="button"
                    className={`${styles.dateButton} ${startValue ? styles.dateButtonFilled : ""}`}
                    onClick={() => openPicker(startRef)}
                  >
                    {startValue || "Start"}
                  </button>
                  <input
                    ref={startRef}
                    className={styles.dateNative}
                    name="start"
                    type="date"
                    value={startValue}
                    onChange={(event) => setStartValue(event.currentTarget.value)}
                    aria-label="Start date"
                  />
                </div>
                <div className={styles.dateField}>
                  <button
                    type="button"
                    className={`${styles.dateButton} ${endValue ? styles.dateButtonFilled : ""}`}
                    onClick={() => openPicker(endRef)}
                  >
                    {endValue || "End"}
                  </button>
                  <input
                    ref={endRef}
                    className={styles.dateNative}
                    name="end"
                    type="date"
                    value={endValue}
                    onChange={(event) => setEndValue(event.currentTarget.value)}
                    aria-label="End date"
                  />
                </div>
              </div>
              <PocButton type="submit" variant="primary" className={styles.reserveSubmit}>
                Reserve
              </PocButton>
            </form>
          </div>
        </div>

        <div className={styles.specGrid}>
          <div className={styles.spec}>
            <p className={styles.specLabel}>Brand</p>
            <p className={styles.specValue}>{bike.brand}</p>
          </div>
          <div className={styles.spec}>
            <p className={styles.specLabel}>Model</p>
            <p className={styles.specValue}>{bike.model}</p>
          </div>
          <div className={styles.spec}>
            <p className={styles.specLabel}>Type</p>
            <p className={styles.specValue}>{bike.type}</p>
          </div>
          <div className={styles.spec}>
            <p className={styles.specLabel}>Size</p>
            <p className={styles.specValue}>{bike.size}</p>
          </div>
        </div>
      </article>
    </div>
  );
}
