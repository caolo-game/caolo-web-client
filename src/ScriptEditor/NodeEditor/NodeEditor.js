import React from "react";
import Node from "../Node";
import { ArcherContainer } from "react-archer";

import { useStore } from "../../Utility/Store";

// remoteFactory is called to produce a node accepted by the API
export const scriptTileMetadata = name => {
  switch (name) {
    case "Instruction::Add":
    case "Instruction::Sub":
    case "Instruction::Mul":
    case "Instruction::Div":
    case "Instruction::Start":
    case "Instruction::Pass":
    case "Instruction::Equals":
    case "Instruction::Less":
    case "Instruction::LessOrEq":
    case "Instruction::NotEquals":
      const instr = {};
      instr[name.replace("Instruction::", "")] = null;
      return {
        remoteFactory: (payload, node) => {
          payload[node.id] = {
            node: instr,
            children: node.childNodes
          };
          return payload;
        }
      };
    case "Instruction::ScalarInt":
      return {
        remoteFactory: (payload, node) => {
          payload[node.id] = { ScalarInt: { value: Number(node.value) } };
          return payload;
        },
        extraFields: {
          value: node => (
            <input
              type="number"
              onChange={e => (node.value = e.target.value)}
            />
          )
        }
      };
    case "Instruction::ScalarFloat":
      return {
        remoteFactory: (payload, node) => {
          payload[node.id] = { ScalarFloat: { value: Number(node.value) } };
          return payload;
        },
        extraFields: {
          value: node => (
            <input
              type="number"
              onChange={e => (node.value = e.target.value)}
            />
          )
        }
      };
    case "Instruction::StringLiteral":
      return {
        remoteFactory: (payload, node) => {
          payload[node.id] = { StringLiteral: { value: Number(node.value) } };
          return payload;
        },
        extraFields: {
          value: node => (
            <input type="text" onChange={e => (node.value = e.target.value)} />
          )
        }
      };
    case "Instruction::JumpIfTrue":
      return {
        remoteFactory: (payload, node) => {
          payload[node.id] = { JumpIfTrue: { nodeid: Number(node.value) } };
          return payload;
        },
        extraFields: {
          // TODO: draw arrow to another node, take its id
          nodeid: node => (
            <input
              type="number"
              onChange={e => (node.value = e.target.value)}
            />
          )
        }
      };
    case "console_log":
    case "log_scalar":
    case "bots::move_bot":
    case "find_closest_resource_by_range":
    case "spawn":
    case "make_point":
    case "make_operation_result":
      return {
        remoteFactory: (payload, node) => {
          payload[node.id] = { Call: { function: name } };
          return payload;
        }
      };
    default:
      console.error("Node name", name, "is unknown");
      return null;
  }
};

const NodeEditor = props => {
  const [store] = useStore();

  return (
    <div className="node-container">
      <ArcherContainer
        strokeColor="blue"
        strokeWidth={6}
        arrowLength={4}
        arrowThickness={2}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            flexDirection: "column",
            alignItems: "flex-start",
            height: "100%"
          }}
        >
          {Object.values(store.nodes).map(node => {
            return <Node node={node}></Node>;
          })}
        </div>
      </ArcherContainer>
    </div>
  );
};

export default NodeEditor;
