import Head from "next/head";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Cao-Lo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.grid}>
          <a href="/world-map" >Go to map</a>
        </div>
      </main>

      <footer className={styles.footer}>TBA</footer>
    </div>
  );
}
