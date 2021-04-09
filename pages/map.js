import { useRouter } from "next/router";
import { useEffect } from "react";
import { initializeStore } from "../store";
import { useSelector, useDispatch } from "react-redux";
import useWebSocket, { ReadyState } from "react-use-websocket";
import Room from "../components/Room";
import WorldMap from "../components/WorldMap";

export default function MapPage({ streamUrl }) {
  const { sendMessage, readyState, lastJsonMessage } = useWebSocket(streamUrl);
  const router = useRouter();

  const time = useSelector((state) => state?.game?.time);
  const entities = useSelector((state) => state?.game?.entities);
  const rooms = useSelector((state) => state?.game?.rooms);
  const roomLayout = useSelector((state) => state?.game?.roomLayout);
  const terrain = useSelector((state) => state?.game?.terrain);
  const roomId = useSelector((state) => state?.game?.roomId);

  const dispatch = useDispatch();

  useEffect(() => {
    const { q, r } = router.query;
    if (parseInt(q) !== roomId.q || parseInt(r) !== roomId.r)
      router.push(`/map?q=${roomId?.q}&r=${roomId?.r}`, undefined, {
        shallow: true,
        scroll: false,
      });
  }, [router, roomId]);

  useEffect(() => {
    switch (lastJsonMessage?.ty) {
      case "entities":
        const { payload: entities, time } = lastJsonMessage.entities;
        dispatch({
          type: "GAME.SET_ENTITIES",
          entities,
        });
        dispatch({
          type: "GAME.SET_TIME",
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
    // subscribe to the current room
    sendMessage(`${roomId?.q};${roomId?.r}`);
  }, [roomId, sendMessage]);

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
      {roomId?.q != null ? (
        <div>
          <h1>
            RoomId: {roomId.q} {roomId.r}
          </h1>
          <div>
            {connectionStatus ? (
              <div>Connection status: {connectionStatus}</div>
            ) : null}
            <div>Tick: {time}</div>
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
          </div>
        </div>
      ) : null}
      <div>{rooms ? <WorldMap rooms={rooms} /> : null}</div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const apiUrl = process.env.NEXT_CAO_API_URL;
  const streamUrl = process.env.NEXT_CAO_STREAM_URL;

  const { q, r } = context.query;
  if (q == null || r == null) {
    return {
      notFound: true,
    };
  }

  const [rooms, roomLayout] = await Promise.all([
    fetch(`${apiUrl}/world/rooms`).then((x) => x.json()),
    fetch(`${apiUrl}/world/room-terrain-layout`).then((x) => x.json()),
  ]);

  const reduxStore = initializeStore();
  const { dispatch } = reduxStore;
  dispatch({
    type: "GAME.SET_ROOMS",
    rooms,
  });
  dispatch({
    type: "GAME.SET_ROOM_LAYOUT",
    roomLayout,
  });
  dispatch({
    type: "GAME.SELECT_ROOM",
    roomId: { q, r },
  });

  return {
    props: {
      apiUrl,
      streamUrl,
      initialReduxState: reduxStore.getState(),
    },
  };
}
