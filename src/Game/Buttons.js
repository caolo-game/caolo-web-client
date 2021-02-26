import React, { useEffect, useState } from "react";
import axios from "axios";
import { apiBaseUrl } from "../Config";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";

const Svg = styled.svg`
    fill: rgb(35, 41, 49);
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

const StyledDivButton = styled.div`
    background: brown;
    &:hover {
        fill: lightgray;
    }
    width: 350px;
    height: 50px;
    transform: translate(${(props) => props.center[0]}px, ${(props) => props.center[1]}px) rotate(${(props) => props.rotation}rad);
    border-radius: 10px;
    position: absolute;
    &:hover {
        background: turquoise;
    }
`;

const Rotate = ([x, y], radian = 1.047) => {
    const cos = Math.cos(radian);
    const sin = Math.sin(radian);
    return [cos * x - sin * y, sin * x + cos * y];
};

const BUTTONS = Object.freeze([
    [0, -1],
    [1, -1],
    [1, 0],
    [0, 1],
    [-1, 1],
    [-1, 0],
]);

const Button = ({ rooms, diffQ, diffR, index }) => {
    const selectedRoom = useSelector((state) => state.game.selectedRoom);
    const dispatch = useDispatch();
    const containerSize = [950, 875];
    const hexRadius = 675;
    const buttonSize = [350, 50];
    const angle = 1.047;
    const center = [containerSize[0] / 2 - buttonSize[0] / 2, containerSize[1] / 2 - buttonSize[1] / 2];
    const translateLength = hexRadius / 2 + buttonSize[1] / 2 + 10;
    const translate = Rotate([0, -translateLength], angle * index);
    const final = [center[0] + translate[0], center[1] + translate[1]];

    return (
        <>
            {selectedRoom && rooms.some(({ pos: { q, r } }) => q === selectedRoom.q + diffQ && r === selectedRoom.r + diffR) && (
                <StyledDivButton
                    rotation={angle * index}
                    onClick={() => dispatch({ type: "GAME.SELECT_ROOM", payload: { q: selectedRoom.q + diffQ, r: selectedRoom.r + diffR } })}
                    center={final}
                ></StyledDivButton>
            )}
        </>
    );
};

export default function Buttons({ selectedRoom }) {
    const dispatch = useDispatch();
    const [rooms, setRooms] = useState([]);
    useEffect(() => {
        const fetchRooms = async () => {
            const response = await axios.get(apiBaseUrl + "/world/rooms");
            const rms = response.data.map((o) => ({
                ...o,
                pos: {
                    q: parseInt(o.pos.q),
                    r: parseInt(o.pos.r),
                },
            }));
            setRooms(rms);
            dispatch({ type: "GAME.SELECT_ROOM", payload: rms[0].pos });
        };
        fetchRooms();
    }, [dispatch]);

    return (
        <>
            <Svg>
                <defs>
                    <mask id="hole">
                        <rect width="100%" height="100%" fill="white" />
                        <Polygon points="325,155 250,285 100,285 25,155 100,25 250,25 325,155 250,285" fill="black"></Polygon>
                    </mask>
                </defs>

                <rect width="100%" height="100%" mask="url(#hole)"></rect>
            </Svg>
            {BUTTONS.map(([diffQ, diffR], i) => (
                <Button index={i} key={i} rooms={rooms} selectedRoom={selectedRoom} diffQ={diffQ} diffR={diffR}></Button>
            ))}
        </>
    );
}
