import { forwardRef, type ReactNode } from "react";
import { Button } from "@/components/ui/Button/Button";
import { Select } from "@/components/ui/Select/Select";
import styles from "./poc-ui.module.css";

type PocButtonVariant = "primary" | "secondary" | "ghost";

const variantToButtonVariant: Record<PocButtonVariant, "primary" | "secondary" | "ghost"> = {
  primary: "primary",
  secondary: "secondary",
  ghost: "ghost",
};

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
  variant?: PocButtonVariant;
}) {
  const mappedVariant = variantToButtonVariant[variant];
  return (
    <a className={`sendy-btn sendy-btn--${mappedVariant} sendy-btn--md`} href={href}>
      {children}
    </a>
  );
}

export function PocButton({
  type = "button",
  children,
  variant = "primary",
  className,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: PocButtonVariant;
}) {
  const mappedVariant = variantToButtonVariant[variant];
  return (
    <Button
      type={type}
      variant={mappedVariant}
      size="md"
      className={className}
      {...rest}
    >
      {children}
    </Button>
  );
}

export function PocLabel({ children, className, htmlFor }: React.LabelHTMLAttributes<HTMLLabelElement> & { children: ReactNode }) {
  return (
    <label htmlFor={htmlFor} className={[styles.label, className].filter(Boolean).join(" ")}>
      {children}
    </label>
  );
}

export const PocInput = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function PocInput(props, ref) {
    const { className, ...rest } = props;
    return <input ref={ref} className={[styles.input, className].filter(Boolean).join(" ")} {...rest} />;
  },
);

export const PocCheckbox = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function PocCheckbox(props, ref) {
    return <input ref={ref} type="checkbox" {...props} />;
  },
);

export const PocSelect = forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  function PocSelect(props, ref) {
    const { className, ...rest } = props;
    return <Select ref={ref} className={[styles.input, className].filter(Boolean).join(" ")} {...rest} />;
  },
);

export const PocTextarea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function PocTextarea(props, ref) {
    const { className, ...rest } = props;
    return (
      <textarea
        ref={ref}
        className={[styles.input, styles.textarea, className].filter(Boolean).join(" ")}
        rows={4}
        {...rest}
      />
    );
  },
);
