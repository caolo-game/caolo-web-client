import React from "react";
import { Store } from "../Utility/Store";
import { init, reducer, ScriptList, Program, Compiler } from "./index";
import { Schema } from "./Schema";
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
          <Compiler></Compiler>
          <Schema></Schema>
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
