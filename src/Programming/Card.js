import React from "react";
import styled from "styled-components";

export const CardStyle = styled.div`
    font-size: 1em;
    margin-top: 0.1em;
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
    width: 9.03em;
    height: 12em;
    padding: 1.25em 1em;
    &:hover {
        background-color: ${(props) => props.theme.secondary};
    }
`;

/**
 *
 */
export default function Card({ nodeProperties }) {
    return (
        <CardStyle key={nodeProperties.name} id={`schema-node-${nodeProperties.name}`} ty={nodeProperties.ty}>
            <div>
                <b>{nodeProperties.name}</b>
            </div>
            <div>
                Parameters: {nodeProperties.params ? <Params params={nodeProperties.params}></Params> : "-"}
                <br />
                &rarr; [<Params params={nodeProperties.input || []}></Params>]<br />[<Params params={nodeProperties.output || []}></Params>] &rarr;
            </div>
        </CardStyle>
    );
}

function Params({ params }) {
    params = params.map((p) => p.split("::").pop());
    return params.join(", ");
}
