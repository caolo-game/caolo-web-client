import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import Room from "../components/Room";
import WorldMap from "../components/WorldMap";

export default function MapPage({ apiUrl, streamUrl, rooms, roomLayout }) {
  const router = useRouter();
  const [terrain, setTerrain] = useState([]);
  const [{ entities, time }, setEntities] = useState({});
  const { sendMessage, readyState, lastJsonMessage } = useWebSocket(streamUrl);

  const roomId = {
    q: router.query.q,
    r: router.query.r,
  };

  useEffect(() => {
    switch (lastJsonMessage?.ty) {
      case "entities":
        setEntities({
          entities: lastJsonMessage.entities.payload,
          time: lastJsonMessage.entities.time,
        });
        break;
      case "terrain":
        setTerrain(lastJsonMessage.terrain);
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
  }, [lastJsonMessage, setEntities, setTerrain]);

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
    <>
      {roomId?.q ? (
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
    </>
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

  return {
    props: {
      apiUrl,
      streamUrl,
      rooms,
      roomLayout,
    },
  };
}
