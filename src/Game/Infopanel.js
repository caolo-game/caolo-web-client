import React from "react";
import Drawer from "@material-ui/core/Drawer";
import Toolbar from "@material-ui/core/Toolbar";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerContainer: {
        overflow: "auto",
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    details: {
        flexDirection: "column",
    },
}));

export default function Infopanel({ selectedBot, selectedRoom }) {
    const classes = useStyles();
    if (selectedBot) {
        console.log("----");
        console.log(Object.entries(selectedBot));
        console.log(Object.entries(selectedBot).map(([key, { id, position, owner }]) => [key, { id, ...position, owner }]));
    }
    return (
        <Drawer
            className={classes.drawer}
            variant="permanent"
            anchor="right"
            classes={{
                paper: classes.drawerPaper,
            }}
        >
            <Toolbar></Toolbar>
            <Accordion defaultExpanded={true}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                    <Typography className={classes.heading}>Room</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>{JSON.stringify(selectedRoom)}</Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion defaultExpanded={true}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                    <Typography className={classes.heading}>Selected</Typography>
                </AccordionSummary>
                <AccordionDetails className={classes.details}>
                    {selectedBot &&
                        Object.entries({ id: selectedBot.id, ...selectedBot.position }).map(([key, value]) => (
                            <Typography>{key + " " + JSON.stringify(value)}</Typography>
                        ))}
                </AccordionDetails>
            </Accordion>
        </Drawer>
    );
}
