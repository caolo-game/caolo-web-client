import React, { useState } from "react";
import "./ScriptNode.css";
import { ArcherElement } from "react-archer";
import Draggable from "react-draggable";

function Node({ id, schema, descriptor }) {
    if (descriptor.value != null) {
        // value node
    }
    let pos = schema.positions[id];
    return (
        <Draggable onStop={() => window.dispatchEvent(new Event("resize"))}>
            <div>
                <ArcherElement
                    style={{ left: id * 100 + "px" }}
                    id={id}
                    relations={
                        schema.connections[id]
                            ? schema.connections[id].map(id => {
                                  return { targetId: id, targetAnchor: "bottom", sourceAnchor: "top" };
                              })
                            : []
                    }
                    className="script-node"
                >
                    <div style={{ width: "100px", left: id * 100 + "px" }}>
                        {"[" + id + "] " + descriptor.prompt + (descriptor.value ? ": " + JSON.stringify(schema.values[id], null, 2) : "")}
                    </div>
                </ArcherElement>
            </div>
        </Draggable>
    );
}

export default Node;
