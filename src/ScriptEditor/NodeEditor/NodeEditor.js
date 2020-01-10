import React, { useState, useEffect } from "react";
import Node from "../Node";
import { ArcherContainer, ArcherElement } from "react-archer";
import Draggable from "react-draggable";

import { useStore } from "../../Utility/Store";

export const SCRIPT_TILE_METADATA = Object.freeze({
  "Instruction::Add": {
    // Produce a node accepted by the API
    remoteFactory: node => ({ Add: null })
  },
  "Instruction::Sub": {
    remoteFactory: node => ({ Sub: null })
  },
  "Instruction::Mul": {
    remoteFactory: node => ({ Mul: null })
  },
  "Instruction::Div": {
    remoteFactory: node => ({ Div: null })
  },
  "Instruction::Start": {
    remoteFactory: node => ({ Start: null })
  },
  "Instruction::Pass": {
    remoteFactory: node => ({ Pass: null })
  },
  "Instruction::ScalarInt": {
    remoteFactory: node => ({ ScalarInt: { value: node.value } })
  },
  "Instruction::ScalarFloat": {
    remoteFactory: node => ({ ScalarFloat: { value: node.value } })
  },
  "Instruction::JumpIfTrue": {
    remoteFactory: node => ({ JumpIfTrue: { nodeid: node.value } })
  },
  console_log: {
    remoteFactory: node => ({ Call: { function: "console_log" } })
  },
  log_scalar: {
    remoteFactory: node => ({ Call: { function: "log_scalar" } })
  },
  "bots::move_bot": {
    remoteFactory: node => ({ Call: { function: "bots::move_bot" } })
  },
  make_point: {
    remoteFactory: node => ({ Call: { function: "make_point" } })
  },
  spawn: {
    remoteFactory: node => ({ Call: { function: "spawn" } })
  }
});

const NodeEditor = props => {
  const [store, dispatch] = useStore();

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
          {store.nodes.map((node, index) => {
            return <Node id={index} node={node}></Node>;
          })}
        </div>
      </ArcherContainer>
    </div>
  );
};

export default NodeEditor;
