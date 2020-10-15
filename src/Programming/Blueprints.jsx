import React, { useState } from "react";
import { useStore } from "../Utility/Store";

/**
 * Map raw cao-lang schema node to one the app can understand
 */
export const makeBlueprint = (node) => {
    if (node.ty === "Function") {
        return {
            ...node,
            produceRemote: function () {
                return {
                    node: {
                        Call: this.name,
                    },
                };
            },
        };
    }
    switch (node.name) {
        case "Start":
            return null;
        case "Pass":
        case "Add":
        case "Sub":
        case "Mul":
        case "Div":
        case "Equals":
        case "NotEquals":
        case "Less":
        case "LessOrEq":
        case "Pop":
        case "Exit": {
            const name = node.name;
            return {
                ...node,
                name,
                produceRemote: function () {
                    const node = { node: {} };
                    node.node[this.name] = null;
                    return node;
                },
            };
        }
        case "JumpIfTrue": {
            const name = node.name;
            return {
                ...node,
                name,
                produceRemote: function () {
                    const node = { node: {} };
                    let nodeid = this.value;
                    nodeid = Number(nodeid);
                    node.node[this.name] = nodeid;
                    return node;
                },
                extraRender: function () {
                    return <ValueNode node={this} ty="number" step="1"></ValueNode>;
                },
            };
        }
        case "ScalarInt":
            return valueNode(node, "number", 1);
        case "ScalarFloat":
            return valueNode(node, "number", 0.00001);
        case "StringLiteral":
            return valueNode(node, "text", null);
        case "SubProgram": {
            const name = node.name;
            return {
                ...node,
                name,
                produceRemote: function () {
                    let value = this.value;
                    let node = { node: {} };
                    node.node["SubProgram"] = value;
                    return node;
                },
                extraRender: function () {
                    return <ValueNode node={this} ty="text" />;
                },
            };
        }

        case "SetVar":
        case "ReadVar":
            return variableNode(node);
        default:
            console.error(`Node w/ name ${node.name} is not implemented`, node);
            return null;
    }
};

const variableNode = (node) => {
    const name = node.name;
    return {
        ...node,
        name,
        produceRemote: function () {
            let value = this.value;
            let node = { node: {} };
            node.node[this.name] = value;
            return node;
        },
        extraRender: function () {
            return <VariableNode node={this} />;
        },
        variableNode: true,
    };
};

const valueNode = (node, ty, step) => {
    const name = node.name;
    return {
        ...node,
        name,
        produceRemote: function () {
            const node = { node: {} };
            let value = this.value;
            if (ty === "number") {
                value = Number(value);
            }
            node.node[this.name] = value;
            return node;
        },
        extraRender: function () {
            return <ValueNode node={this} ty={ty} step={step}></ValueNode>;
        },
        valueNode: true,
    };
};

const VariableNode = ({ node }) => {
    const [, dispatch] = useStore();
    const [bounce, setBounce] = useState(null);
    const [val, setVal] = useState(null);

    return (
        <input
            autoFocus
            required
            type="text"
            value={val || node.value}
            onChange={(e) => {
                e.preventDefault();
                node.value = e.target.value;
                setVal(node.value);
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
    const [, dispatch] = useStore();
    const [bounce, setBounce] = useState(null);
    const [val, setVal] = useState(null);

    return (
        <input
            autoFocus
            required
            type={ty}
            step={step}
            value={val || node.value}
            onChange={(e) => {
                e.preventDefault();
                node.value = e.target.value;
                setVal(node.value);
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
