"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { uploadBikePhoto, upsertShopBike } from "@/app/actions/bikes";
import { PocButtonLink, PocH1, PocMuted } from "@/components/poc-ui";
import { useShopSession } from "@/context/shop-session";
import { useSupabase } from "@/context/supabase-provider";
import { getShopBikeGallery } from "@/lib/dummy-data";
import type { ShopBike } from "@/lib/domain/types";
import {
  BikeInventoryForm,
  bikePhotoUrls,
  bikeToFormDefaults,
  type BikeInventoryFormValues,
} from "../bike-inventory-form";
import pageStyles from "../../shop-pages.module.css";
import layoutStyles from "../new/new-bike-page.module.css";

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

export default function InventoryBikeDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { configured } = useSupabase();
  const { session, upsertBikeDraft, setBikeRates } = useShopSession();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const bike = session.inventory.find((item) => item.id === params.id);
  const rates = session.rates.find((rate) => rate.bikeId === params.id);

  const formDefaults = useMemo(
    () => (bike ? bikeToFormDefaults(bike, rates) : undefined),
    [bike, rates],
  );

  const initialPhotos = useMemo(
    () => (bike ? bikePhotoUrls(bike, getShopBikeGallery(bike.id)) : []),
    [bike],
  );

  if (!bike) {
    return (
      <div className={pageStyles.page}>
        <div className={pageStyles.shopPageHeaderRow}>
          <PocH1>Bike not found</PocH1>
          <div className={pageStyles.shopPageHeaderActions}>
            <PocButtonLink href="/shop/inventory" variant="secondary">
              Back to fleet
            </PocButtonLink>
          </div>
        </div>
      </div>
    );
  }

  const saveBike = async (values: BikeInventoryFormValues) => {
    setError(null);
    setPending(true);
    const photoUrls = await resolvePhotoUrls(values.photos, configured);

    const title = `${values.brand} ${values.model}`.trim() || values.brand || values.model || bike.title;
    const updatedBike: ShopBike = {
      ...bike,
      title,
      brand: values.brand,
      model: values.model,
      type: values.type,
      size: values.size,
      description: values.description,
      imageUrl: photoUrls[0] ?? bike.imageUrl,
      photoUrls: photoUrls.length > 0 ? photoUrls : undefined,
    };

    const updatedRates = {
      bikeId: bike.id,
      dailyRate: values.dailyRate,
      halfDayRate: values.halfDayRate > 0 ? values.halfDayRate : undefined,
      weeklyRate: Math.max(1, Math.round(values.dailyRate * 5)),
      deposit: Math.max(50, Math.round(values.dailyRate * 2)),
      seasonalNote: rates?.seasonalNote ?? "",
    };

    if (configured) {
      const result = await upsertShopBike(updatedBike, updatedRates);
      setPending(false);
      if (!result.ok) {
        setError(result.error ?? "Failed to save bike");
        return;
      }
      router.push("/shop/inventory");
      return;
    }

    upsertBikeDraft(updatedBike);
    setBikeRates(updatedRates);
    setPending(false);
    router.push("/shop/inventory");
  };

  return (
    <div className={pageStyles.page}>
      <div className={pageStyles.shopPageHeaderRow}>
        <PocH1>Edit bike</PocH1>
      </div>

      <div className={`${pageStyles.pageWide} ${layoutStyles.card}`}>
        <BikeInventoryForm
          key={bike.id}
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
