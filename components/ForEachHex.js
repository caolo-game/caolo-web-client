import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

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
    return ({ pos, data, scale, orientation = "pointy", children }) => {
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
      let axial2pixel;
      switch (orientation) {
        case "pointy":
          axial2pixel = caoMath.axialToPixelMatrixPointy();
          break;
        case "flat":
          axial2pixel = caoMath.axialToPixelMatrixFlat();
          break;
        default:
          console.error("orientation not handled", orientation);
          axial2pixel = caoMath.Mat2f.identity();
          break;
      }
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

export default ForEachHex;
