import React, { useState, useEffect } from "react";
import Websocket from "react-websocket";
import { Application, Graphics } from "pixi.js";
import { messagesUrl } from "../Config";
import { handleMessage } from "./index";
import { useStore } from "../Utility/Store";
import { useCaoMath } from "../CaoWasm";

export default function GameBoard() {
  const [app, setApp] = useState(null);
  const [appView, setAppView] = useState(null);
  const [scale, setScale] = useState(1);
  const [store, dispatch] = useStore();
  const [caoMath] = useCaoMath();
  const [translate] = useState(new caoMath.Vec2f(20, 0));
  const [highlightedBot, setHighlightedBot] = useState(null);

  const mapWorld = (world) => {
    dispatch({ type: "SET_WORLD", payload: world });
  };

  useEffect(() => {
    const app = new Application({
      width: 1024,
      height: 1024,
    });
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
      updateApp(app, store.world, setHighlightedBot);
      console.timeEnd("Update app");
    }
  }, [store.world, app, setHighlightedBot]);

  return (
    <div>
      <h2>Game</h2>
      <Websocket
        url={messagesUrl}
        onMessage={(msg) => handleMessage(msg, { setWorld: mapWorld })}
      ></Websocket>
      <div ref={(ref) => setAppView(ref)}></div>
      <pre>{JSON.stringify(highlightedBot, null, 4)}</pre>
    </div>
  );
}

const updateApp = (app, world, setHighlightedBot) => {
  const hexagonRadius = 4;

  const hexWidth = hexagonRadius * Math.sqrt(3);
  const hexHeight = hexagonRadius * 2;

  app.stage.children.length = 0;
  app.renderer.backgroundColor = 0x486988;
  world.terrain.forEach((tile) => {
    const tileGraphics = new Graphics();
    tileGraphics.x = tile.position.x;
    tileGraphics.y = tile.position.y;
    switch (tile.ty) {
      case "PLAIN":
        tileGraphics.beginFill(0xd4ab6a, 1.0);
        tileGraphics.drawPolygon(
          [
            hexWidth, 0,
            hexWidth * 3 / 2, hexHeight / 4,
            hexWidth * 3 / 2, hexHeight * 3 / 4,
            hexWidth, hexHeight,
            hexWidth / 2, hexHeight * 3 / 4,
            hexWidth / 2, hexHeight / 4,
          ]
        );
        tileGraphics.endFill();
        app.stage.addChild(tileGraphics);
        break;
      case "WALL":
        tileGraphics.beginFill(0xffddaa, 1.0);
        tileGraphics.drawPolygon(
          [
            hexWidth, 0,
            hexWidth * 3 / 2, hexHeight / 4,
            hexWidth * 3 / 2, hexHeight * 3 / 4,
            hexWidth, hexHeight,
            hexWidth / 2, hexHeight * 3 / 4,
            hexWidth / 2, hexHeight / 4,
          ]
        );
        tileGraphics.endFill();
        app.stage.addChild(tileGraphics);
        break;
      case "EMPTY":
        break;
      default:
        console.error("tile type not rendered:", tile.ty);
    }
  });
  world.bots.forEach((bot) => {
    const circle = new Graphics();
    circle.beginFill(0xff3300);
    circle.drawCircle(0, 0, 3);
    circle.endFill();
    circle.x = bot.position.x;
    circle.y = bot.position.y;
    circle.interactive = true;
    circle.on("mouseover", (_) => setHighlightedBot(bot));
    app.stage.addChild(circle);
  });
  world.resources.forEach((tile) => {
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
  world.structures.forEach((tile) => renderStructure(tile, app));
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
