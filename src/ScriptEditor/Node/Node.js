import React, { useState } from "react";
import "./Node.css";
import { ArcherElement } from "react-archer";
import Draggable from "react-draggable";

function Node({ id, schema, node }) {
    const triggerArrowUpdate = () => {
        //Archer element only updates if the resize event triggers or relations changes
        window.dispatchEvent(new Event("resize"));
    };

    return (
        <Draggable onDrag={triggerArrowUpdate} onStop={triggerArrowUpdate}>
            <div>
                <ArcherElement
                    style={{ left: id * 100 + "px" }}
                    id={id}
                    relations={
                        schema.inputs[id]
                            ? schema.inputs[id].map(id => {
                                  return { targetId: id, targetAnchor: "bottom", sourceAnchor: "top" };
                              })
                            : []
                    }
                    className="script-node"
                >
                    <div style={{ width: "100px", left: id * 100 + "px" }}>
                        {"[" + id + "] " + node.node + (node.value ? ": " + JSON.stringify(schema.values[id], null, 2) : "")}
                    </div>
                </ArcherElement>
            </div>
        </Draggable>
    );
}

export default Node;
