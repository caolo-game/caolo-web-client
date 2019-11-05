import React from "react";
import "./App.css";
import GameBoard from "./Game";
import ScriptEditor from "./ScriptEditor";

export default function App() {
  return (
    <div>
      <GameBoard />
      <ScriptEditor />
    </div>
  );
}
