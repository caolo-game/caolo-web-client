import React from "react";
import { RegularPolygon, Text } from "react-konva";
import { hashpos } from "./Game";

export function Mineral({ resource, tileSize }) {
    let pos = resource.position;
    let hex = pos;
    return (
        <>
            <RegularPolygon
                key={hashpos(hex) + "_tile"}
                sides={3}
                x={pos.x}
                y={pos.y}
                stroke="blue"
                fill="lightblue"
                radius={tileSize}
            ></RegularPolygon>
            <Text text={`${resource.energy}/${resource.energyMax}`} x={pos.x} y={pos.y} fill="white" fontSize={14}></Text>
        </>
    );
}

export default function Resource({ resource, tileSize, offset }) {
    switch (resource.tag) {
        case "mineral":
            return <Mineral resource={resource.data} tileSize={tileSize}></Mineral>;
        default:
            return null;
    }
}
