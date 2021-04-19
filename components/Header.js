import Head from "next/head";
import Link from "next/link";
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

          dispatch({
            type: "USER.SET_TOKEN",
            token: null,
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
                <Link href="/">
                  <a>Cao-Lo</a>
                </Link>
              </li>
              <li className={styles["nav-item"]}>
                <Link href="/world-map">
                  <a>World Map</a>
                </Link>
              </li>
              <li className={styles["nav-item"]}>
                <Link href="/script-editor">
                  <a>Scripting</a>
                </Link>
              </li>
              {!userName ? (
                <>
                  <li className={styles["nav-item"]}>
                    <Link href="/login">
                      <a>Login</a>
                    </Link>
                  </li>
                  <li className={styles["nav-item"]}>
                    <Link href="/register">
                      <a>Register</a>
                    </Link>
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
