import React from "react";
import Websocket from "react-websocket";
import { Stage, Layer, Circle, RegularPolygon, Text } from "react-konva";
import Structure from "./Structure";
import Resource from "./Resource";

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

export default class GameBoard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            game: null
        };
        this.width = window.innerHeight;
        this.tileSize = this.width / 80;
        this.vision = [[-20, -20], [20, 20]]; // TODO: send to server
        this.offset = this.vision[0].map(x => 1 - x);
    }

    render() {
        return (
            <div>
                <Websocket url="wss://caolo.herokuapp.com" onMessage={this.handleData.bind(this)} onClose={this.handleClose.bind(this)} />
                {}
                {this.renderGame()}
                {this.renderError()}
            </div>
        );
    }

    renderError() {
        return this.state.error ? <div>{this.state.error}</div> : null;
    }

    handleClose(error) {
        this.setState({ error: "Connection closed" });
    }

    renderGame() {
        let game = this.state.game;
        if (!game) {
            return <div>Loading game state...</div>;
        }

        let width = this.width;
        let tileSize = this.tileSize;
        let latency = game.deltaTimeMs;
        let tick = game.tick;
        let numberOfBots = Object.values(game.bots).length;
        let numberOfStructures = Object.values(game.structs).length;
        let numberOfResources = Object.values(game.resources).length;

        return (
            <>
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
            </>
        );
    }

    handleData(data) {
        data = JSON.parse(data);

        const terrainMap = data.terrain.reduce((terr, a) => {
            terr[hashpos(a[0])] = a[1];
            return terr;
        }, {});

        const terrain = data.terrain;
        for (let x = this.vision[0][0]; x <= this.vision[1][0]; ++x) {
            for (let y = this.vision[0][1]; y <= this.vision[1][1]; ++y) {
                if (!terrainMap[hashpos({ x, y })]) {
                    terrain.push([{ x, y }, "Plain"]);
                }
            }
        }
        const newState = {
            deltaTimeMs: data.deltaTimeMs,
            tick: data.time,
            bots: data.bots.bots.map(b => {
                b.position = mapPosToCanvas(b.position, this.tileSize, this.offset);
                return b;
            }),
            structs: data.structures.structures.map(s => {
                Object.values(s).forEach(s => {
                    try {
                        s.position = mapPosToCanvas(s.position, this.tileSize, this.offset);
                    } catch (_) {}
                });
                return s;
            }),
            resources: data.resources.resources.map(r => {
                Object.values(r).forEach(r => {
                    try {
                        r.position = mapPosToCanvas(r.position, this.tileSize, this.offset);
                    } catch (_) {}
                });
                return r;
            }),
            terrain: terrain.map(t => {
                t[0] = mapPosToCanvas(t[0], this.tileSize, this.offset);
                return t;
            })
        };

        console.log("Setting world state", newState);
        this.setState({ game: newState });
    }
}

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
