import React, { useEffect } from "react";
import { tsConstructorType } from "@babel/types";
import Node from "./ScriptNode";
import "./ScriptEditor.css";
import { ArcherContainer, ArcherElement } from "react-archer";

import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";
import ExposureZeroIcon from "@material-ui/icons/ExposureZero";
import NoteAdd from "@material-ui/icons/NoteAdd";
import DoneIcon from "@material-ui/icons/Done";
import Axios from "axios";

const drawerWidth = 200;

const useStyles = makeStyles(theme => ({
    root: {
        display: "flex"
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0
    },
    drawerPaper: {
        width: drawerWidth
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3)
    },
    toolbar: theme.mixins.toolbar
}));

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
    schema.renderComponents[id] = <Node id={id} schema={schema} descriptor={SCRIPT_TILES[ty]}></Node>;
    return id;
}

export function addConnection(schema, from, to) {
    if (!schema.connections[to]) schema.connections[to] = [];
    if (!schema.inputs[to]) schema.inputs[to] = [];
    schema.connections[to].push(from);
    schema.inputs[to].push(from);
}

const muzzleWidth = 40;
const halfMuzzle = 20;
const height = 100;
const yBasis = 70;

const cannonPipeStyle = {
    stroke: "#666",
    strokeWidth: "2px"
};

export const pathFromBezierCurve = params => {
    const { from, to } = params;
    return `
    M${from.x} ${from.y}
    ${to.x} ${to.y}
  `;
};
const viewBox = [window.innerWidth / -2, 100 - window.innerHeight, window.innerWidth, window.innerHeight];
const rootStyle = { display: "flex", justifyContent: "center" };
const rowStyle = { margin: "200px 0", display: "flex", justifyContent: "space-between" };
const boxStyle = { padding: "10px", border: "1px solid black" };

const ScriptEditor = props => {
    const classes = useStyles();

    useEffect(() => {
        Axios.post("http://caolo.herokuapp.com/compile", new Schema())
            .then(result => {
                console.log("compilation result", result);
            })
            .catch(error => {});
    }, []);

    return (
        <div className="script-editor">
            <Drawer
                className={classes.drawer}
                variant="permanent"
                classes={{
                    paper: classes.drawerPaper
                }}
            >
                <div className={classes.toolbar} />
                <List>
                    {[{ text: "Add number", icon: <ExposureZeroIcon /> }, { text: "Add function", icon: <NoteAdd /> }].map(({ text, icon }) => (
                        <ListItem button key={text}>
                            <ListItemIcon>{icon}</ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItem>
                    ))}
                </List>
                <Divider />
                <List>
                    <ListItem style={{ background: "lightgreen" }}>
                        <ListItemIcon>
                            <DoneIcon />
                        </ListItemIcon>
                        <ListItemText primary="Compiles" />
                    </ListItem>
                </List>
            </Drawer>
            <NodeEditor></NodeEditor>
        </div>
    );
};

class NodeEditor extends React.Component {
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
            <div className="node-container">
                <ArcherContainer>
                    {Object.keys(schema.connections).map(id => {
                        let p1 = schema.positions[id];
                        return schema.connections[id].map(id => {
                            let p = schema.positions[id];
                        });
                    })}

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            height: "500px"
                        }}
                    >
                        {Object.values(schema.renderComponents)}
                    </div>
                </ArcherContainer>
            </div>
        );
    }
}

export default ScriptEditor;
