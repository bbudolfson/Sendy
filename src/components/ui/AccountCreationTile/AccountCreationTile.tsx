import styles from "./AccountCreationTile.module.css";

export type AccountCreationTileProps = {
  profileComplete: boolean;
  paymentComplete: boolean;
  fleetComplete: boolean;
  profileHref?: string;
  paymentsHref?: string;
  fleetHref?: string;
  className?: string;
};

type StepProps = {
  number: number;
  title: string;
  description: string;
  complete: boolean;
  ctaLabel: string;
  href: string;
};

function SetupStep({ number, title, description, complete, ctaLabel, href }: StepProps) {
  return (
    <li className={styles.step}>
      <div className={styles.stepMain}>
        <span className={styles.stepNumber} aria-hidden="true">
          {number}.
        </span>
        <div className={styles.stepBody}>
          <h3 className={styles.stepTitle}>{title}</h3>
          <p className={styles.stepDesc}>{description}</p>
        </div>
      </div>
      <div className={styles.stepAction}>
        {complete ? (
          <span className={styles.done}>Done</span>
        ) : (
          <a className={`sendy-btn sendy-btn--primary sendy-btn--md ${styles.cta}`} href={href}>
            {ctaLabel}
          </a>
        )}
      </div>
    </li>
  );
}

export function AccountCreationTile({
  profileComplete,
  paymentComplete,
  fleetComplete,
  profileHref = "/shop/profile",
  paymentsHref = "/shop/payments",
  fleetHref = "/shop/inventory/new",
  className,
}: AccountCreationTileProps) {
  return (
    <section className={[styles.tile, className].filter(Boolean).join(" ")} aria-labelledby="account-creation-heading">
      <h2 id="account-creation-heading" className={styles.title}>
        Just a couple things left to get renting...
      </h2>

      <ol className={styles.steps}>
        <SetupStep
          number={1}
          title="Create Your Profile"
          description="Let renters know where the bike is coming from."
          complete={profileComplete}
          ctaLabel="Create Your Profile"
          href={profileHref}
        />
        <SetupStep
          number={2}
          title="Set up Your Fleet"
          description="Share your inventory with renters."
          complete={fleetComplete}
          ctaLabel="Add a Bike"
          href={fleetHref}
        />
        <SetupStep
          number={3}
          title="Set up Payments"
          description="Let's get you paid for those rentals."
          complete={paymentComplete}
          ctaLabel="Connect Stripe"
          href={paymentsHref}
        />
      </ol>
    </section>
  );
}
