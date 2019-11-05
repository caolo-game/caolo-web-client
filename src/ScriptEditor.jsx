import React from "react";
import { Stage, Layer, Text, Rect, Group, Arrow } from "react-konva";
import { tsConstructorType } from "@babel/types";

/*
output schema: 
{
    nodes: {[id]: {instruction: string}},
    inputs:{[id]: id[]},
    values: {[id]: Value},
    strings:{[id]: string},
}
*/
export class Schema {
  nodes = {};
  inputs = {};
  values = {};
  strings = {};
  renderComponents = {};
  connections = {}; // directed lines {[to]: from[]}
  positions = {};
  _nextId = [0];

  getNextId() {
    const res = this._nextId.pop();
    if (this._nextId.length === 0) {
      this._nextId.push(res + 1);
    }
    return res;
  }

  deleteId(id) {
    delete this.nodes[id];
    delete this.inputs[id];
    delete this.values[id];
    delete this.strings[id];
    delete this.renderComponents[id];
    delete this.connections[id];
    delete this.positions[id];
    this._nextId.push(id);
  }

  asCaoLangSchema() {
    return {
      nodes: this.nodes,
      inputs: this.inputs,
      values: this.values,
      strings: this.strings
    };
  }
}

function Node({ id, schema, descriptor }) {
  if (descriptor.value != null) {
    // value node
  }
  let pos = schema.positions[id];
  return (
    <Group
      draggable
      key={"node_" + id}
      x={pos.x}
      y={pos.y}
      onDragMove={function(e) {
        schema.positions[id] = {
          x: e.evt.x,
          y: e.evt.y
        };
      }}
    >
      <Rect
        fill={descriptor.color}
        opacity={0.5}
        width={120}
        height={50}
      ></Rect>
      <Text
        fill="white"
        text={
          "[" +
          id +
          "] " +
          descriptor.prompt +
          (descriptor.value ? ": " + JSON.stringify(schema.values[id], null, 2) : "")
        }
      ></Text>
    </Group>
  );
}

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

export const SCRIPT_TILES = {
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
};

export function createNode(ty, schema) {
  const id = schema.getNextId();
  schema.positions[id] = {
    x: Math.random() * 225 + 20,
    y: Math.random() * 225 + 20
  };
  SCRIPT_TILES[ty].init({ schema, id });
  schema.renderComponents[id] = (
    <Node id={id} schema={schema} descriptor={SCRIPT_TILES[ty]}></Node>
  );
  return id;
}

export function addConnection(schema, from, to) {
  if (!schema.connections[to]) schema.connections[to] = [];
  if (!schema.inputs[to]) schema.inputs[to] = [];
  schema.connections[to].push(from);
  schema.inputs[to].push(from);
}

export default class ScriptEditor extends React.Component {
  state = {
    schema: null
  };

  constructor(props) {
    super(props);
    this.state.schema = props.schema || new Schema();
    const a = createNode("integer", this.state.schema);
    const b = createNode("integer", this.state.schema);
    const add = createNode("add", this.state.schema);
    const log = createNode("log_scalar", this.state.schema);
    addConnection(this.state.schema, a, add);
    addConnection(this.state.schema, b, add);
    addConnection(this.state.schema, add, log);
  }

  render() {
    let schema = this.state.schema;
    const width = 512;
    console.log(schema, JSON.stringify(schema.asCaoLangSchema(), null, 4));
    return (
      <Stage
        width={width}
        height={width}
        onDragMove={() => {
          this.setState({}); // trigger render
        }}
      >
        <Layer>
          {Object.keys(schema.connections).map(id => {
            let p1 = schema.positions[id];
            return schema.connections[id].map(id => {
              let p = schema.positions[id];
              return (
                <Arrow
                  fill="white"
                  stroke="white"
                  points={[
                    p.x,
                    p.y,
                    (p.x + p1.x) / 2,
                    (p.y + p1.y) / 2,
                    p1.x,
                    p1.y
                  ]}
                ></Arrow>
              );
            });
          })}
        </Layer>
        <Layer>{Object.values(schema.renderComponents)}</Layer>
      </Stage>
    );
  }
}
