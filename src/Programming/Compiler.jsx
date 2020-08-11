import React, { useEffect, useState } from "react";
import Axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { useStore } from "../Utility/Store";
import { apiBaseUrl, auth0Audience } from "../Config";
import styled from "styled-components";
import { useCaoLang } from "../CaoWasm";

function createProgramDTO(name, program) {
  return {
    name,
    cu: {
      nodes: {
        "-1": {
          node: {
            Start: null,
          },
          child: 0,
        },
        ...program.nodes.map((n, i) => {
          const node = n.produceRemote();
          if (program.nodes[i + 1]) node.child = i + 1;
          return node;
        }),
      }
    }
  };
}

function createCompilationUnit(caoLang, program) {
  const cu = new caoLang.CompilationUnit();

  cu.nodeSet("-1", new caoLang.AstNode({ Start: null }, 0));
  for (let i in program.nodes) {
    const n = program.nodes[i];
    const node = n.produceRemote();
    let child = null;
    if (program.nodes[i + 1]) child = i + 1;
    try {
      cu.nodeSet(i, new caoLang.AstNode(node.node, child));
    } catch (e) {
      console.error("Failed to create AstNode from ", node, child, e);
      throw e;
    }
  }
  return cu;
}

function Compiler() {
  const [store, dispatch] = useStore();
  const [inProgress, setInProgress] = useState(null);
  const [caoLang, caoLangErr] = useCaoLang();

  const program = store.program;
  const error = store.compilationError;
  useEffect(() => {
    dispatch({ type: "SET_COMPILATION_ERROR", payload: null });
    if (!program.nodes.length) return;
    let cu;
    try {
      cu = createCompilationUnit(caoLang, program);
    } catch (e) {
      console.error(e);
      dispatch({
        type: "SET_COMPILATION_ERROR",
        payload: "Internal Error: Failed to produce compilation unit!",
      });
      return;
    }
    setInProgress(true);
    caoLang
      .compile(cu)
      .then(() => {
        setInProgress(false);
      })
      .catch((e) => {
        setInProgress(false);
        if (!e.response || e.statusCode !== 400) console.error(e);
        dispatch({
          type: "SET_COMPILATION_ERROR",
          payload: (e.response && e.response.data) || e,
        });
      });
  }, [dispatch, program, setInProgress, caoLang]);
  if (caoLangErr) {
    return "Failed to load CaoLang";
  }
  return (
    <>
      <div id="compilation-result">
        <CompilationResult
          error={error}
          inProgress={inProgress}
        ></CompilationResult>
      </div>
      {!inProgress && <Commmit />}
    </>
  );
}

const CompileError = styled.pre`
  color: #ff6666;
`;

function CompilationResult({ error, inProgress }) {
  if (inProgress) {
    return "Compiling...";
  }
  if (error) {
    return (<CompileError>
      {JSON.stringify(error, null, 4)}
    </CompileError>);
  }
  return "Compiled successfully";
}

const CommitButton = styled.button`
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border-radius: 3px;
  color: black;
  border: 2px solid ${(props) => props.theme.primary};
`;

function Commmit() {
  const [store, dispatch] = useStore();
  const [inProgress, setInProgress] = useState(null);
  const { getAccessTokenSilently } = useAuth0();

  return (
    <CommitButton
      disabled={inProgress}
      onClick={() => {
        const program = store.program;
        if (!program.nodes.length) return;
        setInProgress(true);
        const p = createProgramDTO(store.programName, program);
        getAccessTokenSilently({
          audience: auth0Audience
        }).then(token =>
          Axios.post(`${apiBaseUrl}/scripts/commit`, p, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
        )
          .then(() => {
            setInProgress(false);
          })
          .catch((e) => {
            setInProgress(false);
            if (!e.response || e.statusCode !== 400) console.error(e);
            dispatch({
              type: "SET_COMPILATION_ERROR",
              payload: (e.response && e.response.data) || e,
            });
          });
      }}
    >
      Save
    </CommitButton>
  );
}

export default function Container() {
  return <Compiler></Compiler>;
}
