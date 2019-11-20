import React, { useState, useEffect } from "react";
import { tsConstructorType } from "@babel/types";
import Node from "./Node";
import "./ScriptEditor.css";

import Axios from "axios";

import NodeEditor from "./NodeEditor";
import { SCRIPT_TILES2 } from "./NodeEditor";

import SideBar from "./SideBar";
import { Store, useStore } from "../Utility/Store";

const initialState = { nodes: [], isInWiringMode: false, wireFromId: null, isCompilationInProgress: false, isCompilationSuccessful: true };

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
        default:
            return state;
    }
};

const JSONPanel = props => {
    const [store, dispatch] = useStore();
    return (
        <div style={{ background: "white", width: "20%", height: "100%" }}>
            {JSON.stringify({ nodes: { ...store.nodes.map(node => node.node) }, inputs: {} })}
        </div>
    );
};

const Compiler = props => {
    const [store, dispatch] = useStore();

    useEffect(() => {
        const schema = JSON.stringify({ nodes: { ...store.nodes.map(node => node.node) }, inputs: {} });
        dispatch({ type: "COMPILATION_START" });
        Axios.post("http://caolo.herokuapp.com/compile", schema)
            .then(result => dispatch({ type: "COMPILATION_SUCCESS" }))
            .catch(error => dispatch({ type: "COMPILATION_ERROR" }));
    }, [store.nodes]);

    return null;
};

const ScriptEditor = props => {
    return (
        <Store initialState={initialState} reducer={reducer}>
            <Compiler></Compiler>
            <div className="script-editor">
                <SideBar></SideBar>
                <NodeEditor></NodeEditor>
                <JSONPanel></JSONPanel>
            </div>
        </Store>
    );
};

export default ScriptEditor;
