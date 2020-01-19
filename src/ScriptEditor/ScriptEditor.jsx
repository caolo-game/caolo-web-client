import React, { useEffect } from "react";
import "./ScriptEditor.css";
import Websocket from "react-websocket";

import Axios from "axios";

import NodeEditor from "./NodeEditor";
import { scriptTileMetadata } from "./NodeEditor";

import SideBar from "./SideBar";
import { Store, useStore } from "../Utility/Store";
import * as Config from "../Config";

const initialState = {
  nodes: [],
  isInWiringMode: false,
  wireFromId: null,
  isCompilationInProgress: false,
  isCompilationSuccessful: true,
  simulationLog: []
};

let NEXT_NODE = 0;

const reducer = (state, action) => {
  switch (action.type) {
    case "START_WIRE": {
      return {
        ...state,
        isInWiringMode: true,
        wireFromId: action.payload
      };
    }
    case "END_WIRE": {
      if (!state.isInWiringMode || state.wireFromId === action.payload)
        return state;
      let newNodes = { ...state.nodes };
      newNodes[state.wireFromId].childNodes.push(action.payload);
      return {
        ...state,
        isInWiringMode: false,
        wireFromId: null,
        nodes: newNodes
      };
    }
    case "REMOVE_NODE": {
      let newNodes = { ...state.nodes };
      delete newNodes[action.payload];
      return { ...state, nodes: newNodes };
    }
    case "ADD_NODE": {
      let newNodes = { ...state.nodes };
      let schema = state.simulationSchema;
      const node = schema[action.payload];
      node.id = NEXT_NODE++;
      newNodes[node.id] = { ...node, childNodes: [] };
      return {
        ...state,
        nodes: newNodes
      };
    }
    case "COMPILATION_START": {
      return {
        ...state,
        isCompilationInProgress: true
      };
    }
    case "COMPILATION_SUCCESS": {
      return {
        ...state,
        isCompilationInProgress: false,
        isCompilationSuccessful: true
      };
    }
    case "COMPILATION_ERROR": {
      return {
        ...state,
        isCompilationInProgress: false,
        isCompilationSuccessful: false
      };
    }
    case "LOG_SIMULATION": {
      let simulationLog = [...state.simulationLog];
      simulationLog.push(JSON.stringify(JSON.parse(action.payload).log));
      simulationLog = simulationLog.slice(0, 10);
      return {
        ...state,
        simulationLog
      };
    }
    case "UPDATE_SCHEMA": {
      let payload = action.payload
        .filter(node => scriptTileMetadata(node.name) !== null)
        .map(node => ({
          ...node,
          ...scriptTileMetadata(node.name)
        }))
        .reduce(
          (obj, node) => ({
            ...obj,
            [node["name"]]: node
          }),
          {}
        );
      return {
        ...state,
        simulationSchema: payload
      };
    }
    default:
      return state;
  }
};

const JSONPanel = props => {
  const [store] = useStore();
  return (
    <div
      style={{
        background: "white",
        width: "20%",
        height: "100%",
        padding: "10px"
      }}
    >
      <div style={{ height: "33%", overflowX: "auto" }}>
        <pre>{JSON.stringify(store.simulationSchema, null, 4)}</pre>
      </div>
      <div style={{ height: "33%", overflowX: "auto" }}>
        {store.simulationLog}
      </div>
    </div>
  );
};

const Compiler = props => {
  const [store, dispatch] = useStore();

  useEffect(() => {
    let nodes = {};
    for (let node of Object.values(store.nodes)) {
      nodes = node.remoteFactory(nodes, node);
    }
    const schema = { nodes, name: "placeholder" };

    dispatch({ type: "COMPILATION_START" });
    Axios.post(Config.apiBaseUrl + "/script/compile", JSON.stringify(schema))
      .then(result => dispatch({ type: "COMPILATION_SUCCESS" }))
      .catch(error => dispatch({ type: "COMPILATION_ERROR" }));
  }, [dispatch, store.nodes, store.compileTime]);

  return null;
};

const Schema = props => {
  const [store, dispatch] = useStore();
  useEffect(() => {
    if (!store.simulationSchema)
      Axios.get(Config.apiBaseUrl + "/script/schema")
        .then(result => {
          return dispatch({ type: "UPDATE_SCHEMA", payload: result.data });
        })
        .catch(error => {
          console.error("Failed to fetch the schema", error);
        });
  }, [dispatch, store.simulationSchema]);
  return null;
};

const ScriptEditor = props => {
  const dispatch = useStore()[1];
  return (
    <>
      <Websocket
        url={Config.simulationUrl}
        onMessage={data => dispatch({ type: "LOG_SIMULATION", payload: data })}
      />
      <Compiler></Compiler>
      <div className="script-editor">
        <SideBar></SideBar>
        <NodeEditor></NodeEditor>
        <JSONPanel></JSONPanel>
      </div>
    </>
  );
};

const ScriptEditorWithStore = props => {
  return (
    <Store initialState={initialState} reducer={reducer}>
      <Schema />
      <ScriptEditor />
    </Store>
  );
};

export default ScriptEditorWithStore;
