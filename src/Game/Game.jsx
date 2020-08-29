import React, { useEffect, useState } from "react";
import GameBoard from "./GameBoard";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { messagesUrl, apiBaseUrl } from "../Config";
import axios from "axios";
import { useCaoMath, caoMath } from "../CaoWasm";

function setupTransform(caoMath, trans) {
    let scale = null;
    let translate = null;
    if (trans) {
        translate = new caoMath.Vec2f(trans.x, trans.y);
    }
    if (scale == null) scale = 2.0;
    if (translate == null) translate = new caoMath.Vec2f(-600, -1050);

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

    const [world, setWorld] = useState({});
    const [counter, setCounter] = useState(0);
    const parseWorld = ({ bots, resources, structures }) => {
        if (!caoMath || !transform) return {};
        const worldTransform = toWorld.bind(this, transform);

        const reducer = (l, p) => {
            p = worldTransform(p);
            if (p) l.push(p);
            return l;
        };

        const transformedBots = bots.reduce(reducer, []);
        const transformedResources = resources.reduce(reducer, []);
        const transformedStructures = structures.reduce(reducer, []);
        setWorld((old) => ({
            ...old,
            bots: transformedBots,
            resources: transformedResources,
            structures: transformedStructures,
        }));

        console.log("setworld parse");
    };
    useEffect(() => {
        if (lastMessage && lastMessage.data) {
            setCounter((old) => ++old);
            if (counter > 10) {
                let msg = lastMessage.data;
                msg.text().then((msg) => {
                    msg = JSON.parse(msg);
                    if (msg) {
                        console.log("setworld start", world);
                        parseWorld(msg);
                    }
                });
                setCounter(0);
            }
        }
    }, [lastMessage]);
    //    }, []);

    const [caoMath, caoErr] = useCaoMath();
    const [transform, setTransform] = useState();
    useEffect(() => {
        if (caoMath) setTransform(setupTransform(caoMath).transform);
    }, [caoMath]);

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

    const parseTerrain = ({ room, roomData }) => {
        if (!caoMath || !transform) return {};
        const worldTransform = toWorld.bind(this, transform);

        const reducer = (l, p) => {
            p = worldTransform(p);
            if (p) l.push(p);
            return l;
        };

        const tiles = roomData.tiles.reduce(reducer, []);
        setTerrain((old) => {
            const key = JSON.stringify(room);
            old[key] = tiles;
            return old;
        });

        console.log("setterrain parse");
    };

    const [terrain, setTerrain] = useState({});
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
            <GameBoard world={world} terrain={terrain}></GameBoard>
        </>
    );
    //return <GameBoard terrain={world.terrain}></GameBoard>;
}
