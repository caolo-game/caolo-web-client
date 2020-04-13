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
          <Toolbox></Toolbox>
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

const Meta = styled.div`
  position: fixed;
  top: 10vh;
  max-width: 30vw;
`;

const ClearProgram = styled.button``;

function Toolbox() {
  const [, dispatch] = useStore();

  return (
    <Meta>
      <div>
        <label htmlFor="programname">Name: </label>
        <input
          id="programname"
          type="text"
          required
          onChange={e =>
            dispatch({ type: "SET_PROGRAM_NAME", payload: e.target.value })
          }
        ></input>
      </div>
      <div>
        <ClearProgram
          onClick={e =>
            dispatch({
              type: "CLEAR_PROGRAM"
            })
          }
        >
          Clear
        </ClearProgram>
      </div>
      <Compiler></Compiler>
      <Schema></Schema>
    </Meta>
  );
}
