import { useSelector } from "react-redux";
import { initializeStore } from "../store";

import PrototypeCollection from "../components/Scripting/PrototypeCollection";

export default function ScriptPage({ apiUrl }) {
  return <PrototypeCollection />;
}

export async function getServerSideProps(context) {
  const { NEXT_CAO_API_URL: apiUrl } = process.env;

  const reduxStore = initializeStore();
  const { dispatch } = reduxStore;

  await fetch(`${apiUrl}/scripting/schema`)
    .then((r) => r.json())
    .then((schema) => {
      dispatch({
        type: "SCRIPT.SET_SCHEMA",
        schema,
      });
      return schema;
    });

  return {
    props: {
      apiUrl,
      initialReduxState: reduxStore.getState(),
    },
  };
}
