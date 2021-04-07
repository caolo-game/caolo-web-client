import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
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

import { messagesUrl, apiBaseUrl } from "../Config";

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
    const ws = useRef(null);
    const [hasStream, setHasStream] = useState(false);
    const dispatch = useDispatch();

    // open and close websocket
    useEffect(() => {
        const socket = new WebSocket(messagesUrl);
        socket.onopen = () => {
            ws.current = socket;
            setHasStream(true);
        };
        return () => {
            socket.close();
            ws.current = null;
            setHasStream(false);
        };
    }, []);

    useEffect(() => {
        (async () => {
            const resp = await axios.get(`${apiBaseUrl}/world/room-terrain-layout`);
            const pts = await resp.data;
            dispatch({
                type: "GAME.SET_ROOM_TERRAIN_COORDINATES",
                payload: pts,
            });
        })();
    }, [dispatch]);

    // setup onmessage once the socket is online
    useEffect(() => {
        if (!hasStream) return;
        ws.current.onmessage = (msg) => {
            const pl = JSON.parse(msg.data);
            switch (pl.ty) {
                case "terrain":
                    dispatch({
                        type: "GAME.SET_ROOM_TERRAIN",
                        payload: {
                            room: selectedRoom,
                            terrain: pl.terrain,
                        },
                    });
                    break;
                case "entities":
                    dispatch({
                        type: "GAME.FETCH_ROOM_OBJECTS_SUCCESS",
                        payload: {
                            room: selectedRoom,
                            data: pl.entities,
                        },
                    });
                    break;
                default:
                    console.error(`Message type ${pl.ty} not handled`);
                    break;
            }
        };
    }, [dispatch, hasStream, selectedRoom]);

    // send the current room to the server to receive object updates for this room
    useEffect(() => {
        if (hasStream) {
            const roomId = `${selectedRoom.q};${selectedRoom.r}`;
            ws.current.send(roomId);
        }
    }, [hasStream, selectedRoom]);

    const terrain = useSelector((state) => state?.game?.terrain);

    return (
        <StyledContainer>
            <StyledRoomView>
                <Buttons></Buttons>
                <CanvasContainer>
                    <ContextBridge
                        Context={ReactReduxContext}
                        render={(children) => (
                            <Stage
                                width={800}
                                height={600}
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
                        <Container scale={0.58} position={[-100, 0]}>
                            <Terrain room={selectedRoom} terrain={terrain}></Terrain>
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
