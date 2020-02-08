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
  const [user, setUser] = useState(null);

  useEffect(() => {
    Axios.get(apiBaseUrl + "/myself", { withCredentials: true })
      .then(r => {
        setUser(r.data);
      })
      .catch(e => {
        console.warn("failed to get the user's info", e);
        setUser(null);
      });
  }, [setUser]);
  return (
    <>
      <ThemeProvider theme={theme}>
        <Router>
          <Header>
            <NavBar>
              <StyledLink to="/game">Game World</StyledLink>
              <StyledLink to="/programming">Program Editor</StyledLink>
            </NavBar>
            <UserHeader>
              {user ? (
                "Hello " + user.email.split("@")[0]
              ) : (
                <GoogleLogin href={`${apiBaseUrl}/google`}>
                  Log in via Google
                </GoogleLogin>
              )}
            </UserHeader>
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
