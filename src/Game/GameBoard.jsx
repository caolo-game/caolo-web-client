import React from "react";
import { Stage, Sprite } from "@inlet/react-pixi";
import HexTile from "./HexTile";

export default function GameBoard({ terrain }) {
    console.log("render", terrain);
    if (!Object.values(terrain) || !Object.values(terrain).length) return null;
    return (
        <Stage>
            {Object.values(terrain).map((room) => {
                return room.map((tile) => <HexTile x={tile.worldPosition.x} y={tile.worldPosition.y} color={0xff0000} scale={2} />);
            })}
        </Stage>
    );
}
