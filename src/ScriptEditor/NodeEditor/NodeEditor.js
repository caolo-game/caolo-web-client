import React from "react";
import Node from "../Node";
import { ArcherContainer, ArcherElement } from "react-archer";

export class NodeDescription {
    init;
    inputs; // list of types
    output; // type or null
    value; // type or null
    color;
    ty; // type of this node

    constructor(init, inputs, output, value, color, prompt) {
        this.init = init;
        this.inputs = inputs || [];
        this.output = output || null;
        this.value = value || null;
        this.color = color || "white";
        this.prompt = prompt;
    }
}

export const SCRIPT_TILES2 = Object.freeze({
    say_hi: {
        node: "Call",
        string: "say_hi"
    },
    log_scalar: {
        node: "Call",
        string: "log_scalar",
        inputs: ["number"]
    },
    add_int: {
        node: "AddInt",
        inputs: ["number", "number"],
        output: "number"
    },
    integer: {
        node: "LiteralInt",
        output: "number",
        value: "number"
    }
});

export const SCRIPT_TILES = Object.freeze({
    say_hi: new NodeDescription(
        ({ schema, id }) => {
            schema.nodes[id] = {
                instruction: "Call"
            };
            schema.strings[id] = "say_hi";
        },
        null,
        null,
        null,
        "white",
        "Say Hi"
    ),
    log_scalar: new NodeDescription(
        ({ schema, id }) => {
            schema.nodes[id] = {
                instruction: "Call"
            };
            schema.strings[id] = "log_scalar";
        },
        ["number"],
        null,
        null,
        "white",
        "Log scalar"
    ),
    add: new NodeDescription(
        ({ schema, id }) => {
            schema.nodes[id] = {
                instruction: "AddInt"
            };
        },
        ["number", "number"],
        "number",
        null,
        "red",
        "Add two numbers"
    ),
    integer: new NodeDescription(
        ({ schema, id }) => {
            schema.nodes[id] = {
                instruction: "LiteralInt"
            };
            schema.values[id] = {
                IValue: id + 4
            };
        },
        null,
        "number",
        "number",
        "green",
        "Insert a number"
    )
});

export class Schema {
    nodes = {};
    inputs = {};
    values = {};
    strings = {};

    currentId = -1;

    addNode = node => {
        ++this.currentId;
        this.nodes[this.currentId] = node;
        return this.currentId.toString();
    };
}

export function addConnection(schema, from, to) {
    if (!schema.inputs[to]) schema.inputs[to] = [];
    schema.inputs[to].push(from);
}

class NodeEditor extends React.Component {
    state = {
        schema: null
    };

    constructor(props) {
        super(props);
        this.state.schema = props.schema || new Schema();
        const a = this.state.schema.addNode(SCRIPT_TILES2["integer"]);
        const b = this.state.schema.addNode(SCRIPT_TILES2["integer"]);
        const add = this.state.schema.addNode(SCRIPT_TILES2["add_int"]);
        const log = this.state.schema.addNode(SCRIPT_TILES2["log_scalar"]);
        addConnection(this.state.schema, a, add);
        addConnection(this.state.schema, b, add);
        addConnection(this.state.schema, add, log);
    }

    render() {
        let schema = this.state.schema;
        const width = 512;
        console.log(schema, JSON.stringify(schema, null, 4));
        return (
            <div className="node-container">
                <ArcherContainer>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            height: "500px"
                        }}
                    >
                        {Object.keys(schema.nodes).map(key => {
                            const node = schema.nodes[key];
                            console.log("rendering node:", node, key);
                            return <Node id={key} schema={schema} node={node}></Node>;
                        })}
                    </div>
                </ArcherContainer>
            </div>
        );
    }
}

export default NodeEditor;
