import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { init, reducer, ScriptList, Program } from "./index";
import { Store, useStore } from "../Utility/Store";
import { default as StyledContainer } from "@material-ui/core/Container";
import GridLayout from "react-grid-layout";
import Lane from "./Lane";
import Card from "./Card";

/**
 *
 */
export function Hand({ schema }) {}
const Wrapper = styled.div`
    display: grid;
`;

function LaneContainer(props) {
    const lanes = ["Foo", "Bar", "Baz"];

    return (
        <GridLayout compactType="horizontal" verticalCompact={false} className="layout" cols={12} rowHeight={50} width={1200}>
            <div key="korte" style={{ background: "red" }} data-grid={{ x: 0, y: 0, w: 2, h: 2 }}>
                alma
            </div>
            <Card
                key="alma"
                data-grid={{ x: 2, y: 0, w: 2, h: 3 }}
                nodeProperties={{
                    name: `Test_1`,
                    description: "Boi",
                    input: ["Scalar", "Scalar"],
                    output: ["Text"],
                    params: ["Foo"],
                    ty: "Function",
                }}
            />
        </GridLayout>
    );
}
//{false && lanes.map((lane) => <Lane key={lane} name={lane}></Lane>)}

export default function ProgramEditor() {
    return (
        <Store initialState={init} reducer={reducer}>
            <StyledContainer style={{ marginTop: "100px" }}>
                <LaneContainer></LaneContainer>
            </StyledContainer>
        </Store>
    );
}
