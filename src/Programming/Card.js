import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useDrag } from "react-dnd";
import Tooltip from "@material-ui/core/Tooltip";

export const CardStyle = styled.div`
    font-size: 1em;
    cursor: pointer;
    border-radius: 3px;
    border: 2px solid
        ${(props) => {
            switch (props.ty) {
                case "Function":
                    return "#dd8e00";
                case "Instruction":
                    return "#8edd00";
                default:
                    return props.theme.primary;
            }
        }};
    &:hover {
        background-color: ${(props) => props.theme.secondary};
    }
    width: 147px;
    height: 180px;
    padding: 5px;
    overflow: auto;
`;

export default function Card({ style, nodeProperties, onDrop, lane, ...rest }) {
    const [cardState, setCardState] = useState({ constants: [] });
    const dispatch = useDispatch();

    useEffect(() => {
        if (lane) {
            dispatch({
                type: "PROG.SET_CARD",
                payload: {
                    cardId: nodeProperties.cardId,
                    payload: cardState,
                },
            });
        }
    }, [dispatch, cardState, lane, nodeProperties]);

    const id = `${nodeProperties.name}`;
    const [, drag] = useDrag({
        item: { id, type: "CAO_LANG_CARD" },
        end: (item, monitor) => {
            if (onDrop) {
                onDrop(item, monitor);
            }
        },
        begin: () => ({ id: nodeProperties.name, cardId: nodeProperties.cardId, lane }),
    });
    return (
        <div ref={drag}>
            <Tooltip title={nodeProperties.description}>
                <CardStyle {...rest} style={style} id={id} ty={nodeProperties.ty}>
                    <h4>{nodeProperties.name}</h4>
                    <div>
                        <TypeList items={nodeProperties?.input} />
                        &#8594;
                        <TypeList items={nodeProperties?.output} />
                    </div>
                    <div>
                        {lane ? (
                            nodeProperties?.constants?.map((con, i) => (
                                <Constant
                                    key={`constant-${i}`}
                                    constantTy={con}
                                    onChange={(ev) => {
                                        const constants = [...cardState.constants];
                                        constants[i] = ev.target.value;
                                        setCardState({ ...cardState, constants });
                                    }}
                                />
                            ))
                        ) : (
                            <TypeList items={nodeProperties?.constants} />
                        )}
                    </div>
                </CardStyle>
            </Tooltip>
        </div>
    );
}

function TypeList({ items }) {
    if (!items || !items.length) {
        return "None";
    }
    return items?.map((item, i) => typeString(item)).join(", ");
}

function typeString(ty) {
    if (typeof ty !== "string") {
        return ty;
    } else {
        return ty.trim().split("::").slice(-1)[0];
    }
}

function Constant({ constantTy, onChange }) {
    const lanes = useSelector((state) => state?.prog?.lanes?.map((l) => l.name));

    switch (constantTy) {
        case "Text":
            return <input type="text" onChange={onChange}></input>;
        case "Integer":
            return <input type="number" step="1" defaultValue="0" onChange={onChange}></input>;
        case "Floating point":
            return <input type="number" defaultValue="0.0" onChange={onChange}></input>;
        case "Card ID":
        case "Lane ID": {
            return (
                <select onChange={onChange}>
                    {lanes.map((l) => (
                        <option values={l}>{l}</option>
                    ))}
                </select>
            );
        }

        default:
            console.warn(`constant type ${constantTy} is not implemented!`);
            return null;
    }
}
