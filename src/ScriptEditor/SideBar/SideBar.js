import React from "react";
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
import ErrorIcon from "@material-ui/icons/Error";
import Description from "@material-ui/icons/Description";
import CircularProgress from "@material-ui/core/CircularProgress";

import { useStore } from "../../Utility/Store";

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

const SideBar = props => {
    const classes = useStyles();
    const [store, dispatch] = useStore();

    return (
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
                    { text: "Add number", icon: <ExposureZeroIcon />, functionName: "integer" },
                    { text: "Add function", icon: <NoteAdd />, functionName: "log_scalar" }
                ].map(({ text, icon, functionName }) => (
                    <ListItem button key={text} onClick={() => dispatch({ type: "ADD_NODE", payload: functionName })}>
                        <ListItemIcon>{icon}</ListItemIcon>
                        <ListItemText primary={text} />
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                <ListItem button onClick={() => window.open("https://snorrwe.github.io/cao_lang/cao_lang/", "_blank")}>
                    <ListItemIcon>
                        <Description />
                    </ListItemIcon>
                    <ListItemText>Documentation</ListItemText>
                </ListItem>
            </List>
            <Divider />
            <List>
                {store.isCompilationSuccessful && (
                    <ListItem style={{ background: "lightgreen" }}>
                        <ListItemIcon>
                            {!store.isCompilationInProgress && <DoneIcon />}
                            {store.isCompilationInProgress && <CircularProgress size={24} />}
                        </ListItemIcon>
                        <ListItemText primary="Compiles" />
                    </ListItem>
                )}
                {!store.isCompilationSuccessful && (
                    <ListItem style={{ background: "red" }}>
                        <ListItemIcon>
                            {!store.isCompilationInProgress && <ErrorIcon />}
                            {store.isCompilationInProgress && <CircularProgress size={24} />}
                        </ListItemIcon>
                        <ListItemText primary="Compile Error" />
                    </ListItem>
                )}
            </List>
        </Drawer>
    );
};

export default SideBar;
