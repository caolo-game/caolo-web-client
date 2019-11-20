import React, { useState, useEffect } from "react";
import "./Node.css";
import { ArcherElement } from "react-archer";
import Draggable from "react-draggable";
import classnames from "classnames";

import { useStore } from "../../Utility/Store";

function Node({ id, node }) {
    const [store, dispatch] = useStore();

    const triggerArrowUpdate = () => {
        //Archer element only updates if the resize event triggers or relations changes
        window.dispatchEvent(new Event("resize"));
    };

    return (
        <Draggable bounds=".node-container" onDrag={triggerArrowUpdate} onStop={triggerArrowUpdate}>
            <div>
                <ArcherElement
                    id={id}
                    relations={
                        node.inputs &&
                        node.inputs.map(fromId => {
                            return { targetId: fromId, targetAnchor: "right", sourceAnchor: "right" };
                        })
                    }
                    className={classnames("script-node", {
                        selectable: store.isInWiringMode && store.wireFromId != id,
                        "select-start": store.isWiringMode && store.wireFromId == id
                    })}
                >
                    <div onClick={() => dispatch({ type: "END_WIRE", payload: id })} style={{ width: "100px", left: id * 100 + "px" }}>
                        {"[" + id + "] " + node.node.instruction}
                    </div>
                    <div
                        onClick={() => dispatch({ type: "START_WIRE", payload: id })}
                        style={{ background: "red", borderRadius: "10px", padding: "0px 5px", left: "50%" }}
                    >
                        +
                    </div>
                </ArcherElement>
            </div>
        </Draggable>
    );
}

export default Node;
