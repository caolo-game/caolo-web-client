import React from "react";
import { Store } from "../Utility/Store";
import { init, reducer, ScriptList, Program, Compiler } from "./index";
import { Schema } from "./Schema";

export function ProgramEditor() {
  return (
    <Store initialState={init} reducer={reducer}>
      <Compiler></Compiler>
      <ScriptList></ScriptList>
      <Program></Program>
      <Schema></Schema>
    </Store>
  );
}
