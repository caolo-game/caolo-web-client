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
                    <Typography>
                        <pre>{JSON.stringify(selectedRoom)}</pre>
                    </Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion defaultExpanded={true}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                    <Typography className={classes.heading}>Selected</Typography>
                </AccordionSummary>
                <AccordionDetails className={classes.details}>
                    <Typography>
                        <pre>{JSON.stringify(selectedBot, null, 2)}</pre>
                    </Typography>
                </AccordionDetails>
            </Accordion>
        </Drawer>
    );
}