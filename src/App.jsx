import React, { lazy, Suspense } from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import "react-toastify/dist/ReactToastify.css";

import styled, { ThemeProvider } from "styled-components";
import Navbar from "./Navbar";
import { createMuiTheme, ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import brown from "@material-ui/core/colors/brown";
import yellow from "@material-ui/core/colors/yellow";
import * as PIXI from "pixi.js";

const Home = lazy(() => import("./Home"));
const ProgramEditor = lazy(() => import("./Programming/ProgramEditor"));
const RoomView = lazy(() => import("./Game/RoomView"));

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

const AppStyle = styled.div`
    display: grid;
    grid-template-rows: auto 1fr auto;
`;

export default function App() {
    return (
        <Auth0Provider domain="dev-azsgw88u.eu.auth0.com" clientId="SYFdq1QqXKbk46cS85HOk2ptVBHQZMji" redirectUri={window.location.toString()}>
            <MuiThemeProvider theme={muiTheme}>
                <ThemeProvider theme={theme}>
                    <AppStyle>
                        <Router>
                            <Navbar></Navbar>
                            <Switch>
                                <Suspense fallback={<div>Loading...</div>}>
                                    <Route exact path="/">
                                        <Home></Home>
                                    </Route>
                                    <Route path="/room">
                                        <RoomView></RoomView>
                                    </Route>
                                    <Route path="/programming">
                                        <ProgramEditor></ProgramEditor>
                                    </Route>
                                </Suspense>
                            </Switch>
                        </Router>
                    </AppStyle>
                </ThemeProvider>
            </MuiThemeProvider>
        </Auth0Provider>
    );
}
