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
                    relations={Object.keys(schema.inputs)
                        .map(fromId => {
                            const targetIds = schema.inputs[fromId];
                            if (targetIds.includes(id)) return { targetId: fromId, targetAnchor: "top", sourceAnchor: "bottom" };
                        })
                        .filter(id => id != null)}
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
