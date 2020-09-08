import React, { useState } from "react";
import { Stage, Container } from "@inlet/react-pixi";
import Bots from "./Bots";
import styled from "styled-components";
import FPSMeter from "./FPSMeter";
import Terrain from "./Terrain";
import Buttons2 from "./Buttons";

const StyledRoomView = styled.div`
    position: relative;
`;

const CanvasContainer = styled.div`
    padding: 100px;
`;

function RoomView({ terrain, world }) {
    const [selectedRoom, setSelectedRoom] = useState();
    const [selectedBot, setSelectedBot] = useState();

    return (
        <>
            <div>{JSON.stringify(selectedRoom)}</div>
            <div>{JSON.stringify(selectedBot)}</div>

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
                        </Container>
                        <FPSMeter></FPSMeter>
                    </Stage>
                </CanvasContainer>
            </StyledRoomView>
        </>
    );
}

export default RoomView;
