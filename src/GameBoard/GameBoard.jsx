import React, { useState, useEffect } from "react";
import Websocket from "react-websocket";
import { Application, Graphics } from "pixi.js";
import { messagesUrl } from "../Config";
import { handleMessage } from "./index";
import { useStore } from "../Utility/Store";

export default function GameBoard() {
  const [app, setApp] = useState(null);
  const [appView, setAppView] = useState(null);
  const [scale, setScale] = useState(0.5);
  const [translate, setTranslate] = useState(null);
  const [store, dispatch] = useStore();

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
      setScale(5);
    }
  }, [app, appView]);

  useEffect(() => {
    if (app && store.world) {
      app.stage.children.length = 0;
      store.world.bots.forEach(bot => {
        const rectangle = new Graphics();
        rectangle.beginFill(0xff3300);
        rectangle.drawRect(0, 0, 5, 5);
        rectangle.endFill();
        rectangle.x = bot.position.x;
        rectangle.y = bot.position.y;
        app.stage.addChild(rectangle);
      });
      store.world.terrain.forEach(tile => {
        switch (tile.ty) {
          case "WALL":
            const rectangle = new Graphics();
            rectangle.beginFill(0x3333ff);
            rectangle.drawRect(0, 0, 5, 5);
            rectangle.endFill();
            rectangle.x = tile.position.x;
            rectangle.y = tile.position.y;
            app.stage.addChild(rectangle);
            break;
          default:
            console.error("tile type not rendered:", tile.ty);
        }
      });
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
      <pre>{JSON.stringify(store.world && store.world.logs, null, 4)}</pre>
    </div>
  );
}
