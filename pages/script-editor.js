import { useDispatch } from "react-redux";

import Scripting from "../components/Scripting";
import { useEffect } from "react";

export default function ScriptPage({ apiUrl }) {
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      await fetch(`${apiUrl}/scripting/schema`)
        .then((r) => r.json())
        .then((schema) => {
          dispatch({
            type: "SCRIPT.SET_SCHEMA",
            schema,
          });
          return schema;
        });
    })();
  }, [apiUrl]);

  return <Scripting />;
}

export async function getStaticProps(context) {
  const { NEXT_CAO_API_URL: apiUrl } = process.env;

  return {
    props: {
      apiUrl,
    },
  };
}
