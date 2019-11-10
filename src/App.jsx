import React, { useState } from "react";
import "./App.css";
import GameBoard from "./Game";
import ScriptEditor from "./ScriptEditor";
import { Tabs, Tab, AppBar } from "@material-ui/core";

export default function App() {
    const [value, setValue] = useState(0);
    return (
        <div>
            <AppBar position="static">
                <Tabs value={value} onChange={(e, value) => setValue(value)} aria-label="simple tabs example">
                    <Tab label="Game" />
                    <Tab label="Script Editor" />
                </Tabs>
            </AppBar>

            {value === 0 && <GameBoard />}
            {value === 1 && <ScriptEditor />}
        </div>
    );
}
