import React, { useState } from "react";
import styled from "styled-components";
import { useDrag } from "react-dnd";

export const CardStyle = styled.div`
    font-size: 1em;
    cursor: pointer;
    border-radius: 3px;
    border: 2px solid
        ${(props) => {
            switch (props.ty) {
                case "Function":
                    return "#dd8e00";
                default:
                    return props.theme.primary;
            }
        }};
    &:hover {
        background-color: ${(props) => props.theme.secondary};
    }
    width: 150px;
    height: 250px;
`;

/**
 *
 */

export default function Card({ style, nodeProperties, onDrop, lane, ...rest }) {
    const id = `${nodeProperties.name}`;
    const [collectedProps, drag] = useDrag({
        item: { id, type: "CAO_LANG_CARD" },
        collect: (monitor) => ({
            id: nodeProperties.name,
            lane,
        }),
        end: (item, monitor) => {
            if (onDrop) {
                onDrop(item, monitor);
            }
        },
        begin: () => ({ id: nodeProperties.name, lane }),
    });
    return (
        <div ref={drag}>
            <CardStyle {...rest} style={style} id={id} ty={nodeProperties.ty}>
                {nodeProperties.name}
            </CardStyle>
        </div>
    );
}
//  <div>
//                    Parameters: {nodeProperties.params ? <Params params={nodeProperties.params}></Params> : "-"}
//                    <br />
//                    &rarr; [<Params params={nodeProperties.input || []}></Params>]<br />[<Params params={nodeProperties.output || []}></Params>] &rarr;
//                </div>

function Params({ params }) {
    params = params.map((p) => p.split("::").pop());
    return params.join(", ");
}
