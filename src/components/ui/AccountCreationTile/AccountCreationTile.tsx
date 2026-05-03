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
        Just a couple things left to get renting…
      </h2>

      <ul className={styles.steps}>
        <li className={styles.step}>
          <div className={styles.stepBody}>
            <h3 className={styles.stepTitle}>Create Your Profile</h3>
            <p className={styles.stepDesc}>Setting up a profile will let renters know where the bike is coming from.</p>
          </div>
          {profileComplete ? (
            <span className={styles.done}>Done</span>
          ) : (
            <a className={`sendy-btn sendy-btn--primary sendy-btn--md ${styles.cta}`} href={profileHref}>
              Create Your Profile
            </a>
          )}
        </li>

        <li className={styles.step}>
          <div className={styles.stepBody}>
            <h3 className={styles.stepTitle}>Setup Payments</h3>
            <p className={styles.stepDesc}>
              Bookings cannot finish until we set up a payment system and payouts are enabled.
            </p>
          </div>
          {paymentComplete ? (
            <span className={styles.done}>Done</span>
          ) : (
            <a className={`sendy-btn sendy-btn--primary sendy-btn--md ${styles.cta}`} href={paymentsHref}>
              Setup Payments
            </a>
          )}
        </li>

        <li className={styles.step}>
          <div className={styles.stepBody}>
            <h3 className={styles.stepTitle}>Setup Your Fleet</h3>
            <p className={styles.stepDesc}>Get your bikes ready to rent by adding them to your fleet.</p>
          </div>
          {fleetComplete ? (
            <span className={styles.done}>Done</span>
          ) : (
            <a className={`sendy-btn sendy-btn--primary sendy-btn--md ${styles.cta}`} href={fleetHref}>
              Add a Bike
            </a>
          )}
        </li>
      </ul>
    </section>
  );
}
