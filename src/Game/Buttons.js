import React, { useEffect, useState } from "react";
import axios from "axios";
import { apiBaseUrl } from "../Config";
import styled from "styled-components";

const Svg = styled.svg`
    fill: gray;
    pointer-events: none;
    width: 950px;
    height: 875px;
    left: 0px;
    top: 0px;
    position: absolute;
`;

const Polygon = styled.polygon`
    transform: scale(2.6) translate(7.5px, 15px);
`;

const StyledButton = styled.rect`
    fill: black;
    pointer-events: all;
    &:hover {
        fill: blue;
    }
    width: 350px;
    height: 50px;
    transform: translate(300px, 50px);
`;

const Button = ({ selectedRoom, rooms, setSelected, diffQ, diffR, transform }) => {
    return (
        <>
            {selectedRoom && rooms.some(({ q, r }) => q === selectedRoom.q + diffQ && r === selectedRoom.r + diffR) && (
                <StyledButton onClick={() => setSelected(({ q, r }) => ({ q: q + diffQ, r: r + diffR }))} style={{ transform }}></StyledButton>
            )}
        </>
    );
};

export default function Buttons({ selectedRoom, setSelected }) {
    const [rooms, setRooms] = useState([]);
    useEffect(() => {
        const fetchRooms = async () => {
            const response = await axios.get(apiBaseUrl + "/terrain/rooms");
            setRooms(response.data);
            setSelected(response.data[0]);
        };
        fetchRooms();
    }, [setSelected]);

    return (
        <Svg>
            <defs>
                <mask id="hole">
                    <rect width="100%" height="100%" fill="white" />
                    <rect width="45px" height="45px" fill="black" style={{ transform: "translate(100px,100px)" }} />
                    <Polygon points="325,155 250,285 100,285 25,155 100,25 250,25 325,155 250,285" fill="black"></Polygon>
                </mask>
            </defs>

            <rect width="100%" height="100%" mask="url(#hole)"></rect>
            {selectedRoom && rooms.some(({ q, r }) => q === selectedRoom.q && r === selectedRoom.r - 1) && (
                <Button onClick={() => setSelected(({ q, r }) => ({ q, r: r - 1 }))}></Button>
            )}
            <Button setSelected={setSelected} rooms={rooms} selectedRoom={selectedRoom} diffQ={0} diffR={-1}></Button>
            <Button setSelected={setSelected} rooms={rooms} selectedRoom={selectedRoom} diffQ={0} diffR={1} transform="translate(300px, 785px)"></Button>
            <Button
                setSelected={setSelected}
                rooms={rooms}
                selectedRoom={selectedRoom}
                diffQ={-1}
                diffR={1}
                transform="translate(90px, 475px) rotate(60deg)"
            ></Button>
            <Button
                setSelected={setSelected}
                rooms={rooms}
                selectedRoom={selectedRoom}
                diffQ={1}
                diffR={-1}
                transform="translate(730px, 100px) rotate(60deg)"
            ></Button>
            <Button
                setSelected={setSelected}
                rooms={rooms}
                selectedRoom={selectedRoom}
                diffQ={-1}
                diffR={0}
                transform="translate(260px, 120px) rotate(120deg)"
            ></Button>
            <Button
                setSelected={setSelected}
                rooms={rooms}
                selectedRoom={selectedRoom}
                diffQ={1}
                diffR={0}
                transform="translate(900px, 500px) rotate(120deg)"
            ></Button>
        </Svg>
    );
}
