import { useId } from "react";
import { Button } from "@/components/ui/Button/Button";
import styles from "./EmptyState.module.css";

export type EmptyStateAction = {
  label: string;
  href?: string;
  onClick?: () => void;
};

export type EmptyStateProps = {
  title: string;
  description: string;
  actions?: EmptyStateAction[];
  className?: string;
};

export function EmptyState({ title, description, actions = [], className }: EmptyStateProps) {
  const titleId = useId();

  return (
    <section
      className={[styles.root, className].filter(Boolean).join(" ")}
      aria-labelledby={titleId}
    >
      <div className={styles.content}>
        <h3 id={titleId} className={styles.title}>
          {title}
        </h3>
        <h4 className={styles.description}>{description}</h4>
      </div>

      {actions.length > 0 ? (
        <div className={styles.actions}>
          {actions.map((action) => {
            if (action.href) {
              return (
                <a
                  key={action.label}
                  href={action.href}
                  className={`sendy-btn sendy-btn--secondary sendy-btn--md ${styles.action}`}
                >
                  {action.label}
                </a>
              );
            }

            return (
              <Button
                key={action.label}
                type="button"
                variant="secondary"
                className={styles.action}
                onClick={action.onClick}
              >
                {action.label}
              </Button>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}

export default EmptyState;
