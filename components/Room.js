import React, { useMemo } from "react";
import HexTile from "./HexTile";
import { Bot, Structure, Resource } from "./Entities";
import ForEachHex from "./ForEachHex";

export default function Room({
  roomLayout,
  terrain,
  entities: { bots, structures, resources },
}) {
  const scale = 15;
  // TODO: calculate bounds...
  return (
    <>
      <div
        style={{
          width: "80%",
        }}
      >
        <svg viewBox={`200 -50 900 800`}>
          <ForEachHex pos={roomLayout} data={terrain} scale={scale}>
            <HexTile />
          </ForEachHex>
          {!structures ? null : (
            <ForEachHex
              pos={structures.map(({ pos }) => [pos.pos.q, pos.pos.r])}
              scale={scale}
              data={structures}
            >
              <Structure />
            </ForEachHex>
          )}
          {!bots ? null : (
            <ForEachHex
              pos={bots.map(({ pos }) => [pos.pos.q, pos.pos.r])}
              scale={scale}
              data={bots}
            >
              <Bot />
            </ForEachHex>
          )}
          {!resources ? null : (
            <ForEachHex
              pos={resources.map(({ pos }) => [pos.pos.q, pos.pos.r])}
              scale={scale}
              data={resources}
            >
              <Resource />
            </ForEachHex>
          )}
        </svg>
      </div>
    </>
  );
}
