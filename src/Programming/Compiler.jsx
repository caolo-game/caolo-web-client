import React, { useEffect, useState } from "react";
import Axios from "axios";
import { useStore } from "../Utility/Store";
import { apiBaseUrl } from "../Config";
import styled from "styled-components";

function createProgramDTO(program) {
  return {
    nodes: {
      "-1": {
        node: {
          Start: null
        },
        child: 0
      },
      ...program.nodes.map((n, i) => {
        const node = n.produceRemote();
        if (program.nodes[i + 1]) node.child = i + 1;
        return node;
      })
    }
  };
}

function Compiler() {
  const [store, dispatch] = useStore();
  const [inProgress, setInProgress] = useState(null);
  const program = store.program;
  const error = store.compilationError;
  useEffect(() => {
    dispatch({ type: "SET_COMPILATION_ERROR", payload: null });
    if (!program.nodes.length) return;
    setInProgress(true);
    const p = createProgramDTO(program);
    Axios.post(`${apiBaseUrl}/script/compile`, p)
      .then(() => {
        setInProgress(false);
      })
      .catch(e => {
        setInProgress(false);
        if (!e.response || e.statusCode !== 400) console.error(e);
        dispatch({
          type: "SET_COMPILATION_ERROR",
          payload: (e.response && e.response.data) || e
        });
      });
  }, [dispatch, program, setInProgress]);
  if (inProgress) {
    return "Compiling...";
  }
  if (error) {
    return JSON.stringify(error);
  }
  return (
    <>
      "Compiled successfully"
      <Commmit />
    </>
  );
}

const CommitButton = styled.button`
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border-radius: 3px;
  color: ${props => props.theme.main};
  border: 2px solid ${props => props.theme.main};
`;

function Commmit() {
  const [store, dispatch] = useStore();
  const [inProgress, setInProgress] = useState(null);

  return (
    <>
      <CommitButton
        disabled={inProgress}
        onClick={() => {
          const program = store.program;
          if (!program.nodes.length) return;
          setInProgress(true);
          const p = createProgramDTO(program);
          p.name = "__placeholder__";
          Axios.post(`${apiBaseUrl}/script/commit`, p, {
            withCredentials: true
          })
            .then(() => {
              setInProgress(false);
            })
            .catch(e => {
              setInProgress(false);
              if (!e.response || e.statusCode !== 400) console.error(e);
              dispatch({
                type: "SET_COMPILATION_ERROR",
                payload: (e.response && e.response.data) || e
              });
            });
        }}
      >
        Commit
      </CommitButton>
    </>
  );
}

export default function Container() {
  return <Compiler></Compiler>;
}