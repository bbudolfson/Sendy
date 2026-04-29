"use client";

import { useMemo, useState } from "react";
import { PocButtonLink, PocCard, PocH1, PocMuted, PocSelect, PocStack } from "@/components/poc-ui";
import { useShopSession } from "@/context/shop-session";
import styles from "../shop-pages.module.css";

export default function ShopInventoryPage() {
  const { session } = useShopSession();
  const [status, setStatus] = useState<"all" | "active" | "inactive">("all");
  const [type, setType] = useState<"all" | "Road" | "Mountain" | "Gravel" | "E-Bike">("all");

  const bikes = useMemo(() => {
    return session.inventory.filter((bike) => {
      if (status !== "all" && bike.status !== status) return false;
      if (type !== "all" && bike.type !== type) return false;
      return true;
    });
  }, [session.inventory, status, type]);

  return (
    <div className={styles.page}>
      <PocCard>
        <PocStack gap="md">
          <PocH1>Inventory</PocH1>
          <div className={styles.actions}>
            <div>
              <PocMuted>Status</PocMuted>
              <PocSelect value={status} onChange={(e) => setStatus(e.currentTarget.value as typeof status)}>
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </PocSelect>
            </div>
            <div>
              <PocMuted>Bike type</PocMuted>
              <PocSelect value={type} onChange={(e) => setType(e.currentTarget.value as typeof type)}>
                <option value="all">All</option>
                <option value="Road">Road</option>
                <option value="Mountain">Mountain</option>
                <option value="Gravel">Gravel</option>
                <option value="E-Bike">E-Bike</option>
              </PocSelect>
            </div>
            <PocButtonLink href="/shop/inventory/new">Add bike</PocButtonLink>
          </div>
          <ul className={styles.list}>
            {bikes.map((bike) => (
              <li key={bike.id} className={styles.listItem}>
                <div className={styles.row}>
                  <strong>{bike.title}</strong>
                  <span className={styles.pill}>{bike.status}</span>
                </div>
                <p className={styles.mutedText}>
                  {bike.type} - Size {bike.size}
                </p>
                <div className={styles.actions}>
                  <PocButtonLink href={`/shop/inventory/${bike.id}`} variant="secondary">
                    Edit
                  </PocButtonLink>
                  <PocButtonLink href={`/shop/inventory/${bike.id}/availability`} variant="secondary">
                    Availability
                  </PocButtonLink>
                  <PocButtonLink href={`/shop/inventory/${bike.id}/rates`} variant="secondary">
                    Rates
                  </PocButtonLink>
                </div>
              </li>
            ))}
          </ul>
        </PocStack>
      </PocCard>
    </div>
  );
}
