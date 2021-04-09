import Head from "next/head";
import styles from "../styles/Header.module.css";

export default function Header({ title }) {
  return (
    <>
      <Head>
        <title>{title ? title : "Cao-Lo"}</title>
      </Head>
      <div className={styles.wrapper}>
        <nav className={styles.main}>
          <div className={styles.container}>
            <ul className={styles["nav-ul"]}>
              <li className={styles["nav-item"]}>
                <a href="/">Cao-Lo</a>
              </li>
              <li className={styles["nav-item"]}>
                <a href="/world-map">World Map</a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </>
  );
}
