import React, { useState } from "react";
import styled from "styled-components";
import Draggable from "react-draggable";

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
`;

/**
 *
 */

export default function Card({ style, nodeProperties, ...rest }) {
    return (
        <CardStyle {...rest} style={style} id={`schema-node-${nodeProperties.name}`} ty={nodeProperties.ty}>
            {nodeProperties.name}
        </CardStyle>
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
