import React, { useEffect } from "react";
import { Stage, Container } from "@inlet/react-pixi";
import { useSelector, useDispatch } from "react-redux";
import Bots from "./Bots";
import Structures from "./Structures";
import Resources from "./Resources";
import styled from "styled-components";
import FPSMeter from "./FPSMeter";
import Terrain from "./Terrain";
import Buttons from "./Buttons";
import Infopanel from "./Infopanel";
import { default as StyledContainer } from "@material-ui/core/Container";
import ContextBridge from "./ContextBridge";
import { ReactReduxContext } from "react-redux";

const StyledRoomView = styled.div`
    position: relative;
    width: 950px;
    height: 875px;
    background: rgb(35, 41, 49);
    margin-top: 100px;
`;

const CanvasContainer = styled.div`
    padding: 100px;
`;

function RoomView() {
    const selectedRoom = useSelector((state) => state.game.selectedRoom);

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch({ type: "GAME.WATCH_ROOM_START", payload: selectedRoom });
        return () => dispatch({ type: "GAME.WATCH_ROOM_END", payload: selectedRoom });
    }, [dispatch, selectedRoom]);

    return (
        <StyledContainer>
            <StyledRoomView>
                <Buttons></Buttons>
                <CanvasContainer>
                    <ContextBridge
                        Context={ReactReduxContext}
                        render={(children) => (
                            <Stage
                                width={500}
                                height={450}
                                options={{
                                    backgroundColor: 0x486988,
                                    sharedTicker: true,
                                    antialias: true,
                                }}
                            >
                                {children}
                            </Stage>
                        )}
                    >
                        <Container scale={0.5} position={[-130, 0]}>
                            <Terrain room={selectedRoom}></Terrain>
                            <Bots></Bots>
                            <Structures></Structures>
                            <Resources></Resources>
                        </Container>
                        <FPSMeter></FPSMeter>
                    </ContextBridge>
                </CanvasContainer>
            </StyledRoomView>
            <Infopanel></Infopanel>
        </StyledContainer>
    );
}

export default RoomView;
