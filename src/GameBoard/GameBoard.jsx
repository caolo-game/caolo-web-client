import * as axios from "axios"
import styled from "styled-components";
import { apiBaseUrl, auth0Audience } from "../Config"
import React, { useRef, useState, useEffect } from "react";
import { Application, Graphics } from "pixi.js";
import { messagesUrl } from "../Config";
import { handleMessage } from "./index";
import { useStore } from "../Utility/Store";
import { useCaoMath } from "../CaoWasm";
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useAuth0 } from "@auth0/auth0-react";

export default function GameBoard() {
  const [app, setApp] = useState(null);
  const [appView, setAppView] = useState(null);
  const [scale] = useState(2);
  const [store, dispatch] = useStore();
  const [caoMath] = useCaoMath();
  const [translate] = useState({ x: -600, y: -1050 });
  const [highlightedBot, setHighlightedBot] = useState(null);

  useEffect(() => {
    axios.get(apiBaseUrl + "/terrain/rooms")
      .then((rooms) => {
        const promises = rooms.data.map(({ q, r }) =>
          axios.get(apiBaseUrl + "/terrain", {
            params: {
              q, r
            }
          })
            .then(response => {
              dispatch({ type: "SET_ROOM_PROPS", payload: { roomProperties: response.data.roomProperties, room: { q, r } } });
              dispatch({ type: "SET_TERRAIN", payload: { roomData: response.data, room: { q, r } } });
            })
            .catch(console.error)
        )
        return Promise.all(promises);
      })
      .catch(console.error)
  }, [dispatch])

  useEffect(() => {
    const app = new Application({
      width: 1024,
      height: 1024,
    });
    setApp(app);
  }, [setApp]);

  useEffect(() => {
    try {
      const tr =
        translate instanceof caoMath.Vec2f ? translate :
          new caoMath.Vec2f(translate.x, translate.y);
      dispatch({ type: "SET_TRANSFORM", payload: { scale, translate: tr } });
    } catch (e) {
      console.error("Failed to update transform matrix", e);
    }
  }, [scale, translate, dispatch, caoMath]);

  useEffect(() => {
    if (app && appView) {
      appView.appendChild(app.view);
    }
  }, [app, appView]);

  useEffect(() => {
    if (app && store.world) {
      updateApp(app, store.world, setHighlightedBot, scale);
    }
  }, [scale, store.world, app, setHighlightedBot]);


  const {
    sendMessage,
    lastMessage,
    readyState,
  } = useWebSocket(messagesUrl, {
    retryOnError: true,
    reconnectAttempts: 10,
    reconnectInterval: 3000,
  });
  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const getAccessToken = getAccessTokenSilently;

  const sentAuth = useRef(false);
  useEffect(() => {
    if (!sentAuth.current && readyState === ReadyState.OPEN && isAuthenticated) {
      sentAuth.current = true;
      (async () => {
        const token = await getAccessToken({
          audience: auth0Audience
        });
        const msg = {
          authToken: token
        }
        sendMessage(JSON.stringify(msg));
      })();
    }
  }, [readyState, getAccessToken, isAuthenticated, sendMessage])

  useEffect(() => {
    if (lastMessage && lastMessage.data) {
      const mapWorld = (world) => {
        dispatch({ type: "SET_WORLD", payload: world });
      };
      handleMessage(lastMessage.data, { setWorld: mapWorld })
    }
  }, [lastMessage, dispatch])

  return (
    <>
      <h2>Game</h2>

      {readyState === ReadyState.OPEN ?
        <GameBoardParent>
          <pre>{JSON.stringify(highlightedBot, null, 4)}</pre>
          <div ref={(ref) => setAppView(ref)}></div>
        </GameBoardParent>
        : connectionStatus
      }
    </>
  );
}

const GameBoardParent = styled.div`
    display: grid;
    grid-template-columns: minmax(150px, 25%) 1fr;
`;

function hexTile({
  x, y, color, scale
}) {
  const hexagonRadius = Math.sqrt(3) * (scale || 1) + 0.55;
  const hexWidth = hexagonRadius * Math.sqrt(3);
  const hexHeight = hexagonRadius * 2;

  const tileGraphics = new Graphics();
  tileGraphics.beginFill(color, 1.0);
  tileGraphics.drawPolygon(
    [
      [0, 0],
      [hexWidth / 2, hexHeight / 4],
      [hexWidth, 0],
      [hexWidth, -hexHeight / 2],
      [hexWidth / 2, (-hexHeight * 3) / 4],
      [0, -hexHeight / 2],
    ].flatMap(([q, r]) => [q, r])
  );
  tileGraphics.endFill();
  tileGraphics.x = x;
  tileGraphics.y = y;
  return tileGraphics
}

const updateApp = (app, world, setHighlightedBot, scale) => {
  app.stage.children.length = 0;
  app.renderer.backgroundColor = 0x486988;
  const terrain = world.terrain || {};
  Object.values(terrain).slice(0, 16).forEach((room) => room.forEach(tile => {
    const { x, y } = tile.worldPosition;
    switch (tile.ty) {
      case "plain":
        {
          const tileGraphics = hexTile({
            x, y,
            color: 0xd4ab6a,
            scale
          })
          app.stage.addChild(tileGraphics);
          break;
        }
      case "wall":
        {
          const tileGraphics = hexTile({
            x, y,
            color: 0xffddaa,
            scale
          })
          app.stage.addChild(tileGraphics);
          break;
        }
      case "bridge":
        {
          const tileGraphics = hexTile({
            x, y,
            color: 0xd4db6a,
            scale
          })
          app.stage.addChild(tileGraphics);
          break;
        }
      case "empty":
        break;
      default:
        console.error("tile type not rendered:", tile.ty);
    }
  }));
  const bots = world.bots || [];
  bots.forEach((bot) => {
    const circle = new Graphics();
    circle.beginFill(0xff3300);
    circle.drawCircle(0, 0, 3);
    circle.endFill();
    circle.x = bot.worldPosition.x;
    circle.y = bot.worldPosition.y;
    circle.interactive = true;
    circle.on("mouseover", (_) => setHighlightedBot(bot));
    app.stage.addChild(circle);
  });
  const resources = world.resources || [];
  resources.forEach((tile) => {
    if (tile.ty.energy) {
      const resource = new Graphics();
      resource.beginFill(0x33ff33);
      resource.drawCircle(0, 0, 3);
      resource.endFill();
      resource.x = tile.worldPosition.x;
      resource.y = tile.worldPosition.y;
      resource.on("mouseover", (_) => setHighlightedBot(tile));
      app.stage.addChild(resource);
    } else {
      console.error("resource type not rendered:", tile);
    }
  });
  const structures = world.structures || [];
  structures.forEach((tile) => renderStructure(tile, app));
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
  structure.x = tile.worldPosition.x;
  structure.y = tile.worldPosition.y;
  app.stage.addChild(structure);
}
