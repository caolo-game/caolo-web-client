import React, { useState, useEffect } from "react";
import Node from "../Node";
import { ArcherContainer, ArcherElement } from "react-archer";
import Draggable from "react-draggable";

import { useStore } from "../../Utility/Store";

export const SCRIPT_TILES2 = Object.freeze({
    say_hi: {
        node: { instruction: "Call", string: "say_hi" }
    },
    log_scalar: {
        node: { instruction: "Call", string: "log_scalar" },
        inputPorts: ["number"]
    },
    add_int: {
        node: { instruction: "AddInt" },
        inputPorts: ["number", "number"],
        output: "number"
    },
    integer: {
        node: { instruction: "ScalarInt", scalar: { Integer: 0 } },
        output: "number"
    }
});

const NodeEditor = props => {
    const [store, dispatch] = useStore();

    return (
        <div className="node-container">
            <ArcherContainer strokeColor="blue" strokeWidth={6} arrowLength={4} arrowThickness={2}>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-start",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        height: "100%"
                    }}
                >
                    {store.nodes.map((node, index) => {
                        return <Node id={index} node={node}></Node>;
                    })}
                </div>
            </ArcherContainer>
        </div>
    );
};

export default NodeEditor;
