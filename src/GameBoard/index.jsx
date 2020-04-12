import React from "react";
import GameBoard from "./GameBoard";
import { Store } from "../Utility/Store";
import { useCaoMath, caoMath } from "../CaoWasm";

function toWorld(transform, entity) {
  const pos = new caoMath.Vec2f(entity.position.q, entity.position.r);
  entity.position = transform.worldToBoard(pos);
  entity.hexPosition = pos;
  if (entity.owner) {
    entity.owner = "#" + entity.owner.join("");
  }
  return entity;
}

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_WORLD": {
      console.time("Process World");
      let res = (() => {
        if (!caoMath || !state.transform) return { ...state };
        const world = action.payload;
        const worldTransform = toWorld.bind(this, state.transform);
        world.bots = world.bots.map(worldTransform);
        world.resources = world.resources.map(worldTransform);
        world.terrain = world.terrain.map(worldTransform);
        world.structures = world.structures.map(worldTransform);
        return { ...state, world };
      })();
      console.timeEnd("Process World");
      return res;
    }
    case "SET_TRANSFORM":
      let { scale, translate } = action.payload;
      if (scale == null) scale = state.transform.scale || 1.0;
      if (translate == null)
        translate = state.transform.translate || new caoMath.Vec2f(0, 0);

      const a2p = caoMath.axialToPixelMatrixPointy().asMat3f();
      const p2a = caoMath.pixelToAxialMatrixPointy().asMat3f();
      const scaleMat = caoMath.Mat3f.scaleMatrix(scale);
      const translateMat = caoMath.Mat3f.translateMatrix(translate);

      const hexToWorld = translateMat.matrixMul(scaleMat).matrixMul(a2p);
      const worldToBoard = (point) => {
        const p3 = point.toHomogeneous(1.0);
        return hexToWorld.rightProd(p3);
      };
      return {
        ...state,
        transform: {
          translate,
          a2p,
          p2a,
          scaleMat,
          hexToWorld,
          translateMat,
          worldToBoard,
        },
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

export default function () {
  const [caoMath, caoErr] = useCaoMath();
  if (caoErr) return `Failed to load math ${caoErr}`;
  if (!caoMath) return "Loading math...";
  return (
    <Store initialState={{ transform: {} }} reducer={reducer}>
      <GameBoard></GameBoard>
    </Store>
  );
}
