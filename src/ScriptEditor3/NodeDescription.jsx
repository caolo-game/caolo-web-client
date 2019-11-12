
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