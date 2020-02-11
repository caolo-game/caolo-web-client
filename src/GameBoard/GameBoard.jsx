import React, { useState, useEffect } from "react";
import Websocket from "react-websocket";
import { Application } from "pixi.js";
import { useCaoMath } from "./index";
import { messagesUrl } from "../Config";
import { handleMessage } from "./index";
import { useStore } from "../Utility/Store";

export default function GameBoard() {
  const [app, setApp] = useState(null);
  const [appView, setAppView] = useState(null);
  const [scale, setScale] = useState(0.5);
  const [translate, setTranslate] = useState(null);
  const [store, dispatch] = useStore();
  const caoMath = useCaoMath();

  const mapWorld = world => {
    dispatch({ type: "SET_WORLD", payload: world });
  };

  useEffect(() => {
    const app = new Application({});
    setApp(app);
  }, [setApp]);

  useEffect(() => {
    if (caoMath)
      dispatch({ type: "INIT_TRANSFORM", payload: { scale, translate } });
  }, [scale, translate, caoMath, dispatch]);

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
        onMessage={msg => handleMessage(msg, { setWorld: mapWorld })}
      ></Websocket>
      <div ref={ref => setAppView(ref)}></div>
      <pre>{JSON.stringify(store.world, null, 4)}</pre>
    </div>
  );
}
