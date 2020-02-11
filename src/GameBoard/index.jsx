import React, { useState } from "react";
import GameBoard from "./GameBoard";
import { Store } from "../Utility/Store";

const caoMathImport = import("cao-math");
var caoMath = null;

export const useCaoMath = () => {
  const [cao, setCao] = useState(caoMath);
  caoMathImport.then(c => setCao(c));
  return cao;
};

caoMathImport.then(cao => (caoMath = cao));

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_WORLD":
      if (!caoMath || !state.transform) return { ...state };
      const world = action.payload;
      const bots = world.bots.map(b => {
        let pos = new caoMath.Vec2Float(b.position.q, b.position.r);
        b.position = state.transform.worldToBoard(pos);
        return b;
      });
      world.__oldBots = world.bots;
      world.bots = bots;
      return { ...state, world };
    case "SET_TRANSFORM":
      let { scale, translate } = action.payload;
      if (!scale) scale = 1.0;
      if (!translate) translate = new caoMath.Vec2Float(0, 0);

      const a2p = caoMath.axialToPixelMatrixPointy();
      const p2a = caoMath.pixelToAxialMatrixPointy();
      const scaleMat = caoMath.Matrix2Float.scaleMatrix(scale);
      const worldToBoard = point => {
        point = a2p.rightProd(point);
        point = point.add(translate);
        return scaleMat.rightProd(point);
      };
      return {
        ...state,
        transform: {
          a2p,
          p2a,
          scaleMat,
          worldToBoard
        }
      };
    default:
      return state;
  }
};

export const handleMessage = (msg, { setWorld }) => {
  msg = JSON.parse(msg);
  if (msg.WORLD_STATE) {
    setWorld(msg.WORLD_STATE);
  }
};

export default function() {
  const caoMath = useCaoMath();
  if (!caoMath) return "Loading math...";
  return (
    <Store initialState={{}} reducer={reducer}>
      <GameBoard></GameBoard>
    </Store>
  );
}
