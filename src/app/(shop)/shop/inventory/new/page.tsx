"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { uploadBikePhoto, upsertShopBike } from "@/app/actions/bikes";
import { PocH1, PocMuted } from "@/components/poc-ui";
import { useShopSession } from "@/context/shop-session";
import { useSupabase } from "@/context/supabase-provider";
import { createDefaultAvailabilityRulesForBike } from "@/lib/dummy-data";
import type { ShopBike } from "@/lib/domain/types";
import {
  BikeInventoryForm,
  bikePhotoUrls,
  bikeToFormDefaults,
  type BikeInventoryFormValues,
} from "../bike-inventory-form";
import pageStyles from "../../shop-pages.module.css";
import styles from "./new-bike-page.module.css";

async function resolvePhotoUrls(photos: string[], configured: boolean): Promise<string[]> {
  if (!configured || !photos.some((p) => p.startsWith("blob:"))) {
    return photos;
  }

  const uploaded: string[] = [];
  for (const preview of photos) {
    if (!preview.startsWith("blob:")) {
      uploaded.push(preview);
      continue;
    }
    const blob = await fetch(preview).then((r) => r.blob());
    const fd = new FormData();
    fd.set("file", new File([blob], "bike.jpg", { type: blob.type || "image/jpeg" }));
    const result = await uploadBikePhoto(fd);
    if (result.ok && result.url) uploaded.push(result.url);
  }
  return uploaded;
}

function NewBikePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const duplicateId = searchParams.get("duplicate");
  const { configured } = useSupabase();
  const { session, upsertBikeDraft, setBikeAvailabilityRules, setBikeRates } = useShopSession();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const sourceBike = useMemo(
    () => (duplicateId ? session.inventory.find((bike) => bike.id === duplicateId) : undefined),
    [duplicateId, session.inventory],
  );

  const sourceRates = useMemo(
    () => (sourceBike ? session.rates.find((rate) => rate.bikeId === sourceBike.id) : undefined),
    [session.rates, sourceBike],
  );

  const formDefaults = sourceBike ? bikeToFormDefaults(sourceBike, sourceRates) : undefined;
  const initialPhotos = sourceBike ? bikePhotoUrls(sourceBike) : [];

  const saveBike = async (values: BikeInventoryFormValues) => {
    setError(null);
    const title =
      `${values.brand} ${values.model}`.trim() || values.brand || values.model || "New bike";
    const id = `shop-bike-${Date.now()}`;

    setPending(true);
    const photoUrls = await resolvePhotoUrls(values.photos, configured);

    const bike: ShopBike = {
      id,
      shopId: session.profile.id,
      title: sourceBike ? `${title} Copy` : title,
      brand: values.brand,
      model: values.model,
      type: values.type,
      size: values.size,
      description: values.description,
      imageUrl: photoUrls[0] ?? "",
      photoUrls: photoUrls.length > 0 ? photoUrls : undefined,
      status: "active",
    };

    const rates = {
      bikeId: id,
      dailyRate: values.dailyRate,
      halfDayRate: values.halfDayRate > 0 ? values.halfDayRate : undefined,
      weeklyRate: Math.max(1, Math.round(values.dailyRate * 5)),
      deposit: Math.max(50, Math.round(values.dailyRate * 2)),
      seasonalNote: "",
    };

    if (configured) {
      const result = await upsertShopBike(bike, rates);
      setPending(false);
      if (!result.ok) {
        setError(result.error ?? "Failed to save bike");
        return;
      }
      router.push("/shop/inventory");
      return;
    }

    upsertBikeDraft(bike);
    setBikeAvailabilityRules(id, createDefaultAvailabilityRulesForBike(id));
    setBikeRates(rates);
    setPending(false);
    router.push("/shop/inventory");
  };

  return (
    <div className={pageStyles.page}>
      <div className={pageStyles.shopPageHeaderRow}>
        <PocH1>Add a bike</PocH1>
      </div>

      <div className={`${pageStyles.pageWide} ${styles.card}`}>
        <BikeInventoryForm
          key={duplicateId ?? "new"}
          initialPhotos={initialPhotos}
          defaultValues={formDefaults}
          error={error}
          pending={pending}
          onCancel={() => router.push("/shop/inventory")}
          onSubmit={saveBike}
        />
      </div>

      <PocMuted>Weekly hours and blocked dates can be managed on each bike’s Availability page.</PocMuted>
    </div>
  );
}

export default function NewBikePage() {
  return (
    <Suspense fallback={<PocMuted>Loading…</PocMuted>}>
      <NewBikePageContent />
    </Suspense>
  );
}
