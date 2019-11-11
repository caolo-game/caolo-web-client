import React, { useState } from "react";
import "./App.css";
import classnames from "classnames";
import GameBoard from "./Game";
import ScriptEditor from "./ScriptEditor";
import ScriptEditor2 from "./ScriptEditor/ScriptEditor2";
import { Tabs, Tab, AppBar } from "@material-ui/core";

export default function App() {
    const [value, setValue] = useState(0);
    return (
        <div>
            <AppBar position="static">
                <Tabs value={value} onChange={(e, value) => setValue(value)} aria-label="simple tabs example">
                    <Tab label="Game" />
                    <Tab label="Script Editor (Canvas)" />
                    <Tab label="Script Editor (SVG)" />
                </Tabs>
            </AppBar>

            <GameBoard visible={value === 0} />
            {value === 1 && <ScriptEditor />}
            {value === 2 && <ScriptEditor2 />}
        </div>
    );
}
