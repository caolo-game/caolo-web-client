import React from "react";
import { Store, useStore } from "../Utility/Store";
import { init, reducer, ScriptList, Program } from "./index";
import Compiler from "./Compiler";
import Schema from "./Schema";
import styled from "styled-components";

const Wrapper = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
`;

export default function ProgramEditor() {
    return (
        <Store initialState={init} reducer={reducer}>
            <Wrapper>
                <Toolbox></Toolbox>
                <Program></Program>
                <ScriptList></ScriptList>
            </Wrapper>
        </Store>
    );
}

const ClearProgram = styled.button``;

function Toolbox() {
    const [store, dispatch] = useStore();

    return (
        <div>
            <div>
                <label htmlFor="programname">Name: </label>
                <input
                    id="programname"
                    type="text"
                    required
                    value={store.programName}
                    onChange={(e) => dispatch({ type: "SET_PROGRAM_NAME", payload: e.target.value })}
                ></input>
            </div>
            <div>
                <ClearProgram
                    onClick={(e) =>
                        dispatch({
                            type: "CLEAR_PROGRAM",
                        })
                    }
                >
                    Clear
                </ClearProgram>
            </div>
            <Compiler></Compiler>
            <Schema></Schema>
        </div>
    );
}
