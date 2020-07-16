import React from "react";
import GameBoard from "./GameBoard";
import { Store } from "../Utility/Store";
import { useCaoMath, caoMath } from "../CaoWasm";

function emptyWorld() {
  return {
    terrain: {}
  };
}

/**
 * Map a CaoLo world entity to a client represenation
 */
function toWorld(transform, entity) {
  try {
    const pos = entity.position.absolutePos;
    const v = new caoMath.Vec2f(pos.x, pos.y).toHomogeneous(1.0)
    return {
      ...entity,
      worldPosition: transform.worldToBoard(v)
    };
  } catch (e) {
    console.error("Failed to map entity", JSON.stringify(entity, null, 4), transform, e);
    throw e;
  }
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_ROOM_PROPS': {
      const { roomProperties: rp, room } = action.payload;
      const roomProperties = {
        ...state.roomProperties,
      };
      roomProperties[room] = rp;
      return {
        ...state,
        roomProperties
      }
    }
    case "SET_TERRAIN": {
      if (!caoMath || !state.transform) return { ...state };
      console.time("SET_TERRAIN handler")
      const worldTransform = toWorld.bind(this, state.transform);

      const reducer = (l, p) => {
        p = worldTransform(p);
        if (p)
          l.push(p)
        return l
      };
      const { room, roomData } = action.payload;

      const tiles = roomData.tiles.reduce(reducer, []);

      const world = state.world || emptyWorld();
      const key = JSON.stringify(room);
      world.terrain[key] = tiles;

      console.debug("Set world", key, world.terrain[key]);
      console.timeEnd("SET_TERRAIN handler")

      return { ...state, world };
    }
    case "SET_WORLD": {
      if (!caoMath || !state.transform) return { ...state };
      const worldTransform = toWorld.bind(this, state.transform);
      const reducer = (l, p) => {
        p = worldTransform(p);
        if (p)
          l.push(p)
        return l
      };
      const world = action.payload;
      world.bots = world.bots.reduce(reducer, []);
      world.resources = world.resources.reduce(reducer, []);
      world.structures = world.structures.reduce(reducer, []);

      const w = state.world || emptyWorld();
      return {
        ...state, world: {
          ...w,
          ...world,
        }
      };
    }
    case "SET_TRANSFORM":
      let { scale, translate } = action.payload;
      if (scale == null) scale = state.transform.scale || 1.0;
      if (translate == null)
        translate = state.transform.translate || new caoMath.Vec2f(0, 0);

      const a2p = caoMath.axialToPixelMatrixPointy().asMat3f();
      const p2a = caoMath.pixelToAxialMatrixPointy().asMat3f();
      const scaleMat = caoMath.Mat3f.scaleMatrix(scale);
      let translateMat = caoMath.Mat3f.translateMatrix(translate);
      translateMat = translateMat.matrixMul(scaleMat);
      const worldToBoard = (point) => {
        point = scaleMat.rightProd(point);
        return translateMat.rightProd(point)
      };

      return {
        ...state,
        transform: {
          scale,
          translate,
          a2p,
          p2a,
          scaleMat,
          translateMat,
          worldToBoard,
        },
      };
    default:
      return state;
  }
};

export const handleMessage = (msg, { setWorld }) => {
  msg.text().then(msg => {
    msg = JSON.parse(msg);
    if (msg) {
      setWorld(msg);
    }
  })
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
