import React, { useEffect } from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import Axios from "axios";
import "react-toastify/dist/ReactToastify.css";

import { apiBaseUrl, auth0Audience } from "./Config";
import styled, { ThemeProvider } from "styled-components";
import ProgramEditor from "./Programming/ProgramEditor";
import RoomView from "./Game/RoomView";
import Navbar from "./Navbar";
import { createMuiTheme, ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import brown from "@material-ui/core/colors/brown";
import yellow from "@material-ui/core/colors/yellow";

import * as PIXI from "pixi.js";
PIXI.useDeprecated();

window.__PIXI_INSPECTOR_GLOBAL_HOOK__ && window.__PIXI_INSPECTOR_GLOBAL_HOOK__.register({ PIXI: PIXI });

const theme = {
    primary: "#4ecca3",
    secondary: "#4e78cc",
    error: "#ce4e63",
};

const muiTheme = createMuiTheme({
    palette: {
        type: "dark",
        primary: {
            main: brown[700],
        },
        secondary: {
            main: yellow[600],
        },
    },
});

const UserHeader = styled.div`
    text-align: right;
`;

const AppStyle = styled.div`
    display: grid;
    grid-template-rows: auto 1fr auto;
`;

const LoginBtn = styled.button``;
const LogoutBtn = styled.button``;

export default function App() {
    return (
        <Auth0Provider domain="dev-azsgw88u.eu.auth0.com" clientId="SYFdq1QqXKbk46cS85HOk2ptVBHQZMji" redirectUri={window.location.toString()}>
            <MuiThemeProvider theme={muiTheme}>
                <ThemeProvider theme={theme}>
                    <AppStyle>
                        <Router>
                            <Navbar></Navbar>
                            <User></User>
                            <Switch>
                                <Route path="/room">
                                    <RoomView></RoomView>
                                </Route>
                                <Route path="/programming">
                                    <ProgramEditor></ProgramEditor>
                                </Route>
                            </Switch>
                        </Router>
                    </AppStyle>
                </ThemeProvider>
            </MuiThemeProvider>
        </Auth0Provider>
    );
}

function User() {
    const { user, getAccessTokenSilently, isAuthenticated, loginWithRedirect, logout } = useAuth0();

    useEffect(() => {
        if (isAuthenticated)
            (async () => {
                const token = await getAccessTokenSilently({
                    audience: auth0Audience,
                });
                const response = await Axios.get(apiBaseUrl + "/myself", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }).catch((e) => {
                    console.warn("failed to get the user's info", e);
                    throw e;
                });
                console.log("my user information", (response && response.data) || response);
            })();
    }, [getAccessTokenSilently, isAuthenticated]);
    return (
        <UserHeader>
            {!isAuthenticated ? (
                <LoginBtn onClick={() => loginWithRedirect()}>Log In</LoginBtn>
            ) : (
                <>
                    <div>Logged in as {user.nickname}</div>
                    <LogoutBtn onClick={() => logout()}>Log out</LogoutBtn>
                </>
            )}
        </UserHeader>
    );
}
