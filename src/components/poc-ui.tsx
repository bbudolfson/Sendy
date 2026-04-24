import type { ReactNode } from "react";
import styles from "./poc-ui.module.css";

export function PocStack({
  children,
  gap = "md",
}: {
  children: ReactNode;
  gap?: "sm" | "md" | "lg";
}) {
  return (
    <div className={styles.stack} data-gap={gap}>
      {children}
    </div>
  );
}

export function PocCard({ children }: { children: ReactNode }) {
  return <div className={styles.card}>{children}</div>;
}

export function PocH1({ children }: { children: ReactNode }) {
  return <h1 className={styles.h1}>{children}</h1>;
}

export function PocH2({ children }: { children: ReactNode }) {
  return <h2 className={styles.h2}>{children}</h2>;
}

export function PocMuted({ children }: { children: ReactNode }) {
  return <p className={styles.muted}>{children}</p>;
}

export function PocButtonLink({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
}) {
  return (
    <a className={styles.btn} data-variant={variant} href={href}>
      {children}
    </a>
  );
}

export function PocButton({
  type = "button",
  children,
  variant = "primary",
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
}) {
  return (
    <button
      type={type}
      className={styles.btn}
      data-variant={variant}
      {...rest}
    >
      {children}
    </button>
  );
}

export function PocLabel({ children }: { children: ReactNode }) {
  return <label className={styles.label}>{children}</label>;
}

export function PocInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={styles.input} {...props} />;
}

export function PocSelect(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={styles.input} {...props} />;
}

export function PocTextarea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
  return <textarea className={styles.input} rows={4} {...props} />;
}
