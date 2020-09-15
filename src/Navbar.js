import React, { useState } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";

import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import HomeIcon from "@material-ui/icons/Home";
import RoomIcon from "@material-ui/icons/Room";
import ProgrammingIcon from "@material-ui/icons/Ballot";
import { ReactComponent as GithubIcon } from "./github.svg";
import { useHistory } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        zIndex: 1201,
        height: 0,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));

export default function Navbar() {
    const history = useHistory();
    const classes = useStyles();
    const [isDrawerVisible, setDrawerVisibility] = useState(false);
    const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();

    return (
        <>
            <Drawer open={isDrawerVisible} onClose={() => setDrawerVisibility(false)}>
                <div role="presentation">
                    <List>
                        <ListItem
                            button
                            onClick={() => {
                                history.push("/");
                                setDrawerVisibility(false);
                            }}
                        >
                            <ListItemIcon>
                                <HomeIcon />
                            </ListItemIcon>
                            <ListItemText primary="Home" />
                        </ListItem>
                        <ListItem
                            button
                            onClick={() => {
                                history.push("/room");
                                setDrawerVisibility(false);
                            }}
                        >
                            <ListItemIcon>
                                <RoomIcon />
                            </ListItemIcon>
                            <ListItemText primary="Room" />
                        </ListItem>
                        <ListItem
                            button
                            onClick={() => {
                                history.push("/programming");
                                setDrawerVisibility(false);
                            }}
                        >
                            <ListItemIcon>
                                <ProgrammingIcon />
                            </ListItemIcon>
                            <ListItemText primary="Programming" />
                        </ListItem>
                    </List>
                    <Divider />
                    <List>
                        <ListItem button onClick={() => window.open("https://github.com/caolo-game")}>
                            <ListItemIcon>
                                <GithubIcon />
                            </ListItemIcon>
                            <ListItemText primary="Github" />
                        </ListItem>
                    </List>
                </div>
            </Drawer>
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton onClick={() => setDrawerVisibility(true)} edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            Caolo
                        </Typography>
                        {isAuthenticated ? (
                            <>
                                <Typography>{user ? user.nickname : "Unknown"}</Typography>
                                <Button color="inherit" onClick={() => logout()}>
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <Button color="inherit" onClick={() => loginWithRedirect()}>
                                Login
                            </Button>
                        )}
                    </Toolbar>
                </AppBar>
            </div>
        </>
    );
}
