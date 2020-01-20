import React, { useState, useEffect } from "react";
import "./App.css";
import GameBoard from "./Game";
import ScriptEditor2 from "./ScriptEditor/ScriptEditor";
import { Tabs, Tab, AppBar, Button } from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import { apiBaseUrl } from "./Config";
import Axios from "axios";

export default function App() {
  const [value, setValue] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState();

  useEffect(() => {
    Axios.get(apiBaseUrl + "/myself", { withCredentials: true })
      .then(r => {
        setIsLoggedIn(true);
      })
      .catch(e => {
        console.warn("failed to get the user's info", e);
        setIsLoggedIn(false);
      });
  }, [setIsLoggedIn]);
  return (
    <div>
      <CssBaseline />
      <AppBar position="static" style={{ zIndex: 1201, position: "relative" }}>
        <Tabs
          value={value}
          onChange={(_e, value) => setValue(value)}
          aria-label="simple tabs example"
        >
          <Tab label="Game" />
          <Tab label="Script Editor (SVG)" />
        </Tabs>
        {!isLoggedIn && (
          <a href={apiBaseUrl + "/google"}>
            <Button color="inherit">
              <img
                width="20px"
                style={{ marginTop: "7px", marginRight: "8px" }}
                alt="Google sign-in"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
              />
              Login via Google
            </Button>
          </a>
        )}
      </AppBar>

      <GameBoard visible={value === 0} />
      {value === 1 && <ScriptEditor2 />}
    </div>
  );
}
