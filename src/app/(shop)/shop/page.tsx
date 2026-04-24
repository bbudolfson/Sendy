import styles from "./shop-page.module.css";

export default function ShopHomePage() {
  return (
    <div>
      <h1 className={styles.h1}>Shop dashboard</h1>
      <p className={styles.p}>
        Placeholder for shop-side inventory and orders. Rider flows use dummy
        data under the main app.
      </p>
    </div>
  );
}
