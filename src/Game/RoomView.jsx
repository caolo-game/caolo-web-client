import React, { useState } from "react";
import { Stage, Container } from "@inlet/react-pixi";
import Bots from "./Bots";
import Structures from "./Structures";
import Resources from "./Resources";
import styled from "styled-components";
import FPSMeter from "./FPSMeter";
import Terrain from "./Terrain";
import Buttons2 from "./Buttons";
import Infopanel from "./Infopanel";
import { default as StyledContainer } from "@material-ui/core/Container";

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

function RoomView({ terrain, world }) {
    const [selectedRoom, setSelectedRoom] = useState();
    const [selectedBot, setSelectedBot] = useState();

    return (
        <StyledContainer>
            <StyledRoomView>
                <Buttons2 selectedRoom={selectedRoom} setSelected={setSelectedRoom}></Buttons2>
                <CanvasContainer>
                    <Stage
                        width={500}
                        height={450}
                        options={{
                            backgroundColor: 0x486988,
                            sharedTicker: true,
                            antialias: true,
                        }}
                    >
                        <Container scale={0.5} position={[-130, 0]}>
                            <Terrain room={selectedRoom}></Terrain>
                            <Bots room={selectedRoom} setSelectedBot={setSelectedBot}></Bots>
                            <Structures room={selectedRoom} setSelectedBot={setSelectedBot}></Structures>
                            <Resources room={selectedRoom} setSelectedBot={setSelectedBot}></Resources>
                        </Container>
                        <FPSMeter></FPSMeter>
                    </Stage>
                </CanvasContainer>
            </StyledRoomView>
            <Infopanel selectedRoom={selectedRoom} selectedBot={selectedBot}></Infopanel>
        </StyledContainer>
    );
}

export default RoomView;
