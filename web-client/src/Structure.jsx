import React from "react";
import { Rect } from "react-konva";
import { uuid2Color } from "./Game";

function Spawn({ struct, tileSize }) {
  let pos = struct.position;

  let uuid = struct.ownerId;
  let foreColor = uuid2Color(uuid);

  let size = tileSize * 1.3;

  return (
    <>
      <Rect
        key={pos.x + "_" + pos.y + "_" + struct.id}
        fill={foreColor}
        x={pos.x - size / 2}
        y={pos.y - size / 2}
        width={size}
        height={size}
        stroke="#a8a8a8"
        strokeWidth={1}
      />
    </>
  );
}

export default function Structure({ struct, tileSize }) {
  switch (struct.tag) {
    case "spawn":
      return Spawn({ struct: struct.data, tileSize });
    default:
      return null;
  }
}
