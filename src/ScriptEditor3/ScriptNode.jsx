import React, { useState } from "react";

function ScriptNode({ id, schema, descriptor, registerDraggingContext }) {
    console.log('ScriptNode', id, descriptor);
    if (descriptor.value != null) {
        // value node
    }

    return (
        <div className="command" id={id} data-output={descriptor.output} style={{display: 'flex', backgroundColor: descriptor.color}}>
            {"[" + id + "] " + descriptor.prompt + (descriptor.value && schema ? ": " + JSON.stringify(schema.values[id], null, 2) : "")}
            {descriptor.inputs.map((input, i) => {
                return <div id={id + '#' + i} className="command-input" style={{border: '1px solid black'}} data-input={input} ref={registerDraggingContext}>{input}</div>
            })}
        </div>
    );
}

export default ScriptNode;
