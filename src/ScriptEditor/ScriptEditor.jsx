import React, { useEffect } from "react";
import { tsConstructorType } from "@babel/types";
import Node from "./Node";
import "./ScriptEditor.css";

import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Link from "@material-ui/core/Link";
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
import Description from "@material-ui/icons/Description";
import Axios from "axios";

import NodeEditor from "./NodeEditor";

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

const ScriptEditor = props => {
    const classes = useStyles();

    useEffect(() => {
        // Axios.post("http://caolo.herokuapp.com/compile", new Schema())
        //     .then(result => {
        //         console.log("compilation result", result);
        //     })
        //     .catch(error => {});
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
                    {[
                        { text: "Add number", icon: <ExposureZeroIcon /> },
                        { text: "Add function", icon: <NoteAdd /> }
                    ].map(({ text, icon }) => (
                        <ListItem button key={text}>
                            <ListItemIcon>{icon}</ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItem>
                    ))}
                </List>
                <Divider />
                <List>
                    <ListItem
                        button
                        onClick={() =>
                            window.open(
                                "https://snorrwe.github.io/cao_lang/cao_lang/",
                                "_blank" // <- This is what makes it open in a new window.
                            )
                        }
                    >
                        <ListItemIcon>
                            <Description />
                        </ListItemIcon>
                        <ListItemText>Documentation</ListItemText>
                    </ListItem>
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

export default ScriptEditor;
