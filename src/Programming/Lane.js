import React, { useState, useRef, useEffect } from "react";
import styled, { css } from "styled-components";
import Card from "./Card";
/**
 * Collection of cards, executed in order.
 */

const LaneStyle = styled.div`
    display: flex;
    flex-direction: row;
    overflow-x: scroll;
    width: 80vw;
    justify-content: flex-start;
    align-items: flex-start;
`;

const LaneItem = styled.div`
    flex: 1 0 0;
    overflow-x: hidden;
    ${(props) =>
        props.isVisible &&
        css`
            flex: 0 0 auto;
        `}
`;

const exampleSchema = [];
for (let i = 0; i < 5; ++i) {
    exampleSchema.push({
        name: `Test_${i}`,
        description: "Boi",
        input: ["Scalar", "Scalar"],
        output: ["Text"],
        params: ["Foo"],
        ty: "Function",
    });
}

export default function Lane({ name }) {
    const [cards, setCards] = useState(exampleSchema);

    console.log("lane rerender", name);
    return (
        <div>
            <h2>{name}</h2>
            <LaneStyle>
                {cards.map((node, i) => (
                    <LaneItem isVisible={i > 3 && i < 7} key={`Lane-${name}-${node.name}-${i}`}>
                        <Card data-grid={{ x: 0, y: 0, w: 1, h: 1 }} nodeProperties={{ ...node, name: name + node.name }} />
                    </LaneItem>
                ))}
            </LaneStyle>
        </div>
    );
}
