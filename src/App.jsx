import React, { useState } from "react";
import "./App.css";
import classnames from "classnames";
import GameBoard from "./Game";
import ScriptEditor from "./ScriptEditor";
import ScriptEditor2 from "./ScriptEditor/ScriptEditor2";
import ScriptEditor3 from "./ScriptEditor3/ScriptEditor3";
import { Tabs, Tab, AppBar } from "@material-ui/core";

export default function App() {
    // const [value, setValue] = useState(0);
    const [value, setValue] = useState(3);
    return (
        <div>
            <AppBar position="static">
                <Tabs value={value} onChange={(e, value) => setValue(value)} aria-label="simple tabs example">
                    <Tab label="Game" />
                    <Tab label="Script Editor (Canvas)" />
                    <Tab label="Script Editor (SVG)" />
                    <Tab label="Script Editor (Scratch)" />
                </Tabs>
            </AppBar>

            <GameBoard visible={value === 0} />
            {value === 1 && <ScriptEditor />}
            {value === 2 && <ScriptEditor2 />}
            {value === 3 && <ScriptEditor3 />}
        </div>
    );
}
