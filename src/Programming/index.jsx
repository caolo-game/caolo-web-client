import React, { useEffect } from "react";
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
