"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getBikeById as getBikeByIdRemote } from "@/app/actions/bikes";
import { PocButtonLink } from "@/components/poc-ui";
import { RiderReservationCard } from "@/components/ui/RiderReservationCard/RiderReservationCard";
import { usePocSession } from "@/context/poc-session";
import { useSupabase } from "@/context/supabase-provider";
import {
  getShopBikeById,
  getShopBikeGallery,
  getRatePlanForBike,
  getShopProfileByShopId,
} from "@/lib/dummy-data";
import type { ShopBike } from "@/lib/domain/types";
import type { RatePlan } from "@/lib/domain/types";
import styles from "./bike-detail.module.css";

export default function BikeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { configured } = useSupabase();
  const { patch } = usePocSession();
  const id = String(params.id ?? "");

  const [remoteBike, setRemoteBike] = useState<ShopBike | null>(null);
  const [remoteRate, setRemoteRate] = useState<RatePlan | null>(null);
  const [remoteShopName, setRemoteShopName] = useState("");
  const [loading, setLoading] = useState(configured);

  const localBike = getShopBikeById(id);
  const bike = configured ? remoteBike : localBike;
  const gallery = bike
    ? bike.photoUrls?.length
      ? bike.photoUrls
      : bike.imageUrl
        ? [bike.imageUrl]
        : []
    : getShopBikeGallery(id);
  const ratePlan = configured
    ? remoteRate ?? undefined
    : localBike
      ? getRatePlanForBike(localBike.id)
      : undefined;
  const shop = localBike ? getShopProfileByShopId(localBike.shopId) : undefined;
  const hostedBy = configured ? remoteShopName || "Bike Shop" : shop?.shopName ?? "Bike Shop";

  const [activeIndex, setActiveIndex] = useState(0);
  const [startValue, setStartValue] = useState("");
  const [endValue, setEndValue] = useState("");
  const startRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!configured) {
      setLoading(false);
      return;
    }
    setLoading(true);
    getBikeByIdRemote(id).then((data) => {
      if (data) {
        setRemoteBike(data.bike);
        setRemoteRate(data.rate);
        setRemoteShopName(data.shopName);
      } else {
        setRemoteBike(null);
      }
      setLoading(false);
    });
  }, [configured, id]);

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

  if (loading) {
    return (
      <div className={styles.page}>
        <p className={styles.pageTitle}>Loading…</p>
      </div>
    );
  }

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

  const days =
    startValue && endValue
      ? Math.max(
          1,
          Math.ceil(
            (new Date(`${endValue}T12:00:00`).getTime() - new Date(`${startValue}T12:00:00`).getTime()) /
              86400000,
          ) + 1,
        )
      : 0;
  const total =
    ratePlan && days > 0 ? `$${(ratePlan.dailyRate * days).toFixed(0)}.00 ($${ratePlan.dailyRate} x ${days} Days)` : undefined;

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

      <RiderReservationCard
        bikeTitle={bike.title}
        priceLine={priceLabel}
        bikeTypeLabel={bike.type}
        description={bike.description}
        bikeLine={`Bike: ${bike.title}`}
        sizeLine={`Size: ${bike.size}`}
        hostedBy={hostedBy}
        state={startValue && endValue ? "priced" : "draft"}
        startValue={startValue}
        endValue={endValue}
        totalChargesLine={total}
        onOpenStartPicker={() => openPicker(startRef)}
        onOpenEndPicker={() => openPicker(endRef)}
        onStartChange={setStartValue}
        onEndChange={setEndValue}
        onReserve={() => {
          patch({
            bikeId: bike.id,
            tripStart: startValue || null,
            tripEnd: endValue || null,
            datesKnown: !!(startValue && endValue),
          });
          router.push("/plan/reserve");
        }}
        startInputRef={startRef}
        endInputRef={endRef}
      />
    </div>
  );
}
