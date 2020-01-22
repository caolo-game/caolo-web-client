import React from "react";

/**
 * Map raw cao-lang schema node to one the app can understand
 */
export const blueprint = node => {
  let name = null;
  switch (node.name) {
    case "Instruction::Start":
    case "Instruction::Pass":
    case "Instruction::Add":
    case "Instruction::Sub":
    case "Instruction::Mul":
    case "Instruction::Div":
    case "Instruction::JumpIfTrue":
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
    case "Instruction::ScalarFloat":
    case "Instruction::StringLiteral":
      name = node.name.replace("Instruction::", "");
      const ty = name.includes("Scalar") ? "number" : "text";
      return {
        ...node,
        name,
        produceRemote: function() {
          console.log("value node", this);
          return null;
        },
        extraRender: function() {
          return (
            <input
              type={ty}
              onChange={e => {
                e.preventDefault();
                this.value = e.target.value;
              }}
            ></input>
          );
        }
      };

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
};
