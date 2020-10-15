import React, { useState } from "react";
import styled from "styled-components";
import { init, reducer, ScriptList, Program } from "./index";
import { Store, useStore } from "../Utility/Store";
import { default as StyledContainer } from "@material-ui/core/Container";
import Card from "./Card";

const Wrapper = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
`;

export const LaneStyle = styled.div`
    display: flex;
    flex-direction: row;
    overflow-x: auto;
    width: 100%;
`;

export const LaneItem = styled.div`
    margin: 5px;
`;

/**
 * Collection of cards, executed in order.
 */
export function Lane({ name, cardList }) {
    const [cards, setCards] = useState(cardList);
    const [containerRef, setContRef] = useState(null);
    const [dragged, setDragged] = useState(null);
    const [over, setOver] = useState(null);
    const onDragStart = (i) => (e) => {
        setDragged(i);
    };
    const onDragOver = (i) => (e) => {
        e.preventDefault(); // allow drop
        setOver(i);
    };
    const onDrop = (e) => {
        console.log(dragged, over);
        if (over != null && over != dragged) {
            const [item] = cards.splice(dragged, 1);
            cards.splice(over, 0, item);
            setCards(cards);
        }
    };
    return (
        <div>
            <h2>{name}</h2>
            <LaneStyle ref={setContRef} onDrop={onDrop}>
                {cards.map((node, i) => (
                    <LaneItem key={`Lane-${name}-${node.name}-${i}`} onDragOver={onDragOver(i)} onDragStart={onDragStart(i)} draggable={true}>
                        <Card nodeProperties={node} />
                    </LaneItem>
                ))}
            </LaneStyle>
        </div>
    );
}

/**
 *
 */
export function Hand({ schema }) {}

export default function ProgramEditor() {
    const exampleSchema = [];
    for (let i = 0; i < 30; ++i) {
        exampleSchema.push({
            name: `Test_${i}`,
            description: "Boi",
            input: ["Scalar", "Scalar"],
            output: ["Text"],
            params: ["Foo"],
            ty: "Function",
        });
    }

    return (
        <Store initialState={init} reducer={reducer}>
            <StyledContainer style={{ marginTop: "100px" }}>
                <Wrapper>
                    <Lane name="Foo" cardList={exampleSchema} />
                </Wrapper>
            </StyledContainer>
        </Store>
    );
}
