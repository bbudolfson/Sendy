"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { uploadBikePhoto, upsertShopBike } from "@/app/actions/bikes";
import {
  PocButton,
  PocH1,
  PocInput,
  PocLabel,
  PocMuted,
  PocSelect,
  PocTextarea,
} from "@/components/poc-ui";
import { InventoryPhotoColumn } from "@/components/ui/InventoryPhotoColumn/InventoryPhotoColumn";
import { useShopSession } from "@/context/shop-session";
import { useSupabase } from "@/context/supabase-provider";
import { createDefaultAvailabilityRulesForBike } from "@/lib/dummy-data";
import type { ShopBike } from "@/lib/domain/types";
import pageStyles from "../../shop-pages.module.css";
import styles from "./new-bike-page.module.css";

function parseMoney(raw: unknown): number {
  const cleaned = String(raw ?? "")
    .replace(/[^\d.-]/g, "")
    .trim();
  const n = Number.parseFloat(cleaned);
  return Number.isFinite(n) ? Math.max(0, n) : 0;
}

export default function NewBikePage() {
  const router = useRouter();
  const { configured } = useSupabase();
  const { session, upsertBikeDraft, setBikeAvailabilityRules, setBikeRates } = useShopSession();
  const [photos, setPhotos] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const form = new FormData(event.currentTarget);
    const brand = String(form.get("brand") ?? "").trim();
    const model = String(form.get("model") ?? "").trim();
    const title = `${brand} ${model}`.trim() || brand || model || "New bike";
    const marketId = String(form.get("marketId") ?? "").trim() || null;

    const id = `shop-bike-${Date.now()}`;
    const dailyRate = parseMoney(form.get("dailyRate"));
    const halfDayRate = parseMoney(form.get("halfDayRate"));

    let photoUrls = [...photos];
    if (configured && photos.some((p) => p.startsWith("blob:"))) {
      setPending(true);
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
      photoUrls = uploaded;
      setPending(false);
    }

    const bike: ShopBike = {
      id,
      shopId: session.profile.id,
      title,
      brand,
      model,
      type: String(form.get("type") ?? "Mountain") as ShopBike["type"],
      size: String(form.get("size") ?? "").trim(),
      description: String(form.get("description") ?? "").trim(),
      imageUrl: photoUrls[0] ?? "",
      photoUrls: photoUrls.length > 0 ? photoUrls : undefined,
      status: "active",
    };

    const rates = {
      bikeId: id,
      dailyRate,
      halfDayRate: halfDayRate > 0 ? halfDayRate : undefined,
      weeklyRate: Math.max(1, Math.round(dailyRate * 5)),
      deposit: Math.max(50, Math.round(dailyRate * 2)),
      seasonalNote: "",
    };

    if (configured) {
      setPending(true);
      const result = await upsertShopBike(bike, rates, marketId);
      setPending(false);
      if (!result.ok) {
        setError(result.error ?? "Failed to save bike");
        return;
      }
      router.push("/shop");
      return;
    }

    upsertBikeDraft(bike);
    setBikeAvailabilityRules(id, createDefaultAvailabilityRulesForBike(id));
    setBikeRates(rates);
    router.push("/shop");
  };

  return (
    <div className={pageStyles.page}>
      <div className={pageStyles.shopPageHeaderRow}>
        <PocH1>Add a bike</PocH1>
      </div>

      <div className={`${pageStyles.pageWide} ${styles.card}`}>
        <form className={styles.layout} onSubmit={onSubmit}>
          <InventoryPhotoColumn photos={photos} onPhotosChange={setPhotos} />

          <div className={styles.fields}>
            {error ? <p role="alert">{error}</p> : null}
            <div>
              <PocLabel htmlFor="add-bike-market">Market</PocLabel>
              <PocSelect id="add-bike-market" name="marketId" required defaultValue="bend">
                <option value="moab">Moab, UT</option>
                <option value="bend">Bend, OR</option>
                <option value="boulder">Boulder, CO</option>
              </PocSelect>
            </div>
            <div>
              <PocLabel htmlFor="add-bike-brand">Brand</PocLabel>
              <PocInput id="add-bike-brand" name="brand" required placeholder="Santa Cruz" />
            </div>
            <div>
              <PocLabel htmlFor="add-bike-model">Model</PocLabel>
              <PocInput id="add-bike-model" name="model" required placeholder="Nomad" />
            </div>
            <div>
              <PocLabel htmlFor="add-bike-size">Size</PocLabel>
              <PocSelect id="add-bike-size" name="size" required defaultValue="Large">
                <option>X-Small</option>
                <option>Small</option>
                <option>Medium</option>
                <option>Large</option>
                <option>X-Large</option>
                <option>XX-Large</option>
              </PocSelect>
            </div>
            <div>
              <PocLabel htmlFor="add-bike-type">Type</PocLabel>
              <PocSelect id="add-bike-type" name="type" defaultValue="Mountain">
                <option>Road</option>
                <option>Mountain</option>
                <option>Gravel</option>
                <option>E-Bike</option>
              </PocSelect>
            </div>
            <div>
              <PocLabel htmlFor="add-bike-description">Description</PocLabel>
              <PocTextarea
                id="add-bike-description"
                name="description"
                placeholder="$200 Full Day | $125 Half Day"
                rows={3}
              />
            </div>
            <div>
              <PocLabel htmlFor="add-bike-daily">Daily rate</PocLabel>
              <PocInput
                id="add-bike-daily"
                name="dailyRate"
                inputMode="decimal"
                placeholder="$200"
                required
              />
            </div>
            <div>
              <PocLabel htmlFor="add-bike-half">Half day rate</PocLabel>
              <PocInput
                id="add-bike-half"
                name="halfDayRate"
                inputMode="decimal"
                placeholder="$125"
                required
              />
            </div>

            <div className={styles.footer}>
              <PocButton type="button" variant="secondary" onClick={() => router.push("/shop/inventory")}>
                Cancel
              </PocButton>
              <PocButton type="submit" disabled={pending}>
                {pending ? "Saving…" : "Save"}
              </PocButton>
            </div>
          </div>
        </form>
      </div>

      <PocMuted>Weekly hours and blocked dates can be managed on each bike’s Availability page.</PocMuted>
    </div>
  );
}
