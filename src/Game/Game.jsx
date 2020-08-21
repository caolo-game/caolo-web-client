import React, { useEffect, useState, useMemo } from "react";
import GameBoard from "./GameBoard";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { messagesUrl, apiBaseUrl } from "../Config";
import axios from "axios";
import { useCaoMath, caoMath } from "../CaoWasm";

function setupTransform(caoMath) {
    let scale = null;
    let translate = new caoMath.Vec2f(-600, -1050);
    if (scale == null) scale = 2.0;
    if (translate == null) translate = new caoMath.Vec2f(0, 0);

    const a2p = caoMath.axialToPixelMatrixPointy().asMat3f();
    const p2a = caoMath.pixelToAxialMatrixPointy().asMat3f();
    const scaleMat = caoMath.Mat3f.scaleMatrix(scale);
    let translateMat = caoMath.Mat3f.translateMatrix(translate);
    translateMat = translateMat.matrixMul(scaleMat);
    const worldToBoard = (point) => {
        point = scaleMat.rightProd(point);
        return translateMat.rightProd(point);
    };

    return {
        transform: {
            scale,
            translate,
            a2p,
            p2a,
            scaleMat,
            translateMat,
            worldToBoard,
        },
    };
}

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
                    console.log("setworld start");
                }
            });
        }
        //}, [lastMessage]);
    }, []);

    const [caoMath, caoErr] = useCaoMath();
    const [transform, setTransform] = useState();
    useEffect(() => {
        if (caoMath) setTransform(setupTransform(caoMath).transform);
    }, [caoMath]);

    const parseTerrain = ({ room, roomData }) => {
        if (!caoMath || !transform) return {};
        function toWorld(transform, entity) {
            try {
                const pos = entity.position.absolutePos;
                const v = new caoMath.Vec2f(pos.x, pos.y).toHomogeneous(1.0);
                return {
                    ...entity,
                    worldPosition: transform.worldToBoard(v),
                };
            } catch (e) {
                console.error("Failed to map entity", JSON.stringify(entity, null, 4), transform, e);
                throw e;
            }
        }
        const worldTransform = toWorld.bind(this, transform);

        const reducer = (l, p) => {
            p = worldTransform(p);
            if (p) l.push(p);
            return l;
        };

        const tiles = roomData.tiles.reduce(reducer, []);

        const worldCopy = { ...world };
        const key = JSON.stringify(room);
        worldCopy.terrain[key] = tiles;

        console.log("setworld parse");
        setWorld(worldCopy);
    };

    useEffect(() => {
        //todo
        if (transform) {
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
        }
    }, [transform]);

    return (
        <>
            {useMemo(
                () => (
                    <GameBoard terrain={world.terrain}></GameBoard>
                ),
                [world.terrain]
            )}
        </>
    );
    //return <GameBoard terrain={world.terrain}></GameBoard>;
}
