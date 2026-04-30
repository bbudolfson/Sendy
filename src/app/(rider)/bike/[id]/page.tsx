"use client";

import { useRef, useState } from "react";
import { useParams } from "next/navigation";
import { PocButtonLink } from "@/components/poc-ui";
import { RiderReservationCard } from "@/components/ui/RiderReservationCard/RiderReservationCard";
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
        <RiderReservationCard
          bikeTitle={bike.title}
          priceLine={priceLabel}
          description={bike.description}
          bikeLine={`Bike: ${bike.title}`}
          sizeLine={`Size: ${bike.size}`}
          hostedBy={shop?.shopName ?? "Bike Shop"}
          state={startValue && endValue ? "priced" : "draft"}
          startValue={startValue}
          endValue={endValue}
          totalChargesLine={startValue && endValue ? "Total Charges: $475.00 ($200 x 3 Days)" : undefined}
          onOpenStartPicker={() => openPicker(startRef)}
          onOpenEndPicker={() => openPicker(endRef)}
          onStartChange={setStartValue}
          onEndChange={setEndValue}
          onReserve={() => {}}
          startInputRef={startRef}
          endInputRef={endRef}
        />

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
