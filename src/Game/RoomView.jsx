import React, { useState, useEffect } from "react";
import { Stage, Container } from "@inlet/react-pixi";
import Bots from "./Bots";
import { apiBaseUrl } from "../Config";
import axios from "axios";
import styled from "styled-components";
import FPSMeter from "./FPSMeter";
import Terrain from "./Terrain";
import Buttons2 from "./Buttons";

const StyledRoomChooser = styled.div`
    display: flex;
    flex-direction: column;
    height: 100px;
    width: 200px;
    overflow: auto;
`;

const StyledRoom = styled.div`
    &:hover {
        background: blue;
    }
`;

function RoomChooser({ setSelected }) {
    const [selectedRoom, setSelectedRoom] = useState();
    useEffect(() => {
        setSelected(selectedRoom);
    }, [selectedRoom, setSelected]);

    const [rooms, setRooms] = useState([]);
    useEffect(() => {
        const fetchRooms = async () => {
            const response = await axios.get(apiBaseUrl + "/terrain/rooms");
            setRooms(response.data);
            setSelectedRoom(response.data[0]);
        };
        fetchRooms();
    }, []);

    return (
        <div>
            <div>{JSON.stringify(selectedRoom)}</div>
            <StyledRoomChooser>
                {rooms.map((room) => (
                    <StyledRoom onClick={(e) => setSelectedRoom(JSON.parse(e.target.innerHTML))}>{JSON.stringify(room)}</StyledRoom>
                ))}
            </StyledRoomChooser>
        </div>
    );
}

const StyledRoomView = styled.div`
    position: relative;
`;

const CanvasContainer = styled.div`
    padding: 100px;
`;

function RoomView({ terrain, world }) {
    const [selectedRoom, setSelectedRoom] = useState();

    return (
        <>
            <RoomChooser setSelected={setSelectedRoom}></RoomChooser>
            <div>{JSON.stringify(selectedRoom)}</div>

            <StyledRoomView>
                <Buttons2 selectedRoom={selectedRoom} setSelected={setSelectedRoom}></Buttons2>
                <CanvasContainer>
                    <Stage width={500} height={450} options={{ backgroundColor: 0x486988, sharedTicker: true, antialias: true }}>
                        <Container scale={0.5} position={[-130, 0]}>
                            <Terrain room={selectedRoom}></Terrain>
                            <Bots room={selectedRoom}></Bots>
                        </Container>
                        <FPSMeter></FPSMeter>
                    </Stage>
                </CanvasContainer>
            </StyledRoomView>
        </>
    );
}

export default RoomView;
