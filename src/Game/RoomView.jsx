import React, { useState, useEffect } from "react";
import { Stage, Container, Sprite } from "@inlet/react-pixi";
import HexTile from "./HexTile";
import Bot from "./Bot";
import Resource from "./Resource";
import Structure from "./Structure";
import { caoMath } from "../CaoWasm";
import { apiBaseUrl } from "../Config";
import axios from "axios";
import styled from "styled-components";

function Terrain({ tiles }) {
    const TERRAIN_COLOR = Object.freeze({
        plain: 0xd4ab6a,
        wall: 0xffddaa,
        bridge: 0xd4db6a,
    });

    return (
        <>
            <HexTile scale={5} x={20} y={20} color={0xff55ff}></HexTile>
            {tiles.map((tile) => {
                const scale = 5.3;
                const v = new caoMath.Vec2f(tile.position.roomPos.q, tile.position.roomPos.r);
                const { x, y } = caoMath.axialToPixelMatrixPointy().rightProd(v);
                const scaledX = x * Math.sqrt(3) * scale;
                const scaledY = y * Math.sqrt(3) * scale + 50;

                return (
                    <HexTile
                        key={tile.position.roomPos.q + " " + tile.position.roomPos.r}
                        x={scaledX}
                        y={scaledY}
                        color={TERRAIN_COLOR[tile.ty]}
                        scale={5}
                    ></HexTile>
                );
            })}
        </>
    );
}

function Bots({ bots }) {
    if (!bots || !Object.values(bots)) return null;
    return (
        <>
            <Bot size={5} x={20} y={20} color={0xff55ff} mouseOver={() => {}}></Bot>
            {bots.map((bot) => {
                const scale = 5.3;
                const v = new caoMath.Vec2f(bot.position.roomPos.q, bot.position.roomPos.r);
                const { x, y } = caoMath.axialToPixelMatrixPointy().rightProd(v);
                const scaledX = x * Math.sqrt(3) * scale;
                const scaledY = y * Math.sqrt(3) * scale + 50;
                return <Bot key={bot.id} size={5} x={scaledX} y={scaledY} color={0x000000} mouseOver={() => console.log(bot)} />;
            })}
        </>
    );
}

function Resources({ resources }) {
    if (!resources || !Object.values(resources)) return null;
    return (
        <>
            {resources.map((resource) => (
                <Resource
                    key={resource.id}
                    x={resource.worldPosition.x}
                    y={resource.worldPosition.y}
                    color={0x000000}
                    mouseOver={() => console.log(resource)}
                />
            ))}
        </>
    );
}

function Structures({ structures }) {
    if (!structures || !Object.values(structures)) return null;
    return (
        <>
            {structures.map((structure) => (
                <Structure key={structure.id} x={structure.worldPosition.x} y={structure.worldPosition.y} payload={structure.payload} />
            ))}
        </>
    );
}

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

function RoomView({ terrain, world }) {
    const [selectedRoom, setSelectedRoom] = useState();

    const [roomData, setRoomData] = useState();
    useEffect(() => {
        const fetchRoomData = async () => {
            const response = await axios.get(apiBaseUrl + "/terrain", { params: selectedRoom });
            setRoomData(response.data);
        };
        fetchRoomData();
    }, [selectedRoom]);

    const [botData, setBotData] = useState();
    useEffect(() => {
        const fetchBotData = async () => {
            const response = await axios.get(apiBaseUrl + "/bots", { params: selectedRoom });
            setBotData(response.data);
        };
        fetchBotData();
    }, [selectedRoom]);
    return (
        <>
            <RoomChooser setSelected={setSelectedRoom}></RoomChooser>
            <div>{JSON.stringify(selectedRoom)}</div>

            <Stage options={{ backgroundColor: 0x486988, sharedTicker: true }}>
                {roomData && <Terrain tiles={roomData.tiles}></Terrain>}
                {botData && <Bots bots={botData}></Bots>}
            </Stage>
        </>
    );
}

export default RoomView;
