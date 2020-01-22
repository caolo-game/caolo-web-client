import React, { useState, useEffect } from "react";
import { apiBaseUrl } from "./Config";
import Axios from "axios";
import styled from "styled-components";
import { ProgramEditor } from "./Programming/ProgramEditor";

const Header = styled.header`
  height: 3em;
  font-size: 2em;
  display: grid;
`;

const UserHeader = styled.div`
  grid-column-start: 2;
  text-align: right;
`;

const NavBar = styled.div`
  grid-column-start: 1;
`;

function Body({ page }) {
  switch (page) {
    case 1:
      return <ProgramEditor></ProgramEditor>;
    default:
      return null;
  }
}

const GoogleLogin = styled.a``;

export default function App() {
  const [page, setPage] = useState(1);
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
      <Header>
        <NavBar>asd</NavBar>
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
      <Body page={page}></Body>
    </>
  );
}
