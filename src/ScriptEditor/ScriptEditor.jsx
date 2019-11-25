import React, { useState, useEffect } from "react";
import { tsConstructorType } from "@babel/types";
import Node from "./Node";
import "./ScriptEditor.css";
import Websocket from "react-websocket";

import Axios from "axios";

import NodeEditor from "./NodeEditor";
import { SCRIPT_TILES2 } from "./NodeEditor";

import SideBar from "./SideBar";
import { Store, useStore } from "../Utility/Store";

const initialState = {
    nodes: [],
    isInWiringMode: false,
    wireFromId: null,
    isCompilationInProgress: false,
    isCompilationSuccessful: true,
    simulationLog: []
};

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
            if (!state.isInWiringMode || state.wireFromId == action.payload) return state;
            let newNodes = [...state.nodes];
            newNodes[state.wireFromId].inputs.push(action.payload);
            return {
                ...state,
                isInWiringMode: false,
                wireFromId: null,
                nodes: newNodes
            };
        }
        case "ADD_NODE": {
            let newNodes = [...state.nodes];
            newNodes.push({ ...SCRIPT_TILES2[action.payload], inputs: [] });
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
        default:
            return state;
    }
};

const JSONPanel = props => {
    const [store, dispatch] = useStore();
    return (
        <div style={{ background: "white", width: "20%", height: "100%", padding: "10px" }}>
            <div style={{ height: "50%" }}>
                {JSON.stringify({
                    nodes: { ...store.nodes.map(node => node.node) },
                    inputs: Object.fromEntries(
                        Object.entries(store.nodes)
                            .map(([key, node]) => {
                                return [key, node.inputs];
                            })
                            .filter(([id, list]) => list.length)
                    )
                })}
            </div>
            <div style={{ height: "50%", overflowX: "auto" }}>{store.simulationLog}</div>
        </div>
    );
};

const Compiler = props => {
    const [store, dispatch] = useStore();

    useEffect(() => {
        const schema = JSON.stringify({
            nodes: { ...store.nodes.map(node => node.node) },
            inputs: Object.fromEntries(
                Object.entries(store.nodes)
                    .map(([key, node]) => {
                        return [key, node.inputs];
                    })
                    .filter(([id, list]) => list.length)
            )
        });

        dispatch({ type: "COMPILATION_START" });
        Axios.post("http://caolo.herokuapp.com/script/commit", schema)
            .then(result => dispatch({ type: "COMPILATION_SUCCESS" }))
            .catch(error => dispatch({ type: "COMPILATION_ERROR" }));
    }, [store.nodes]);

    return null;
};

const ScriptEditor = props => {
    const [store, dispatch] = useStore();
    return (
        <>
            <Websocket url="wss://caolo.herokuapp.com/simulation" onMessage={data => dispatch({ type: "LOG_SIMULATION", payload: data })} />
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
            <ScriptEditor />
        </Store>
    );
};

export default ScriptEditorWithStore;
