"use client";

import { PocButton, PocCard, PocH1, PocInput, PocLabel, PocMuted, PocStack } from "@/components/poc-ui";
import { useShopSession } from "@/context/shop-session";
import styles from "../shop-pages.module.css";

export default function ShopEmbedPage() {
  const { session, addEmbedLink, canEnableEmbed } = useShopSession();
  const shopSlug = session.profile.shopName.trim().toLowerCase().replace(/\s+/g, "-");

  return (
    <div className={styles.page}>
      <div className={styles.shopPageHeaderRow}>
        <PocH1>Embed</PocH1>
      </div>
      <PocCard>
        <PocStack gap="md">
          <PocMuted>
            Generate copy-ready booking links for your existing website. Embed enablement depends on profile completeness and connected payouts.
          </PocMuted>
          <p>
            Embed ready: <strong>{canEnableEmbed ? "yes" : "no"}</strong>
          </p>
          <form
            className={styles.actions}
            onSubmit={(event) => {
              event.preventDefault();
              const form = new FormData(event.currentTarget);
              const label = String(form.get("label") ?? "Website booking");
              const source = String(form.get("source") ?? "site");
              const bikeId = String(form.get("bikeId") ?? "");
              const id = `embed-${Date.now()}`;
              const bikeQuery = bikeId ? `&bike=${encodeURIComponent(bikeId)}` : "";
              addEmbedLink({
                id,
                shopId: session.profile.id,
                label,
                url: `https://sendy.example.com/book/${shopSlug}?utm_source=${encodeURIComponent(source)}${bikeQuery}`,
              });
              event.currentTarget.reset();
            }}
          >
            <div>
              <PocLabel>Link label</PocLabel>
              <PocInput name="label" placeholder="Homepage button" />
            </div>
            <div>
              <PocLabel>Source tag</PocLabel>
              <PocInput name="source" placeholder="main_site" />
            </div>
            <div>
              <PocLabel>Bike id (optional)</PocLabel>
              <PocInput name="bikeId" placeholder="shop-bike-1" />
            </div>
            <PocButton type="submit" variant="secondary">
              Generate link
            </PocButton>
          </form>
          <ul className={styles.list}>
            {session.embedLinks.map((link) => (
              <li key={link.id} className={styles.listItem}>
                <p>
                  <strong>{link.label}</strong>
                </p>
                <p className={styles.mutedText}>{link.url}</p>
                <code>&lt;a href="{link.url}"&gt;Book now&lt;/a&gt;</code>
              </li>
            ))}
          </ul>
        </PocStack>
      </PocCard>
    </div>
  );
}
