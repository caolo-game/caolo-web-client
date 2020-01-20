import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import DoneIcon from "@material-ui/icons/Done";
import ErrorIcon from "@material-ui/icons/Error";
import Description from "@material-ui/icons/Description";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";

import { useStore } from "../../Utility/Store";

const drawerWidth = 250;
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
        {Object.values(store.simulationSchema || {}).map(({ name }) => (
          <ListItem
            button
            key={name}
            onClick={() => dispatch({ type: "ADD_NODE", payload: name })}
          >
            <ListItemIcon>{"TODO"}</ListItemIcon>
            <ListItemText primary={name} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem
          button
          onClick={() =>
            window.open(
              "https://snorrwe.github.io/caolo-backend/cao_lang/",
              "_blank"
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
        <Button onClick={() => (store.compileTime = Date.now())}>
          {(store.isCompilationSuccessful && (
            <ListItem style={{ background: "lightgreen" }}>
              {(!store.isCompilationInProgress && (
                <ListItemIcon>
                  <DoneIcon />
                </ListItemIcon>
              )) || (
                <ListItemIcon>
                  <CircularProgress size={24} />
                </ListItemIcon>
              )}
              <ListItemText primary="Compiles" />
            </ListItem>
          )) || (
            <ListItem style={{ background: "red" }}>
              <ListItemIcon>
                {!store.isCompilationInProgress && <ErrorIcon />}
                {store.isCompilationInProgress && (
                  <CircularProgress size={24} />
                )}
              </ListItemIcon>
              <ListItemText primary="Compile Error" />
            </ListItem>
          )}
        </Button>
      </List>
    </Drawer>
  );
};

export default SideBar;
