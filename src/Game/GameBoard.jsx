import React, { useState } from "react";
import { Stage, Container, Sprite } from "@inlet/react-pixi";
import HexTile from "./HexTile";
import Bot from "./Bot";
import Resource from "./Resource";
import Structure from "./Structure";
import FPSMeter from "./FPSMeter";
import terrainBaker from "./TerrainBaker";
import { caoMath } from "../CaoWasm";

function RoomSprite({ roomKey }) {
    const imagePath = sessionStorage.getItem(roomKey);

    const { q, r } = JSON.parse(roomKey);
    const v = new caoMath.Vec2f(q, r);
    const { x, y } = caoMath.axialToPixelMatrixFlat().rightProd(v);
    const roomRadius = Math.sqrt(3) * 4 + 0.55;
    const hexRadius = Math.sqrt(3) * 4 + 0.55;
    const scale = roomRadius * hexRadius * Math.sqrt(3);
    const translateX = -20 * scale;
    const translateY = -20 * scale - 1500;
    console.log(x, y);
    return imagePath && <Sprite image={imagePath} scale={{ x: 0.5, y: 0.5 }} x={x * scale + translateX} y={y * scale + translateY}></Sprite>;
}

function Terrain({ terrain }) {
    const TERRAIN_COLOR = Object.freeze({
        plain: 0xd4ab6a,
        wall: 0xffddaa,
        bridge: 0xd4db6a,
    });

    Object.entries(terrain).forEach(([key, value]) => terrainBaker(key, value));
    return (
        <>
            {false &&
                Object.values(terrain)
                    .slice(0, 7)
                    .map((room) => {
                        return room.map((tile) => (
                            <HexTile
                                key={tile.worldPosition.x + " " + tile.worldPosition.y}
                                x={tile.worldPosition.x}
                                y={tile.worldPosition.y}
                                color={TERRAIN_COLOR[tile.ty]}
                                scale={2}
                            />
                        ));
                    })}
            {Object.keys(terrain).map((key) => (
                <RoomSprite roomKey={key} />
            ))}
        </>
    );
}

function Bots({ bots }) {
    if (!bots || !Object.values(bots)) return null;
    return (
        <>
            {bots.map((bot) => (
                <Bot key={bot.id} x={bot.worldPosition.x} y={bot.worldPosition.y} color={0x000000} mouseOver={() => console.log(bot)} />
            ))}
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

function GameBoard({ terrain, world }) {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    if (!Object.values(terrain) || !Object.values(terrain).length) return null;
    return (
        <>
            <div>
                <button onClick={() => setPosition(({ x, y }) => ({ x: x - 10, y }))}>{"<--"}</button>
                <button onClick={() => setPosition(({ x, y }) => ({ x: x + 10, y }))}>{"-->"}</button>
                <button onClick={() => setPosition(({ x, y }) => ({ x, y: y - 10 }))}>{"^"}</button>
                <button onClick={() => setPosition(({ x, y }) => ({ x, y: y + 10 }))}>{"v"}</button>
            </div>
            <Stage options={{ backgroundColor: 0x486988, sharedTicker: true }}>
                <FPSMeter></FPSMeter>
                <Container position={[position.x, position.y]} scale={0.6}>
                    <Terrain terrain={terrain} />
                    <Container>
                        <Bots bots={world.bots} />
                        <Resources resources={world.resources} />
                        <Structures structures={world.structures} />
                    </Container>
                </Container>
            </Stage>
        </>
    );
}

export default GameBoard;
