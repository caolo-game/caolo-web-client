import React, { useEffect } from "react";
import { HashRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import Axios from "axios";
import "react-toastify/dist/ReactToastify.css";

import { apiBaseUrl, auth0Audience } from "./Config";
import styled, { ThemeProvider } from "styled-components";
import ProgramEditor from "./Programming/ProgramEditor";
import GameBoard from "./GameBoard";
import Game from "./Game";

const theme = {
    primary: "#4ecca3",
    secondary: "#4e78cc",
    error: "#ce4e63",
};

const Header = styled.header`
    height: 3em;
    font-size: 2em;

    display: grid;
    grid-gap: 1rem;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
`;

const UserHeader = styled.div`
    text-align: right;
`;

const NavBar = styled.nav`
    grid-column-start: 1;
    grid-gap: 1rem;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
`;

const StyledLink = styled(Link)`
    color: ${(props) => props.theme.secondary};
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
            <ThemeProvider theme={theme}>
                <AppStyle>
                    <Router>
                        <Header>
                            <NavBar>
                                <StyledLink to="/game">Game World</StyledLink>
                                <StyledLink to="/game2">Game World New</StyledLink>
                                <StyledLink to="/programming">Program Editor</StyledLink>
                            </NavBar>
                            <User />
                        </Header>
                        <Switch>
                            <Route path="/game">
                                <GameBoard></GameBoard>
                            </Route>
                            <Route path="/game2">
                                <Game></Game>
                            </Route>
                            <Route path="/programming">
                                <ProgramEditor></ProgramEditor>
                            </Route>
                        </Switch>
                    </Router>
                </AppStyle>
            </ThemeProvider>
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
