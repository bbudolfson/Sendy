"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { PocButton, PocButtonLink, PocInput, PocLabel } from "@/components/poc-ui";
import { getShopBikeById, getShopBikeGallery } from "@/lib/dummy-data";
import styles from "./bike-detail.module.css";

export default function BikeDetailPage() {
  const params = useParams();
  const id = String(params.id ?? "");
  const bike = getShopBikeById(id);
  const gallery = getShopBikeGallery(id);
  const [activeIndex, setActiveIndex] = useState(0);

  if (!bike) {
    return (
      <div className={styles.page}>
        <div className={styles.detailsCard}>
          <p className={styles.title}>Bike not found</p>
          <PocButtonLink href="/dashboard" variant="secondary">
            Back to search
          </PocButtonLink>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <a href="/dashboard" className={styles.backLink} aria-label="Back to dashboard">
          ←
        </a>
        <div>
          <h1 className={styles.pageTitle}>{bike.title}</h1>
        </div>
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

      <div className={styles.detailsCard}>
        <div className={styles.detailsTop}>
          <div>
            <p className={styles.title}>{bike.title}</p>
            <p className={styles.meta}>${200} per day</p>
          </div>
          <form className={styles.reserveForm}>
            <div className={styles.reserveDates}>
              <div>
                <PocLabel>Start</PocLabel>
                <PocInput type="date" name="startDate" />
              </div>
              <div>
                <PocLabel>End</PocLabel>
                <PocInput type="date" name="endDate" />
              </div>
            </div>
            <PocButton type="submit">Reserve</PocButton>
          </form>
        </div>
        <p className={styles.description}>{bike.description}</p>

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
      </div>
    </div>
  );
}
