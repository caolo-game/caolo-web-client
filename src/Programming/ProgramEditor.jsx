import React from "react";
import { Store, useStore } from "../Utility/Store";
import { init, reducer, ScriptList, Program } from "./index";
import Compiler from "./Compiler";
import Schema from "./Schema";
import styled from "styled-components";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
`;

const Tile = styled.div`
  padding-left: 20px;
  padding-right: 20px;
`;

export default function ProgramEditor() {
  return (
    <Store initialState={init} reducer={reducer}>
      <Wrapper>
        <Tile>
          <Editor></Editor>
        </Tile>
        <Tile>
          <Program></Program>
        </Tile>
        <Tile>
          <ScriptList></ScriptList>
        </Tile>
      </Wrapper>
    </Store>
  );
}

function Editor() {
  const [store, dispatch] = useStore();

  return (
    <>
      <input
        type="text"
        required
        onChange={e =>
          dispatch({ type: "SET_PROGRAM_NAME", payload: e.target.value })
        }
      ></input>
      <Compiler></Compiler>
      <Schema></Schema>
    </>
  );
}
