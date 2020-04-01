import React, { useState, useEffect } from "react";
import Websocket from "react-websocket";
import { Application, Graphics } from "pixi.js";
import { messagesUrl } from "../Config";
import { handleMessage, useCaoMath } from "./index";
import { useStore } from "../Utility/Store";

export default function GameBoard() {
  const [app, setApp] = useState(null);
  const [appView, setAppView] = useState(null);
  const [scale, setScale] = useState(1);
  const [store, dispatch] = useStore();
  const [caoMath] = useCaoMath();
  const [translate] = useState(new caoMath.Vec2f(15, 25));

  const mapWorld = world => {
    dispatch({ type: "SET_WORLD", payload: world });
  };

  useEffect(() => {
    const app = new Application({});
    setApp(app);
  }, [setApp]);

  useEffect(() => {
    dispatch({ type: "SET_TRANSFORM", payload: { scale, translate } });
  }, [scale, translate, dispatch]);

  useEffect(() => {
    if (app && appView) {
      appView.appendChild(app.view);
      setScale(3.5);
    }
  }, [app, appView]);

  useEffect(() => {
    if (app && store.world) {
      console.time("Update app");
      updateApp(app, store.world);
      console.timeEnd("Update app");
    }
  }, [store.world, app]);

  return (
    <div>
      <h2>Game</h2>
      <Websocket
        url={messagesUrl}
        onMessage={msg => handleMessage(msg, { setWorld: mapWorld })}
      ></Websocket>
      <div ref={ref => setAppView(ref)}></div>
    </div>
  );
}

const updateApp = (app, world) => {
  app.stage.children.length = 0;
  world.bots.forEach(bot => {
    const circle = new Graphics();
    circle.beginFill(0xff3300);
    circle.drawCircle(0, 0, 3);
    circle.endFill();
    circle.x = bot.position.x;
    circle.y = bot.position.y;
    app.stage.addChild(circle);
  });
  world.resources.forEach(tile => {
    switch (tile.ty) {
      case "ENERGY":
        const resource = new Graphics();
        resource.beginFill(0x33ff33);
        resource.drawCircle(0, 0, 3);
        resource.endFill();
        resource.x = tile.position.x;
        resource.y = tile.position.y;
        app.stage.addChild(resource);
        break;
      default:
        console.error("resource type not rendered:", tile.ty);
    }
  });
  world.terrain.forEach(tile => {
    switch (tile.ty) {
      case "WALL":
        const wall = new Graphics();
        wall.beginFill(0x3333ff);
        wall.drawPolygon([0, 5, 2.5, 0, 5, 5]);
        wall.endFill();
        wall.x = tile.position.x;
        wall.y = tile.position.y;
        app.stage.addChild(wall);
        break;
      default:
        console.error("tile type not rendered:", tile.ty);
    }
  });
  world.structures.forEach(tile => renderStructure(tile, app));
};

function renderStructure(tile, app) {
  let fillColor = null;

  if (tile.payload && tile.payload.spawn) {
    fillColor = 0x00fff5;
  }

  if (fillColor === null) {
    console.error("structure not rendered", tile);
    return;
  }

  const structure = new Graphics();
  structure.beginFill(fillColor);
  structure.drawCircle(0, 0, 4);
  structure.endFill();
  structure.x = tile.position.x;
  structure.y = tile.position.y;

  app.stage.addChild(structure);
}
