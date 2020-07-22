import React, { useEffect } from "react";
import styled from "styled-components";
import Axios from "axios";
import { useStore } from "../Utility/Store";
import { apiBaseUrl } from "../Config";
import { SchemaNode } from "./index";

const SchemaList = styled.ul`
`;

export default function Schema() {
  const [store, dispatch] = useStore();
  useEffect(() => {
    Axios.get(apiBaseUrl + "/schema").then((r) =>
      dispatch({ type: "SET_SCHEMA", payload: r.data.functions })
    );
  }, [dispatch]);
  return (
    <SchemaList>
      {store.schema.map((n) => (
        <SchemaNode
          key={n.name}
          id={`schema-node-${n.name}`}
          onClick={() => dispatch({ type: "ADD_NODE", payload: n })}
        >
          <div>
            <b>{n.name}</b>
          </div>
          <div>
            Parameters: {n.params ? (<Params params={n.params}></Params>) : '-'}
            <br />
            Stack:      [<Params params={n.input || []}></Params>] &rarr; [
            <Params params={n.output || []}></Params>]
          </div>
        </SchemaNode>
      ))}
    </SchemaList>
  );
}

function Params({ params }) {
  params = params.map((p) => p.split("::").pop());
  return params.join(", ");
}
