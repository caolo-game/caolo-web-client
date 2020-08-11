import React from "react";
import { Stage, Sprite } from "@inlet/react-pixi";
import HexTile from "./HexTile";

export default function GameBoard({ terrain }) {
    if (!Object.values(terrain) || !Object.values(terrain).length) return null;
    return (
        <Stage>
            {Object.values(terrain)[0].map((tile) => (
                <HexTile x={tile.worldPosition.x - 600} y={tile.worldPosition.y - 1050} color={0xff0000} scale={10} />
            ))}
        </Stage>
    );
}
