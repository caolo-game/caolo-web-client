import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import World from "../components/World";

export default function MapPage({ roomList, roomLayout, apiUrl, streamUrl }) {
  const router = useRouter();
  let { q, r } = router.query;
  let [roomId, setRoomId] = useState({ q, r });
  const [terrain, setTerrain] = useState([]);
  const [entities, setEntities] = useState({});
  const [time, setTime] = useState(null);
  const { sendMessage, readyState, lastJsonMessage } = useWebSocket(streamUrl);

  useEffect(() => {
    switch (lastJsonMessage?.ty) {
      case "entities":
        setEntities(lastJsonMessage.entities.payload);
        setTime(lastJsonMessage.entities.time);
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
  }, [lastJsonMessage, setEntities, setTerrain, setTime]);

  useEffect(() => {
    // subscribe to the current room
    sendMessage(`${roomId.q};${roomId.r}`);
  }, [roomId, sendMessage]);

  useEffect(() => {
    if (q == null || r == null) {
      setRoomId(roomList[0]);
      router.push(
        `${router.basePath}/map?q=${roomList[0].q}&r=${roomList[0].r}`,
        null,
        {
          shallow: true,
        }
      );
    }
  }, [q, r, setRoomId, roomList]);

  const connectionStatus = {
    [ReadyState.OPEN]: null,
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  return (
    <div>
      {connectionStatus ? (
        <div>Connection status: {connectionStatus}</div>
      ) : null}
      <div>Tick: {time}</div>
      <div>
        RoomId: {roomId.q} {roomId.r}
      </div>
      <div>
        <World
          roomId={roomId}
          roomLayout={roomLayout}
          terrain={terrain}
          entities={entities}
        />
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const apiUrl = process.env.NEXT_CAO_API_URL;
  const streamUrl = process.env.NEXT_CAO_STREAM_URL;

  const [roomList, roomLayout] = await Promise.all([
    fetch(`${apiUrl}/world/rooms`).then((x) => x.json()),
    fetch(`${apiUrl}/world/room-terrain-layout`).then((x) => x.json()),
  ]);

  return {
    props: {
      apiUrl,
      streamUrl,
      roomList,
      roomLayout,
    },
  };
}
