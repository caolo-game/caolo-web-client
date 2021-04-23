import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import useWebSocket, { ReadyState } from "react-use-websocket";
import Room from "../components/Room";
import WorldMap from "../components/WorldMap";

async function fetchInitialData({ apiUrl, dispatch, q, r }) {
  try {
    await Promise.all([
      fetch(`${apiUrl}/world/rooms`)
        .then((x) => x.json())
        .then((rooms) =>
          dispatch({
            type: "GAME.SET_ROOMS",
            rooms,
          })
        ),
      fetch(`${apiUrl}/world/room-terrain-layout`)
        .then((x) => x.json())
        .then((roomLayout) =>
          dispatch({
            type: "GAME.SET_ROOM_LAYOUT",
            roomLayout,
          })
        ),
    ]);
  } catch (err) {
    // TODO: error page
    console.error("Failed to load data", err);
  }
}

export default function MapPage({ streamUrl, apiUrl }) {
  const { sendMessage, readyState, lastJsonMessage } = useWebSocket(streamUrl, {
    shouldReconnect: () => true,
  });
  const router = useRouter();

  const time = useSelector((state) => state?.game?.time);
  const entities = useSelector((state) => state?.game?.entities);
  const rooms = useSelector((state) => state?.game?.rooms);
  const roomLayout = useSelector((state) => state?.game?.roomLayout);
  const terrain = useSelector((state) => state?.game?.terrain);
  const roomId = useSelector(
    (state) => state?.game?.roomId ?? { q: null, r: null }
  );

  const selectedEntity = useSelector((state) => state?.game?.selectedEntity);

  const dispatch = useDispatch();

  useEffect(() => {
    let { q, r } = router.query;
    q = parseInt(q);
    r = parseInt(r);
    if (q && r) {
      (async () => {
        await fetchInitialData({ apiUrl, dispatch, q, r });
        dispatch({
          type: "GAME.SELECT_ROOM",
          roomId: { q, r },
        });
      })();
    }
  }, [router, dispatch, apiUrl]);

  useEffect(() => {
    let { q, r } = router.query;
    q = parseInt(q);
    r = parseInt(r);
    if ((q != roomId.q || r != roomId.r) && roomId.q && roomId.r) {
      console.info("Updating page query params to ", {
        q: roomId.q,
        r: roomId.r,
      });
      router.push(`/map?q=${roomId.q}&r=${roomId.r}`, undefined, {
        shallow: true,
        scroll: false,
      });
    }
  }, [router, roomId, dispatch]);

  useEffect(() => {
    switch (lastJsonMessage?.ty) {
      case "entities":
        const { payload: entities, time } = lastJsonMessage.entities;
        dispatch({
          type: "GAME.SET_ENTITIES",
          entities,
          time,
        });
        break;
      case "terrain":
        dispatch({
          type: "GAME.SET_TERRAIN",
          terrain: lastJsonMessage.terrain,
        });
        break;
      case "error":
        console.error(
          "Received error message from the object stream",
          lastJsonMessage.error
        );
        break;
      case undefined:
      case null:
        break;
      default:
        console.error("Message type unhandled:", lastJsonMessage?.ty);
    }
  }, [lastJsonMessage, dispatch]);

  useEffect(() => {
    // subscribe to the current room AND ready state updates (for reconnects)
    if (readyState === ReadyState.OPEN) {
      sendMessage(`${roomId?.q};${roomId?.r}`);
    }
  }, [roomId, sendMessage, readyState]);

  useEffect(() => {
    if (readyState === ReadyState.CLOSED) {
      dispatch({
        type: "GAME.RESET",
      });
    }
  }, [readyState]);

  const connectionStatus = {
    [ReadyState.OPEN]: null,
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "60% auto",
      }}
    >
      <div>
        {roomId?.q != null ? (
          <>
            <h2>
              RoomId: {roomId.q} {roomId.r}
            </h2>
            <div>Tick: {time}</div>
            {connectionStatus ? (
              <div>Connection status: {connectionStatus}</div>
            ) : null}
            {roomLayout?.length && terrain?.length ? (
              <div>
                <Room
                  roomId={roomId}
                  roomLayout={roomLayout}
                  terrain={terrain}
                  entities={entities ?? {}}
                />
              </div>
            ) : null}
          </>
        ) : null}
      </div>
      <div>
        <h2>World map</h2>
        {rooms ? <WorldMap rooms={rooms} /> : null}
      </div>
      <div>
        <pre>{JSON.stringify(selectedEntity, null, 4)}</pre>
      </div>
    </div>
  );
}

export async function getStaticProps(context) {
  const {
    NEXT_CAO_API_URL: apiUrl,
    NEXT_CAO_STREAM_URL: streamUrl,
  } = process.env;

  return {
    props: {
      apiUrl,
      streamUrl,
    },
  };
}
