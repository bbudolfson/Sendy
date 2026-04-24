import styles from "./landing.module.css";

export default function LandingPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.logo}>Sendy</span>
      </header>
      <main className={styles.main}>
        <h1 className={styles.h1}>Rent a bike like a local</h1>
        <p className={styles.lead}>
          Rider-side proof of concept. Use dummy locations (try Moab or Bend) to
          explore trip planning, delivery, and checkout.
        </p>
        <div className={styles.actions}>
          <a className={styles.primary} href="/sign-in">
            I have an account
          </a>
          <a className={styles.secondary} href="/create-account">
            Create an account
          </a>
        </div>
        <p className={styles.note}>
          <a href="/shop">Shop dashboard shell</a> (placeholder)
        </p>
      </main>
    </div>
  );
}
