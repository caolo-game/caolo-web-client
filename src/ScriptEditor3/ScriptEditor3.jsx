import React from "react";
import "./ScriptEditor3.css";
import Dragula from 'react-dragula';
import { NodeDescription } from './NodeDescription';
import { Schema } from './Schema';
import ScriptNode from './ScriptNode';
import SelectableCommand from './SelectableCommand';

import { Grid } from '@material-ui/core';


export const SCRIPT_TILES = {
    say_hi: new NodeDescription(
        ({ schema, id, type }) => {
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

export function createNode(ty, schema, registerDraggingContext) {
    const id = schema.getNextId();
    schema.positions[id] = {
        x: Math.random() * 225 + 20,
        y: Math.random() * 225 + 20
    };
    SCRIPT_TILES[ty].init({ schema, id });
    schema.renderComponents[id] = <ScriptNode key={id} id={id} schema={schema} descriptor={SCRIPT_TILES[ty]} className="command" registerDraggingContext={registerDraggingContext}></ScriptNode>;
    return id;
}

function createCommandList() {
    const commands = [];
    for (const ty of Object.keys(SCRIPT_TILES)) {

        console.log('SCRIPT_TILES', ty, SCRIPT_TILES, SCRIPT_TILES[ty]);
        commands.push(<SelectableCommand key={ty} descriptor={SCRIPT_TILES[ty]} className="command"></SelectableCommand>);
    }
    return commands;
}

export function addConnection(schema, from, to) {
    if (!schema.connections[to]) schema.connections[to] = [];
    if (!schema.inputs[to]) schema.inputs[to] = [];
    schema.connections[to].push(from);
    schema.inputs[to].push(from);
}


export default class ScriptEditor3 extends React.Component {
    state = {
        schema: null
    };

    constructor(props) {
        super(props);
        this.state.schema = props.schema || new Schema();
        const a = createNode("integer", this.state.schema, this.addToDraggingContextDecorator);
        const b = createNode("integer", this.state.schema, this.addToDraggingContextDecorator);
        const add = createNode("add", this.state.schema, this.addToDraggingContextDecorator);
        const log = createNode("log_scalar", this.state.schema, this.addToDraggingContextDecorator);
        addConnection(this.state.schema, a, add);
        addConnection(this.state.schema, b, add);
        addConnection(this.state.schema, add, log);

        this.draggingContext = Dragula({
            revertOnSpill: true,
            copy: function (el, source) {
                return source.id === 'command-list';
            },
            accepts: function (el, target, source, sibling) {
                // console.log('accepts', el.id, target.id);
                console.log(target.dataset.input, el.dataset.output);
                if (target.id === 'command-list') {
                    return false;
                };
                if (target.id === 'script-root') {
                    return true;
                }
                if (target.dataset.input !== el.dataset.output) {
                    return false;
                }
                return true;
            },
            invalid: function (el, handle) {
                console.log('invalid', el.className);
                return el.className !== 'command';
            }
        });
    }

    addToDraggingContextDecorator = instance => {
        if (instance) {
            this.draggingContext.containers.push(instance);
        }
    };

    render() {
        let schema = this.state.schema;
        const width = 512;
        console.log(schema, JSON.stringify(schema.asCaoLangSchema(), null, 4));
        return (
            <Grid container>
                <Grid item md={3} id="command-list" className="draggable-container command-list" style={{padding: '20px'}} ref={this.addToDraggingContextDecorator}>
                    {createCommandList()}
                </Grid>
                <Grid item md={9} id="script-root" className="draggable-container" style={{padding: '20px'}} ref={this.addToDraggingContextDecorator}>
                    {Object.values(schema.renderComponents)}
                </Grid>
            </Grid>
        );
    }
}
