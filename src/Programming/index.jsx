import React, { useEffect, useState } from "react";
import Axios from "axios";
import styled from "styled-components";
import { useStore } from "../Utility/Store";
import { makeBlueprint } from "./blueprints";
import { apiBaseUrl } from "../Config";

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
        schema: action.payload.map(makeBlueprint).filter(n => n)
      };
    case "CLEAR_PROGRAM": {
      const program = { ...state.program };
      program.nodes.length = 0;
      return {
        ...state,
        program
      };
    }
    case "ADD_NODE": {
      const program = state.program;
      program.nodes.push(action.payload);
      return {
        ...state,
        program: {
          ...state.program,
          program
        }
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
    nodes: []
  },
  compilationError: null
};

const ProgramSpan = styled.span`
  margin-right: 5px;
`;

export function Program() {
  // eslint-disable-next-line no-unused-vars
  const [store, dispatch] = useStore();
  const nodes = store.program.nodes;
  return (
    <List>
      {nodes.map((n, i) => (
        <li key={`program_node_${i}`}>
          <ProgramSpan>[{i}]</ProgramSpan>
          <ProgramSpan>{n.name}</ProgramSpan>
          {n.extraRender ? n.extraRender() : null}
        </li>
      ))}
    </List>
  );
}

export function ScriptList() {
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    Axios.get(apiBaseUrl + "/script/my_scripts", {
      withCredentials: true
    }).then(r => setPrograms(r.data));
  }, [setPrograms]);

  return (
    <List>
      {programs.map(p => (
        <ScriptItem key={p.id}>{p.name}</ScriptItem>
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
    background-color: ${props => props.theme.secondary};
  }
  border: 2px solid ${props => props.theme.primary};
`;

export const SchemaNode = styled.li`
  font-size: 1em;
  margin-top: 0.1em;
  cursor: pointer;
  border: 2px solid ${props => props.theme.primary};
  border-radius: 3px;
  padding: 0.25em 1em;
  &:hover {
    background-color: ${props => props.theme.secondary};
  }
`;
