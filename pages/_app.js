import "../styles/globals.css";
import { Provider } from "react-redux";
import { useStore } from "../store";
import Header from "../components/Header";

function MyApp({ Component, pageProps }) {
  const store = useStore(pageProps.initialReduxState);
  return (
    <>
      <Provider store={store}>
        <Header apiUrl={pageProps.apiUrl}></Header>
        <Component {...pageProps} />
      </Provider>
    </>
  );
}

export default MyApp;
