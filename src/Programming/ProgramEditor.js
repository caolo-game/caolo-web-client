import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { default as StyledContainer } from "@material-ui/core/Container";
import Lane, { LaneItem, LaneStyle } from "./Lane";
import Card from "./Card";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { apiBaseUrl } from "../Config";

import { useCaoLang, cardToCaoLang } from "../CaoWasm";

function LaneContainer(props) {
    const dispatch = useDispatch();
    const lanes = useSelector((state) => state?.prog?.lanes);
    const cardStates = useSelector((state) => state?.prog?.cardStates);
    const [caoLang] = useCaoLang();

    const [compileResult, setCompRes] = useState(null);

    useEffect(() => {
        if (caoLang) {
            const ls = lanes.map((l) => ({ name: l.name, cards: l.cards.map(cardToCaoLang(cardStates)).filter((l) => l != null) }));
            try {
                const res = caoLang.compile({ lanes: ls });
                setCompRes(res);
            } catch (err) {
                console.error("failed to compile", err);
            }
        }
    }, [setCompRes, lanes, caoLang, cardStates]);

    useEffect(() => {
        dispatch({
            type: "PROG.ADD_LANE",
            payload: {
                name: "Main lane",
            },
        });
    }, [dispatch]);

    return (
        <DndProvider backend={HTML5Backend}>
            <button
                onClick={() =>
                    dispatch({
                        type: "PROG.ADD_LANE",
                        payload: {
                            name: "New lane",
                        },
                    })
                }
            >
                &#43;
            </button>
            {lanes?.map((lane, i) => (
                <Lane {...lane} laneId={i} key={i} />
            ))}
            <h2>Schema</h2>
            <Schema />
            Error:
            <pre>{JSON.stringify(compileResult?.compileError, null, 4)}</pre>
            Program:
            <pre>{JSON.stringify(compileResult?.program, null, 4)}</pre>
        </DndProvider>
    );
}

function Schema() {
    const cards = useSelector((state) => state?.prog?.schema?.cards) || [];

    return (
        <LaneStyle>
            {cards.map((node, i) => (
                <LaneItem key={`${node.name}-${i}`}>
                    <Card nodeProperties={node} />
                </LaneItem>
            ))}
        </LaneStyle>
    );
}

export default function ProgramEditor() {
    const dispatch = useDispatch();
    useEffect(() => {
        (async () => {
            const resp = await fetch(apiBaseUrl + "/schema");
            const payload = await resp.json();
            dispatch({
                type: "PROG.SET_SCHEMA",
                payload,
            });
        })();
    });
    return (
        <StyledContainer style={{ marginTop: "100px" }}>
            <LaneContainer />
        </StyledContainer>
    );
}
