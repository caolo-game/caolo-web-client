import React, { useState, useEffect } from "react";
import Node from "../Node";
import { ArcherContainer, ArcherElement } from "react-archer";

import { useStore } from "../../Utility/Store";

export const SCRIPT_TILES2 = Object.freeze({
    say_hi: {
        node: { instruction: "Call", string: "say_hi" }
    },
    log_scalar: {
        node: { instruction: "Call", string: "log_scalar" },
        inputs: ["number"]
    },
    add_int: {
        node: { instruction: "AddInt" },
        inputs: ["number", "number"],
        output: "number"
    },
    integer: {
        node: { instruction: "ScalarInt", scalar: { Integer: 0 } },
        output: "number"
    }
});

const NodeEditor = props => {
    const [store, dispatch] = useStore();

    //   useEffect(() => {
    //        const newNodes = [];
    //        newNodes.push(SCRIPT_TILES2["integer"]);
    //        newNodes.push(SCRIPT_TILES2["integer"]);
    //        newNodes.push(SCRIPT_TILES2["add_int"]);
    //        newNodes.push(SCRIPT_TILES2["log_scalar"]);
    //        newNodes[2].inputs = [0, 1];
    //        newNodes[3].inputs = [2];
    //        setNodes(newNodes);
    //    }, []);

    return (
        <div className="node-container">
            <ArcherContainer>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
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
