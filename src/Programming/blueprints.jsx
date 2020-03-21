import React, { useState } from "react";
import { useStore } from "../Utility/Store";

/**
 * Map raw cao-lang schema node to one the app can understand
 */
export const makeBlueprint = node => {
  let name = null;
  switch (node.name) {
    // case "Instruction::JumpIfTrue":

    case "Instruction::Start":
      return null;
    case "Instruction::Pass":
    case "Instruction::Add":
    case "Instruction::Sub":
    case "Instruction::Mul":
    case "Instruction::Div":
    case "Instruction::Equals":
    case "Instruction::NotEquals":
    case "Instruction::Less":
    case "Instruction::LessOrEq":
    case "Instruction::Pop":
    case "Instruction::Exit":
      name = node.name.replace("Instruction::", "");
      return {
        ...node,
        name,
        produceRemote: function() {
          const node = {};
          node[this.name] = null;
          return node;
        }
      };
    case "Instruction::JumpIfTrue":
      name = node.name.replace("Instruction::", "");
      return {
        ...node,
        name,
        produceRemote: function() {
          const node = {};
          let nodeid = this.value;
          nodeid = Number(nodeid);
          node[this.name] = { nodeid };
          return node;
        },
        extraRender: function() {
          return <ValueNode node={this} ty="number" step="1"></ValueNode>;
        }
      };
    case "Instruction::ScalarInt":
      return valueNode(node, "number", 1);
    case "Instruction::ScalarFloat":
      return valueNode(node, "number", 0.00001);
    case "Instruction::StringLiteral":
      return valueNode(node, "text", null);
    case "Instruction::SetVar":
    case "Instruction::ReadVar":
      return variableNode(node);
    case "console_log":
    case "log_scalar":
    case "make_point":
    case "spawn":
    case "find_closest_resource_by_range":
    case "make_operation_result":
    case "unload":
    case "approach_entity":
    case "move_bot_to_position":
    case "mine_resource":
      return {
        ...node,
        produceRemote: function() {
          return {
            Call: { function: this.name },
            child: null
          };
        }
      };
    default:
      console.error(`Node w/ name ${node.name} is not implemented`, node);
      return null;
  }
};

const variableNode = node => {
  const name = node.name.replace("Instruction::", "");
  return {
    ...node,
    name,
    produceRemote: function() {
      let value = this.value;
      let node = {};
      node[this.name] = {
        name: value
      };
      return node;
    },
    extraRender: function() {
      return <VariableNode node={this} />;
    }
  };
};

const valueNode = (node, ty, step) => {
  const name = node.name.replace("Instruction::", "");
  return {
    ...node,
    name,
    produceRemote: function() {
      const node = {};
      let value = this.value;
      if (ty === "number") {
        value = Number(value);
      }
      node[this.name] = { value };
      return node;
    },
    extraRender: function() {
      return <ValueNode node={this} ty={ty} step={step}></ValueNode>;
    }
  };
};

const VariableNode = ({ node }) => {
  // eslint-disable-next-line no-unused-vars
  const [, dispatch] = useStore();
  const [bounce, setBounce] = useState(null);

  return (
    <input
      autoFocus
      required
      type="text"
      onChange={e => {
        e.preventDefault();
        node.value = e.target.value;
        if (!bounce) {
          const handle = setTimeout(() => {
            dispatch({ type: "NODE_CHANGED", node });
            setBounce(null);
          }, 300);
          setBounce(handle);
        }
      }}
    ></input>
  );
};

const ValueNode = ({ node, ty, step }) => {
  // eslint-disable-next-line no-unused-vars
  const [, dispatch] = useStore();
  const [bounce, setBounce] = useState(null);

  return (
    <input
      autoFocus
      required
      type={ty}
      step={step}
      onChange={e => {
        e.preventDefault();
        node.value = e.target.value;
        if (!bounce) {
          const handle = setTimeout(() => {
            dispatch({ type: "NODE_CHANGED", node });
            setBounce(null);
          }, 300);
          setBounce(handle);
        }
      }}
    ></input>
  );
};
