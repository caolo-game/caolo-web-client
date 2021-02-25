import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { default as StyledContainer } from "@material-ui/core/Container";
import Lane, { LaneItem, LaneStyle } from "./Lane";
import Card from "./Card";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Button from "@material-ui/core/Button";

import { apiBaseUrl } from "../Config";

import { useCaoLang, cardToCaoLang } from "../CaoWasm";

export const LaneContainerStyle = styled.div`
    width: 100%;
    min-height: 150px;
`;

function init({ dispatch }) {
    dispatch({
        type: "PROG.ADD_LANE",
        payload: {
            name: "Main lane",
        },
    });
}

function LaneContainer(props) {
    const dispatch = useDispatch();
    const lanes = useSelector((state) => state?.prog?.lanes);
    const cardStates = useSelector((state) => state?.prog?.cardStates);
    const [caoLang] = useCaoLang();

    const [compileResult, setCompRes] = useState(null);

    useEffect(() => {
        console.log(compileResult);
    }, [compileResult]);

    useEffect(() => {
        if (caoLang) {
            const ls = lanes.map((l) => ({ name: l.name, cards: l.cards.map(cardToCaoLang(cardStates)).filter((l) => l != null) }));
            try {
                const compilationUnit = { lanes: ls };
                console.log("compiling:", compilationUnit, JSON.stringify(compilationUnit));
                const res = caoLang.compile(compilationUnit);
                setCompRes(res);
            } catch (err) {
                console.error("failed to compile", err);
            }
        }
    }, [setCompRes, lanes, caoLang, cardStates]);

    useEffect(() => {
        init({ dispatch });
        return () => dispatch({ type: "PROG.CLEAR_PROGRAM" });
    }, [dispatch]);

    return (
        <>
            <Button
                variant="outlined"
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
            </Button>
            <Button
                variant="outlined"
                onClick={() => {
                    dispatch({
                        type: "PROG.CLEAR_PROGRAM",
                    });
                    init({ dispatch });
                }}
            >
                &#128465;
            </Button>
            <DndProvider backend={HTML5Backend}>
                <LaneContainerStyle length={lanes?.length ?? 0 + 1}>
                    {lanes?.map((lane, i) => (
                        <Lane {...lane} laneId={i} key={i} noRemove={i === 0} />
                    ))}
                    <Schema />
                </LaneContainerStyle>
            </DndProvider>
        </>
    );
}

function Schema() {
    const cards = useSelector((state) => state?.prog?.schema?.cards) || [];

    return (
        <div>
            <h2>Schema</h2>
            <LaneStyle>
                {cards.map((node, i) => (
                    <LaneItem key={`${node.name}-${i}`}>
                        <Card nodeProperties={node} />
                    </LaneItem>
                ))}
            </LaneStyle>
        </div>
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
