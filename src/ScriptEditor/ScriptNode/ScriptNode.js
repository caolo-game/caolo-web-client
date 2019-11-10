import React, { useState } from "react";
import "./ScriptNode.css";
import { ArcherElement } from "react-archer";
import Draggable from "react-draggable";

function useForceUpdate() {
    const [value, setValue] = useState(true); //boolean state
    return () => setValue(!value); // toggle the state to force render
}

function Node({ id, schema, descriptor }) {
    const forceUpdate = useForceUpdate();

    if (descriptor.value != null) {
        // value node
    }
    let pos = schema.positions[id];
    return (
        <div>
            <Draggable onStop={forceUpdate}>
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
            </Draggable>
        </div>
    );
}

export default Node;
