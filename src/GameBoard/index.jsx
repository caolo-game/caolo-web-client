import React, { useState } from "react";
import GameBoard from "./GameBoard";
import { Store } from "../Utility/Store";

const caoMathImport = import("@caolo-game/cao-math");
var caoMath = null;

export const useCaoMath = () => {
  const [cao, setCao] = useState(caoMath);
  caoMathImport.then(c => setCao(c));
  return cao;
};

caoMathImport.then(cao => (caoMath = cao));

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_WORLD": {
      console.time("Process World");
      let res = (() => {
        if (!caoMath || !state.transform) return { ...state };
        const world = action.payload;
        world.bots = world.bots.map(b => {
          let pos = new caoMath.Vec2Float(b.position.q, b.position.r);
          b.position = state.transform.worldToBoard(pos);
          return b;
        });
        world.resources = world.resources.map(t => {
          let pos = new caoMath.Vec2Float(t.position.q, t.position.r);
          t.position = state.transform.worldToBoard(pos);
          return t;
        });
        world.terrain = world.terrain.map(t => {
          let pos = new caoMath.Vec2Float(t.position.q, t.position.r);
          t.position = state.transform.worldToBoard(pos);
          return t;
        });
        world.structures = world.structures.map(t => {
          let pos = new caoMath.Vec2Float(t.position.q, t.position.r);
          t.position = state.transform.worldToBoard(pos);
          return t;
        });
        return { ...state, world };
      })();
      console.timeEnd("Process World");
      return res;
    }
    case "SET_TRANSFORM":
      let { scale, translate } = action.payload;
      if (scale === null) scale = 1.0;
      if (translate === null) translate = new caoMath.Vec2Float(0, 0);

      const a2p = caoMath.axialToPixelMatrixPointy();
      const p2a = caoMath.pixelToAxialMatrixPointy();
      const scaleMat = caoMath.Matrix2Float.scaleMatrix(scale);
      const worldToBoard = point => {
        point = a2p.rightProd(point);
        point = point.add(translate);
        point = scaleMat.rightProd(point);
        return point;
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
