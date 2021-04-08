import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

/**
 * Take two input lists:
 * @param pos: collection of [q,r] axial coordinates
 * @param data: collection of arbitrary data, where data[i] corresponds to pos[i]
 * @param scale: hex size
 *
 * Inject the properties: `pos`, `data`, `pixelPos` into the child component(s),
 * where `pos` is a single axial position provided, `data` is the corresponding data and `pixelPos` is the position in pixel space
 */
const ForEachHex = dynamic({
  loader: async () => {
    return ({ pos, data, scale, children }) => {
      const [caoMath, setCaoMath] = useState(null);
      useEffect(() => {
        (async () => {
          const caoMath = await import("@caolo-game/cao-math/cao_math");
          setCaoMath(caoMath);
        })();
      });
      if (!caoMath) return null;
      const axial2pixel = caoMath.axialToPixelMatrixPointy();
      // our transformation matrix
      const mat = caoMath.Mat2f.scale(scale).matMul(axial2pixel);
      return pos.map(([q, r], i) => {
        const props = {
          pos: [q, r],
          pixelPos: mat.rightProd(new caoMath.Vec2f(q, r)),
          data: data[i],
          key: i,
        };
        if (children instanceof Array)
          return children.map((el, j) =>
            React.cloneElement(el, { ...props, key: i * 100000 + j })
          );
        return React.cloneElement(children, props);
      });
    };
  },
});

const SQRT_3 = Math.sqrt(3);

function HexTile({ pos: pos, pixelPos, data, scale }) {
  const color = TileToColor[data];

  const width = scale * SQRT_3;
  const height = scale * 2;

  const points = [
    [0, 0],
    [width / 2, height / 4],
    [width, 0],
    [width, -height / 2],
    [width / 2, (-height * 3) / 4],
    [0, -height / 2],
  ].map(([x, y]) => [x + pixelPos.x, y + pixelPos.y]);

  let path = `M ${points[0][0]} ${points[0][1]}`;
  for (let pos of points.slice(1)) {
    path = ` ${path} L ${pos[0]} ${pos[1]}`;
  }

  return (
    <path
      d={path}
      style={{
        fill: color,
      }}
      pos={pos}
    />
  );
}

function maxpos(layout) {
  let [maxQ, maxR] = layout[0];
  for (let [q, r] of layout.slice(1)) {
    if (q > maxQ) maxQ = q;
    if (r > maxR) maxR = r;
  }
  return [maxQ, maxR];
}

export default function World({ roomId, roomLayout, terrain }) {
  const scale = 15;
  const [maxQ, maxR] = maxpos(roomLayout);
  // notice that bounds were flipped, because the tiles are "pointy top", the room will be a "flat top" hexagon
  const [bR, bQ] = [maxQ * SQRT_3 * scale, maxR * scale * 4];

  return (
    <>
      <div>
        RoomId: {roomId.q} {roomId.r}
      </div>
      <div>Layout len: {roomLayout.length}</div>
      <div>Terrain len: {terrain.length}</div>
      <div
        style={{
          width: "80vw",
          height: "80vh",
        }}
      >
        <svg viewBox={`0 0 ${bQ} ${bR}`}>
          <ForEachHex pos={roomLayout} data={terrain} scale={scale}>
            <HexTile scale={scale} />
          </ForEachHex>
        </svg>
      </div>
    </>
  );
}

const TileToColor = Object.freeze({
  EMPTY: "rgba(0,0,0,0)",
  WALL: "#ffddaa",
  PLAIN: "#d4ab6a",
  BRIDGE: "#d4db6a",
});
