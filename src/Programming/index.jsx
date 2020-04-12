import React, { useEffect } from "react";
import Axios from "axios";
import styled from "styled-components";
import { useStore } from "../Utility/Store";
import { makeBlueprint } from "./blueprints";
import { apiBaseUrl } from "../Config";

export const reducer = (state, action) => {
  switch (action.type) {
    case "APPEND_MY_PROGRAMS":
      const myProgramList = state.myProgramList;
      const programs = action.payload;
      // TODO: load the programs
      return {
        ...state,
        myProgramList: [...myProgramList, ...programs],
      };
    case "SET_SCHEMA":
      return {
        ...state,
        schema: action.payload.map(makeBlueprint).filter((n) => n),
      };
    case "CLEAR_PROGRAM": {
      const program = { ...state.program };
      program.nodes.length = 0;
      return {
        ...state,
        program,
      };
    }
    case "SET_PROGRAM": {
      const program = action.payload;
      return {
        ...state,
        program,
      };
    }
    case "ADD_NODE": {
      const program = state.program;
      program.nodes.push(action.payload);
      return {
        ...state,
        program: {
          ...state.program,
          program,
        },
      };
    }
    case "NODE_CHANGED":
      // trigger program change events
      return { ...state, program: { ...state.program } };
    case "SET_COMPILATION_ERROR":
      return { ...state, compilationError: action.payload };
    case "SET_PROGRAM_NAME":
      return { ...state, programName: action.payload };
    default:
      return state;
  }
};

export const init = {
  myProgramList: [],
  schema: [],
  program: {
    nodes: [],
  },
  compilationError: null,
};

const ProgramSpan = styled.span`
  margin-right: 5px;
`;

export function Program() {
  // eslint-disable-next-line no-unused-vars
  const [store] = useStore();
  const nodes = store.program.nodes;
  return (
    <List>
      {nodes.map((n, i) => (
        <li id={`program_node_${i}`} key={`program_node_${i}`}>
          <ProgramSpan>[{i}]</ProgramSpan>
          <ProgramSpan>{n.name}</ProgramSpan>
          {n.extraRender ? n.extraRender() : null}
        </li>
      ))}
    </List>
  );
}

export function ScriptList() {
  const [store, dispatch] = useStore();
  const programs = store.myProgramList;

  useEffect(() => {
    Axios.get(apiBaseUrl + "/script/my_scripts", {
      withCredentials: true,
    }).then((r) => dispatch({ type: "APPEND_MY_PROGRAMS", payload: r.data }));
  }, [dispatch]);

  return (
    <List>
      {programs.map((p, i) => (
        <ScriptItem
          onClick={() => dispatch({ type: "SET_PROGRAM", payload: p.program })}
          key={`program-node-${i}`}
          id={`program-node-${i}`}
        >
          {p.name}
        </ScriptItem>
      ))}
    </List>
  );
}

export const List = styled.ul``;

const ScriptItem = styled.li`
  diplay: inherit;
  font-size: 1em;
  margin-top: 0.1em;
  padding: 0.25em 1em;
  border-radius: 3px;
  cursor: pointer;
  &:hover {
    background-color: ${(props) => props.theme.secondary};
  }
  border: 2px solid ${(props) => props.theme.primary};
`;

export const SchemaNode = styled.li`
  font-size: 1em;
  margin-top: 0.1em;
  cursor: pointer;
  border: 2px solid ${(props) => props.theme.primary};
  border-radius: 3px;
  padding: 0.25em 1em;
  &:hover {
    background-color: ${(props) => props.theme.secondary};
  }
`;
