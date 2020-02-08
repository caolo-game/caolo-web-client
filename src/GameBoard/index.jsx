import React, { useState, useEffect } from "react";
import Websocket from "react-websocket";
import { Application } from "pixi.js";

import { messagesUrl } from "../Config";

const handleMessage = (setWorld, msg) => {
  msg = JSON.parse(msg);
  if (msg.WORLD_STATE) {
    const world = msg.WORLD_STATE;
    setWorld(world);
  }
};

export default function GameBoard() {
  const [world, setWorld] = useState(null);
  const [app, setApp] = useState(null);
  const [appView, setAppView] = useState(null);
  useEffect(() => {
    const app = new Application({});
    setApp(app);
  }, [setApp]);
  useEffect(() => {
    if (app && appView) {
      appView.appendChild(app.view);
    }
  }, [app, appView]);
  return (
    <div>
      <h2>Game</h2>
      <Websocket
        url={messagesUrl}
        onMessage={msg => handleMessage(setWorld, msg)}
      ></Websocket>
      <div ref={ref => setAppView(ref)}></div>
      <pre>{JSON.stringify(world, null, 4)}</pre>
    </div>
  );
}
