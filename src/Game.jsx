import React, { useEffect, useState } from "react";
import Websocket from "react-websocket";
import Axios from "axios";
import classnames from "classnames";
import { Stage, Layer, Circle, RegularPolygon, Text } from "react-konva";
import Structure from "./Structure";
import Resource from "./Resource";
import "./Game.css";

const SQRT3 = Math.sqrt(3);
const DEBUG_POS = false;

export function hashpos(pos) {
    return `${pos.x}_${pos.y}`;
}

export function uuid2Color(uuid) {
    let parts = uuid.split("-");
    let ints = parts.map(function(d) {
        return parseInt(d, 16);
    });
    let code = ints[0];

    let blue = (code >> 16) & 31;
    let green = (code >> 21) & 31;
    let red = (code >> 27) & 31;
    return "rgb(" + (red << 3) + "," + (green << 3) + "," + (blue << 3) + ")";
}

function Bot({ bot, tileSize, offset }) {
    let pos = bot.position;
    let hex = pos;

    let uuid = bot.ownerId;
    let foreColor = uuid2Color(uuid);

    return (
        <>
            <Circle key={hashpos(hex) + "_" + bot.id} x={pos.x} y={pos.y} radius={tileSize / 2} fill={foreColor} stroke="black" strokeWidth={1} />
            <PosPrompt pos={pos} hex={hex}></PosPrompt>
        </>
    );
}

function tileTypeColor(tileType) {
    switch (tileType) {
        case "Wall":
            return "#a7a7a7";
        case "Plain":
            return "#2b2b2b";
        default:
            console.warn("Unrecognized tile type ", tileType);
            return "lightgreen";
    }
}

function PosPrompt({ pos, hex }) {
    if (DEBUG_POS) return <Text key={hashpos(hex) + "_text"} x={pos.x} y={pos.y} text={`${hex.x};${hex.y}`}></Text>;
    return <></>;
}

function HexTile({ pos, ty, tileSize, offset }) {
    let hex = pos;
    return (
        <>
            <RegularPolygon key={hashpos(hex) + "_tile"} sides={6} x={pos.x} y={pos.y} stroke="black" fill={tileTypeColor(ty)} radius={tileSize} />
            <PosPrompt pos={pos} hex={hex}></PosPrompt>
        </>
    );
}

const GameBoard = props => {
    const width = window.innerHeight;
    const vision = [[-20, -20], [20, 20]]; // TODO: send to server
    const tileSize = width / 80;
    const offset = vision[0].map(x => 1 - x);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [game, setGame] = useState({
        terrain: [],
        structs: [],
        resources: [],
        bots: []
    });

    useEffect(() => {
        Axios.get("./defaultTerrain.json")
            .then(result => {
                let newGame = { ...game };
                newGame.terrain = result.data;
                setGame(newGame);
            })
            .catch(error => console.log(error));
    }, []);

    const renderError = () => {
        return error ? <div>{error}</div> : null;
    };

    const handleClose = error => {
        setError("Connection closed");
    };

    const renderGame = () => {
        let latency = 0;
        let tick = 0;
        let numberOfBots = 0;
        let numberOfStructures = 0;
        let numberOfResources = 0;
        if (game) {
            latency = game.deltaTimeMs;
            tick = game.tick;
            numberOfBots = Object.values(game.bots).length;
            numberOfStructures = Object.values(game.structs).length;
            numberOfResources = Object.values(game.resources).length;
        }

        return (
            <>
                <div className="game-container" style={{ width }}>
                    {loading && (
                        <div className="game-loading-overlay" style={{ width }}>
                            Loading...
                        </div>
                    )}
                    <div>Latency: {latency}ms</div>
                    <div>Tick: {tick}</div>
                    <div>Number of bots: {numberOfBots}</div>
                    <div>Number of structures: {numberOfStructures}</div>
                    <div>Number of resources: {numberOfResources}</div>
                    <Stage width={width} height={width}>
                        <Layer>{game.terrain && game.terrain.map(t => <HexTile tileSize={tileSize} pos={t[0]} ty={t[1]} />)}</Layer>
                        <Layer>{game.structs && game.structs.map(s => <Structure struct={s} tileSize={tileSize}></Structure>)}</Layer>
                        <Layer>{game.resources && game.resources.map(r => <Resource resource={r} tileSize={tileSize}></Resource>)}</Layer>
                        <Layer>{game.bots && game.bots.map(e => Bot({ bot: e, tileSize }))}</Layer>
                    </Stage>
                </div>
            </>
        );
    };

    const handleData = data => {
        data = JSON.parse(data);

        const terrainMap = data.terrain.reduce((terr, a) => {
            terr[hashpos(a[0])] = a[1];
            return terr;
        }, {});

        const terrain = data.terrain;
        for (let x = vision[0][0]; x <= vision[1][0]; ++x) {
            for (let y = vision[0][1]; y <= vision[1][1]; ++y) {
                if (!terrainMap[hashpos({ x, y })]) {
                    terrain.push([{ x, y }, "Plain"]);
                }
            }
        }
        const newState = {
            deltaTimeMs: data.deltaTimeMs,
            tick: data.time,
            bots: data.bots.bots.map(b => {
                b.position = mapPosToCanvas(b.position, tileSize, offset);
                return b;
            }),
            structs: data.structures.structures.map(s => {
                Object.values(s).forEach(s => {
                    try {
                        s.position = mapPosToCanvas(s.position, tileSize, offset);
                    } catch (_) {}
                });
                return s;
            }),
            resources: data.resources.resources.map(r => {
                Object.values(r).forEach(r => {
                    try {
                        r.position = mapPosToCanvas(r.position, tileSize, offset);
                    } catch (_) {}
                });
                return r;
            }),
            terrain: terrain.map(t => {
                t[0] = mapPosToCanvas(t[0], tileSize, offset);
                return t;
            })
        };

        console.log("Setting world state", newState);
        setGame(newState);
        setLoading(false);
        setError(null);
    };

    return (
        <div>
            <Websocket url="wss://caolo.herokuapp.com" onMessage={handleData} onClose={handleClose} />
            {props.visible && renderGame()}
            {props.visible && renderError()}
        </div>
    );
};

export default GameBoard;

function mapPosToCanvas(pos, tileSize, offset) {
    let x = pos.x;
    let y = pos.y;
    x += offset[0];
    y += offset[1];

    x += Math.floor(y / 2);

    x = tileSize * (SQRT3 * x - (SQRT3 / 2) * y);
    y = tileSize * ((3 / 2) * y);

    return { x, y };
}
