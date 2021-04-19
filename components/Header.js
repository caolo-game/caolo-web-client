import Head from "next/head";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "../styles/Header.module.css";

export default function Header({ title, apiUrl }) {
  const userName = useSelector((state) => state?.user?.displayname);
  const token = useSelector((state) => state?.user?.token);
  const dispatch = useDispatch();

  // TODO: move this into another component for decoupling...
  useEffect(() => {
    if (token && apiUrl) {
      (async () => {
        const resp = await fetch(`${apiUrl}/myself`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!resp.ok) {
          dispatch({
            type: "USER.SET_USER_DATA",
            payload: null,
          });

          return;
        }
        const userData = await resp.json();
        dispatch({
          type: "USER.SET_USER_DATA",
          payload: userData,
        });
      })();
    }
  }, [token, apiUrl]);
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
              <li className={styles["nav-item"]}>
                <a href="/script-editor">Scripting</a>
              </li>
              {!userName ? (
                <>
                  <li className={styles["nav-item"]}>
                    <a href="/login">Login</a>
                  </li>
                  <li className={styles["nav-item"]}>
                    <a href="/register">Register</a>
                  </li>
                </>
              ) : null}
            </ul>
            {userName ? <div className={styles.profile}>{userName}</div> : null}
          </div>
        </nav>
      </div>
    </>
  );
}
