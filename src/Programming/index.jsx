import React, { useEffect, useState } from "react";
import Axios from "axios";
import styled from "styled-components";
import { useStore } from "../Utility/Store";
import { blueprint } from "./blueprints";
import { apiBaseUrl } from "../Config";

export { ProgramEditor } from "./ProgramEditor";

export const reducer = (state, action) => {
  switch (action.type) {
    case "APPEND_MY_PROGRAMS":
      const myProgramList = state.myProgramList;
      return {
        ...state,
        myProgramList: [...myProgramList, ...action.payload]
      };
    case "SET_SCHEMA":
      return {
        ...state,
        schema: action.payload.map(n => blueprint(n)).filter(n => n)
      };
    case "ADD_NODE":
      const program = state.program;
      program.nodes.push(action.payload);
      return {
        ...state,
        program: {
          ...state.program,
          program
        }
      };
    default:
      return state;
  }
};

export const init = {
  myProgramList: [],
  schema: [],
  program: {
    nodes: []
  }
};

export function Compiler() {
  const [store, dispatch] = useStore();
  const [error, setError] = useState(null);
  const [inProgress, setInProgress] = useState(null);

  const program = store.program;

  useEffect(() => {
    setError(null);
    if (!program.nodes.length) return;
    setInProgress(true);
    const p = {
      nodes: {
        ...program.nodes.map((n, i) => {
          const node = n.produceRemote();
          if (program.nodes[i + 1]) node.child = i + 1;
          return node;
        })
      }
    };
    p.nodes[-1] = {
      node: {
        Start: null
      },
      child: 0
    };
    Axios.post(`${apiBaseUrl}/script/compile`, p)
      .then(() => {
        setInProgress(false);
      })
      .catch(e => {
        setInProgress(false);
        if (!e.response || e.statusCode !== 400) console.error(e);
        setError(e.response && e.response.data);
      });
  }, [dispatch, program, setInProgress, setError]);

  if (inProgress) {
    return "Compiling...";
  }

  if (error) {
    return <pre>{JSON.stringify(error, null, 4)}</pre>;
  }

  return null;
}

export function Program() {
  // eslint-disable-next-line no-unused-vars
  const [store, dispatch] = useStore();
  const nodes = store.program.nodes;
  return (
    <List>
      {nodes.map((n, i) => (
        <li key={`program_node_${i}`}>
          {n.name}
          {n.extraRender ? n.extraRender() : null}
        </li>
      ))}
    </List>
  );
}

export function ScriptList() {
  const [store, dispatch] = useStore();

  useEffect(() => {
    Axios.get(apiBaseUrl + "/script/my_scripts", {
      withCredentials: true
    }).then(r => dispatch({ type: "APPEND_MY_PROGRAMS", payload: r.data }));
  }, [dispatch]);

  return (
    <List>
      {store.myProgramList.map(p => (
        <ScriptItem key={p.id}>{p.name}</ScriptItem>
      ))}
    </List>
  );
}

export const List = styled.ul``;

const ScriptItem = styled.li`
  diplay: inherit;
`;

export const SchemaNode = styled.li`
  cursor: pointer;
  border: 2px solid;
  border-radius: 3px;
  &:hover {
    background-color: lightgray;
  }
`;
