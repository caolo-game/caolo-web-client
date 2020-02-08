import React, { useState } from "react";
import Websocket from "react-websocket";

import { messagesUrl } from "../Config";

const handleMessage = (setWorld, msg) => {
  msg = JSON.parse(msg);
  if (msg.WORLD_STATE) {
    const world = msg.WORLD_STATE;
    setWorld(world);
  }
};

/**
 * Render the game worlds
 */
export default function GameBoard() {
  const [world, setWorld] = useState(null);
  return (
    <div>
      <h2>Game</h2>
      <Websocket
        url={messagesUrl}
        onMessage={msg => handleMessage(setWorld, msg)}
      ></Websocket>
      <pre>{JSON.stringify(world, null, 4)}</pre>
    </div>
  );
}
