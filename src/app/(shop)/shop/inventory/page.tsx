"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PocH1, PocMuted, PocSelect } from "@/components/poc-ui";
import { Button } from "@/components/ui/Button/Button";
import { ShopInventoryCard } from "@/components/ui/ShopInventoryCard/ShopInventoryCard";
import { useShopSession } from "@/context/shop-session";
import styles from "../shop-pages.module.css";

export default function ShopInventoryPage() {
  const router = useRouter();
  const { session, upsertBikeDraft } = useShopSession();
  const [status, setStatus] = useState<"all" | "active" | "inactive">("all");
  const [type, setType] = useState<"all" | "Road" | "Mountain" | "Gravel" | "E-Bike">("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [removedIds, setRemovedIds] = useState<string[]>([]);
  const [draftBike, setDraftBike] = useState({ bike: "", size: "", specs: "", rate: "" });

  const ratesByBikeId = useMemo(
    () =>
      new Map(
        session.rates.map((rate) => {
          const half =
            rate.halfDayRate !== undefined
              ? rate.halfDayRate
              : Math.round(rate.dailyRate * 0.625);
          return [rate.bikeId, `$${rate.dailyRate} Full Day | $${half} Half Day`];
        }),
      ),
    [session.rates],
  );

  const bikes = useMemo(() => {
    return session.inventory.filter((bike) => {
      if (removedIds.includes(bike.id)) return false;
      if (status !== "all" && bike.status !== status) return false;
      if (type !== "all" && bike.type !== type) return false;
      return true;
    });
  }, [removedIds, session.inventory, status, type]);

  return (
    <div className={styles.page}>
      <div className={styles.inventoryHeaderRow}>
        <PocH1>Inventory</PocH1>
        <div className={styles.inventoryFilters}>
          <div className={styles.inventoryFilterGroup}>
            <PocMuted>Status</PocMuted>
            <PocSelect
              className={styles.inventoryFilterControl}
              value={status}
              onChange={(e) => setStatus(e.currentTarget.value as typeof status)}
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </PocSelect>
          </div>
          <div className={styles.inventoryFilterGroup}>
            <PocMuted>Bike type</PocMuted>
            <PocSelect
              className={styles.inventoryFilterControl}
              value={type}
              onChange={(e) => setType(e.currentTarget.value as typeof type)}
            >
              <option value="all">All</option>
              <option value="Road">Road</option>
              <option value="Mountain">Mountain</option>
              <option value="Gravel">Gravel</option>
              <option value="E-Bike">E-Bike</option>
            </PocSelect>
          </div>
          <Button
            className={styles.inventoryFilterButton}
            onClick={() => router.push("/shop/inventory/new")}
          >
            Add bike
          </Button>
        </div>
      </div>
      <ul className={styles.list}>
        {bikes.map((bike) => (
          <li key={bike.id} className={styles.listItem}>
            <ShopInventoryCard
              mode={editingId === bike.id ? "edit" : "view"}
              imageUrl={bike.imageUrl}
              title={bike.title}
              bikeLine={`Bike: ${bike.title}`}
              sizeLine={`Size: ${bike.size}`}
              specsLine={`Specs: ${bike.model}`}
              rateLine={`Rate: ${ratesByBikeId.get(bike.id) ?? "$200 Full Day | $125 Half Day"}`}
              bikeValue={draftBike.bike}
              sizeValue={draftBike.size}
              specsValue={draftBike.specs}
              rateValue={draftBike.rate}
              onBikeValueChange={(value) => setDraftBike((current) => ({ ...current, bike: value }))}
              onSizeValueChange={(value) => setDraftBike((current) => ({ ...current, size: value }))}
              onSpecsValueChange={(value) => setDraftBike((current) => ({ ...current, specs: value }))}
              onRateValueChange={(value) => setDraftBike((current) => ({ ...current, rate: value }))}
              onEdit={() => {
                setEditingId(bike.id);
                setDraftBike({
                  bike: bike.title,
                  size: bike.size,
                  specs: bike.model,
                  rate: ratesByBikeId.get(bike.id) ?? "$200 Full Day | $125 Half Day",
                });
              }}
              onRemove={() => setRemovedIds((current) => [...current, bike.id])}
              onDuplicate={() => {
                const duplicateId = `bike-${Date.now()}`;
                upsertBikeDraft({
                  ...bike,
                  id: duplicateId,
                  title: `${bike.title} Copy`,
                });
              }}
              onCancel={() => {
                setEditingId(null);
                setDraftBike({ bike: "", size: "", specs: "", rate: "" });
              }}
              onSave={() => {
                upsertBikeDraft({
                  ...bike,
                  title: draftBike.bike.trim() || bike.title,
                  size: draftBike.size.trim() || bike.size,
                  model: draftBike.specs.trim() || bike.model,
                });
                setEditingId(null);
                setDraftBike({ bike: "", size: "", specs: "", rate: "" });
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
