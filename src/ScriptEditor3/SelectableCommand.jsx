import React, { useState } from "react";

function SelectableCommand({ descriptor }) {
    return (
        <div className="command" style={{backgroundColor: descriptor.color}} data-output={descriptor.output}>
            {descriptor.prompt}
            Inputs: {descriptor.inputs.join(',')}
            Output: {descriptor.output}
        </div>
    );
}

export default SelectableCommand;
