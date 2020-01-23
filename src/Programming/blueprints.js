import React from "react";

/**
 * Map raw cao-lang schema node to one the app can understand
 */
export function makeBlueprint(node) {
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
      name = node.name.replace("Instruction::", "");
      return {
        ...node,
        name,
        produceRemote: function() {
          const node = {};
          node[this.name] = null;
          return { node };
        }
      };

    case "Instruction::ScalarInt":
      return valueNode(node, "number", 1);
    case "Instruction::ScalarFloat":
      return valueNode(node, "number", 0.00001);
    case "Instruction::StringLiteral":
      return valueNode(node, "text", null);
    case "console_log":
    case "log_scalar":
    case "bots::move_bot":
    case "make_point":
    case "spawn":
    case "find_closest_resource_by_range":
    case "make_operation_result":
      return {
        ...node,
        produceRemote: function() {
          return {
            node: { Call: { function: this.name } },
            child: null
          };
        }
      };
    default:
      console.error(`Node w/ name ${node.name} is not implemented`, node);
      return null;
  }
}

function valueNode(node, ty, step) {
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
      return { node };
    },
    extraRender: function() {
      return (
        <input
          type={ty}
          step={step}
          onChange={e => {
            e.preventDefault();
            this.value = e.target.value;
          }}
        ></input>
      );
    }
  };
}
