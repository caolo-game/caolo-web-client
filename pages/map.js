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

  const selectedEntity = useSelector((state) => state?.game?.selectedEntity);

  const dispatch = useDispatch();

  useEffect(() => {
    let { q, r } = router.query;
    if (q != roomId.q || r != roomId.r) {
      console.info("Updating page query params to ", { q, r });
      dispatch({ type: "GAME.SELECT_ROON", roomId: { q, r } });
      router.push(`/map?q=${roomId?.q}&r=${roomId?.r}`, undefined, {
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
      {roomId?.q != null ? (
        <div>
          <h2>
            RoomId: {roomId.q} {roomId.r}
          </h2>
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
      <div>
        <pre>{JSON.stringify(selectedEntity, null, 4)}</pre>
      </div>
      <div>
        <h2>World map</h2>
        {rooms ? <WorldMap rooms={rooms} /> : null}
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const {
    NEXT_CAO_API_URL: apiUrl,
    NEXT_CAO_STREAM_URL: streamUrl,
  } = process.env;

  const { q, r } = context.query;
  if (q == null || r == null) {
    return {
      notFound: true,
    };
  }

  const reduxStore = initializeStore();
  const { dispatch } = reduxStore;

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
    fetch(`${apiUrl}/world/terrain?q=${q}&r=${r}`)
      .then((x) => x.json())
      .then((terrain) =>
        dispatch({
          type: "GAME.SET_TERRAIN",
          terrain,
        })
      ),
    fetch(`${apiUrl}/world/room-objects?q=${q}&r=${r}`)
      .then((x) => x.json())
      .then((response) => {
        const { payload: entities, time } = response;
        dispatch({
          type: "GAME.SET_ENTITIES",
          entities,
        });
        dispatch({
          type: "GAME.SET_TIME",
          time,
        });
      }),
  ]);

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
