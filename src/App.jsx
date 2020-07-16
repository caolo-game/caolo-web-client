import React, { useState, useEffect } from "react";
import { HashRouter as Router, Switch, Route, Link } from "react-router-dom";
import { apiBaseUrl } from "./Config";
import Axios from "axios";
import styled, { ThemeProvider } from "styled-components";
import ProgramEditor from "./Programming/ProgramEditor";
import GameBoard from "./GameBoard";

const theme = {
  primary: "#4ecca3",
  secondary: "#4e78cc",
  error: "#ce4e63"
};

const Header = styled.header`
  height: 3em;
  font-size: 2em;
  display: grid;
`;

const UserHeader = styled.div`
  grid-column-start: 2;
  text-align: right;
`;

const NavBar = styled.nav`
  grid-column-start: 1;
  display: inline-grid;
  grid-template-columns: repeat(${props => props.children.length || 0}, 1fr);
`;

const StyledLink = styled(Link)`
  color: ${props => props.theme.secondary};
`;

const GoogleLogin = styled.a`
  color: ${props => props.theme.secondary};
`;

export default function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <Router>
          <Header>
            <NavBar>
              <StyledLink to="/game">Game World</StyledLink>
              <StyledLink id='programming-link' to="/programming">Program Editor</StyledLink>
            </NavBar>
            <User />
          </Header>
          <Switch>
            <Route path="/game">
              <GameBoard></GameBoard>
            </Route>
            <Route path="/programming">
              <ProgramEditor></ProgramEditor>
            </Route>
          </Switch>
        </Router>
      </ThemeProvider>
    </>
  );
}

function User() {
  const [user, setUser] = useState(null);
  const [refresh, setRefresh] = useState(null);

  useEffect(() => {
    if (refresh && !user) {
      clearInterval(refresh);
      setRefresh(null);
    }
  }, [refresh, setRefresh, user]);

  useEffect(() => {
    Axios.get(apiBaseUrl + "/myself", { withCredentials: true })
      .then(r => {
        const refreshInterval =
          setInterval(() => {
            Axios.get(
              apiBaseUrl + "/extend-token", { withCredentials: true }
            ).catch(e => {
              console.error("Failed to extend token", e);
              setUser(null);
            })
          }, 4 * 60 * 1000); // 4 minutes
        setUser(r.data);
        setRefresh(refreshInterval);
      })
      .catch(e => {
        console.warn("failed to get the user's info", e);
        setUser(null);
      });
  }, [setUser, setRefresh]);

  return (
    <UserHeader>
      {user ? (
        "Hello " + user.email.split("@")[0]
      ) : (
          <GoogleLogin href={`${apiBaseUrl}/login/google?redirect=${window.location.href}`}>

            Log in via Google
          </GoogleLogin>
        )}
    </UserHeader>
  );
};