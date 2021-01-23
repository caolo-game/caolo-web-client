import React from "react";
import styled from "styled-components";
import Card from "./Card";
import { useDrop } from "react-dnd";
import { useDispatch } from "react-redux";
/**
 * Collection of cards, executed in order.
 */

export const LaneStyle = styled.div`
    display: flex;
    flex-direction: row;
    overflow-x: scroll;
    justify-content: flex-start;
    align-items: flex-start;
    min-height: 150px;
`;

export const LaneItem = styled.div`
    overflow-x: hidden;
    flex: 0 0 auto;
    margin-left: 5px;
`;

export default function Lane({ name, cards, laneId, noRemove }) {
    const dispatch = useDispatch();

    const [, drop] = useDrop({
        accept: "CAO_LANG_CARD",
        drop: (item, _monitor) => {
            dispatch({
                type: "PROG.ADD_CARD2LANE",
                payload: {
                    lane: laneId,
                    cardId: item.cardId,
                    cardName: item.id,
                },
            });
            return { laneName: name };
        },
    });

    return (
        <div>
            <h2>{name}</h2>
            {!noRemove ? <button onClick={() => dispatch({ type: "PROG.REMOVE_LANE", payload: { lane: laneId } })}>&#x1F5D1;</button> : null}
            <LaneStyle ref={drop}>
                {cards.map((node, i) => (
                    <LaneItem key={`Lane-${name}-${node.name}-${i}`}>
                        <Card
                            lane={name}
                            nodeProperties={node}
                            onDrop={(item, monitor) => {
                                if (!monitor.didDrop() || monitor.laneName !== name) {
                                    dispatch({
                                        type: "PROG.REMOVE_CARD_FROM_LANE",
                                        payload: {
                                            lane: laneId,
                                            cardId: item.id,
                                            index: i,
                                        },
                                    });
                                }
                            }}
                        />
                    </LaneItem>
                ))}
            </LaneStyle>
        </div>
    );
}
