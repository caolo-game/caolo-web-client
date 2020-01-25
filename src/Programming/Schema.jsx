import React, { useEffect } from "react";
import Axios from "axios";
import { useStore } from "../Utility/Store";
import { apiBaseUrl } from "../Config";
import { List, SchemaNode } from "./index";

export default function Schema() {
  const [store, dispatch] = useStore();
  useEffect(() => {
    Axios.get(apiBaseUrl + "/script/schema").then(r =>
      dispatch({ type: "SET_SCHEMA", payload: r.data })
    );
  }, [dispatch]);
  return (
    <List>
      {store.schema.map(n => (
        <SchemaNode
          key={n.name}
          onClick={() => dispatch({ type: "ADD_NODE", payload: n })}
        >
          {n.name}
        </SchemaNode>
      ))}
    </List>
  );
}
