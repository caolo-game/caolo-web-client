import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import World from "../components/World";

export default function MapPage({ roomList, roomLayout, apiUrl }) {
  const router = useRouter();
  let { q, r } = router.query;
  let [roomId, setRoomId] = useState({ q, r });
  const [terrain, setTerrain] = useState([]);

  useEffect(() => {
    if (q == null || r == null) {
      setRoomId(roomList[0]);
      router.push(`${router.route}?q=${roomList[0].q}&r=${roomList[0].r}`, null, {
        shallow: true,
      });
    }
  }, [q, r, setRoomId, roomList]);

  useEffect(() => {
    const { q, r } = roomId;
    if (q != null && r != null)
      (async () => {
        const url = new URL(`${apiUrl}/world/terrain`);
        url.search = new URLSearchParams({
          q,
          r,
        });
        const terrain = await fetch(url).then((x) => x.json());
        setTerrain(terrain);
      })();
  }, [roomId, setTerrain]);

  return <World roomId={roomId} roomLayout={roomLayout} terrain={terrain} />;
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
