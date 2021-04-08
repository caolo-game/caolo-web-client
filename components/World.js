import React, { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import HexTile from "./HexTile";
import { Bot, Structure, Resource } from "./Entities";

/**
 * Take two input lists:
 * @param pos: collection of [q,r] axial coordinates
 * @param data: collection of arbitrary data, where data[i] corresponds to pos[i]
 * @param scale: hex size
 *
 * Inject the properties: `pos`, `data`, `pixelPos`, `scale` into the child component(s),
 * where `pos` is a single axial position provided, `data` is the corresponding data and `pixelPos` is the position in pixel space
 */
const ForEachHex = dynamic({
  loader: async () => {
    return ({ pos, data, scale, children }) => {
      if (pos?.length !== data?.length || data?.length == null) {
        return null;
      }
      const [caoMath, setCaoMath] = useState(null);
      useEffect(() => {
        (async () => {
          // force loading on the client so nextjs stops complaining...
          // see: https://github.com/asyncapi/asyncapi-react/issues/177
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
          scale,
          key: i,
        };
        if (children instanceof Array)
          return children.map((el, j) =>
            React.cloneElement(el, { ...props, key: i ^ (j + i) })
          );
        return React.cloneElement(children, props);
      });
    };
  },
});

const SQRT_3 = Math.sqrt(3);
function maxpos(layout) {
  let [maxQ, maxR] = layout[0];
  for (let [q, r] of layout.slice(1)) {
    if (q > maxQ) maxQ = q;
    if (r > maxR) maxR = r;
  }
  return [maxQ, maxR];
}

export default function World({
  roomId,
  roomLayout,
  terrain,
  entities: { bots, structures, resources },
}) {
  const scale = 15;
  const [maxQ, maxR] = useMemo(() => maxpos(roomLayout));
  // notice that bounds were flipped, because the tiles are "pointy top", the room will be a "flat top" hexagon
  const [bR, bQ] = [maxQ * SQRT_3 * scale, maxR * scale * 4];

  return (
    <>
      <div
        style={{
          width: "80vw",
          height: "80vh",
        }}
      >
        <svg viewBox={`200 0 ${bQ - 400} ${bR}`}>
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
