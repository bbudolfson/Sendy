"use client";

import React, { useCallback, useRef } from "react";
import styles from "./InventoryPhotoColumn.module.css";

function TrashIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 7h16M10 7V5h4v2M9 7l1 12h4l1-12M10 11v6M14 11v6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export type InventoryPhotoColumnProps = {
  photos: string[];
  onPhotosChange: (next: string[]) => void;
  addButtonLabel?: string;
};

export function InventoryPhotoColumn({
  photos,
  onPhotosChange,
  addButtonLabel = "Add Photos",
}: InventoryPhotoColumnProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback(
    (files: File[]) => {
      const imageFiles = files.filter((f) => /^image\//.test(f.type));
      if (!imageFiles.length) return;
      const urls = imageFiles.map((f) => URL.createObjectURL(f));
      onPhotosChange([...photos, ...urls]);
    },
    [onPhotosChange, photos],
  );

  const removeAt = useCallback(
    (index: number) => {
      const url = photos[index];
      if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
      onPhotosChange(photos.filter((_, i) => i !== index));
    },
    [onPhotosChange, photos],
  );

  const onFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.currentTarget.files ?? []);
      addFiles(files);
      event.currentTarget.value = "";
    },
    [addFiles],
  );

  return (
    <div className={styles.column}>
      {photos.map((url, index) => (
        <div key={`${url}-${index}`} className={styles.row}>
          <div className={styles.thumbWrap}>
            {/* eslint-disable-next-line @next/next/no-img-element -- remote URLs + blob previews */}
            <img src={url} alt="" className={styles.thumb} />
          </div>
          <button
            type="button"
            className={styles.removeBtn}
            onClick={() => removeAt(index)}
            aria-label="Remove photo"
          >
            <TrashIcon />
          </button>
        </div>
      ))}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className={styles.visuallyHidden}
        aria-label={addButtonLabel}
        onChange={onFileChange}
      />
      <button type="button" className={styles.addPhotosBtn} onClick={() => inputRef.current?.click()}>
        {addButtonLabel}
      </button>
    </div>
  );
}
