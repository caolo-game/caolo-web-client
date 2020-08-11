import React, { useEffect, useState } from "react";
import GameBoard from "./GameBoard";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { messagesUrl, apiBaseUrl } from "../Config";
import axios from "axios";
import { useCaoMath, caoMath } from "../CaoWasm";

export default function Game(props) {
    const { sendMessage, lastMessage, readyState } = useWebSocket(messagesUrl, {
        retryOnError: true,
        reconnectAttempts: 10,
        reconnectInterval: 3000,
    });
    const connectionStatus = {
        [ReadyState.CONNECTING]: "Connecting",
        [ReadyState.OPEN]: "Open",
        [ReadyState.CLOSING]: "Closing",
        [ReadyState.CLOSED]: "Closed",
        [ReadyState.UNINSTANTIATED]: "Uninstantiated",
    }[readyState];

    const [world, setWorld] = useState({ terrain: {} });
    useEffect(() => {
        if (lastMessage && lastMessage.data) {
            let msg = lastMessage.data;
            msg.text().then((msg) => {
                msg = JSON.parse(msg);
                if (msg) {
                    setWorld(msg);
                }
            });
        }
        //}, [lastMessage]);
    }, []);

    const [caoMath, caoErr] = useCaoMath();
    const parseTerrain = ({ room, roomData }) => {
        if (!caoMath) return {};
        function toWorld(transform, entity) {
            try {
                const pos = entity.position.absolutePos;
                const v = new caoMath.Vec2f(pos.x, pos.y).toHomogeneous(1.0);
                return {
                    ...entity,
                    worldPosition: v,
                };
            } catch (e) {
                console.error("Failed to map entity", JSON.stringify(entity, null, 4), transform, e);
                throw e;
            }
        }
        const worldTransform = toWorld.bind(this, {});

        const reducer = (l, p) => {
            p = worldTransform(p);
            if (p) l.push(p);
            return l;
        };

        const tiles = roomData.tiles.reduce(reducer, []);

        const worldCopy = { ...world };
        const key = JSON.stringify(room);
        worldCopy.terrain[key] = tiles;

        setWorld(worldCopy);
    };

    useEffect(() => {
        axios
            .get(apiBaseUrl + "/terrain/rooms")
            .then((rooms) => {
                const promises = rooms.data.map(({ q, r }) =>
                    axios
                        .get(apiBaseUrl + "/terrain", {
                            params: {
                                q,
                                r,
                            },
                        })
                        .then((response) => {
                            //dispatch({ type: "SET_ROOM_PROPS", payload: { roomProperties: response.data.roomProperties, room: { q, r } } });
                            parseTerrain({ roomData: response.data, room: { q, r } });
                        })
                        .catch(console.error)
                );
                return Promise.all(promises);
            })
            .catch(console.error);
    }, []);

    return <GameBoard terrain={world.terrain}></GameBoard>;
}
