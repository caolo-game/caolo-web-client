
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
    types = {};
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
        delete this.types[id];
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