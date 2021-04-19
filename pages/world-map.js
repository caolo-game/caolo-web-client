import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import WorldMap from "../components/WorldMap";

export default function WorldMapPage({ apiUrl }) {
  const rooms = useSelector((state) => state?.game?.rooms);
  const roomId = useSelector((state) => state?.game?.roomId);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const rooms = await fetch(`${apiUrl}/world/rooms`).then((x) => x.json());
      dispatch({
        type: "GAME.SET_ROOMS",
        rooms,
      });
    })();
  });

  useEffect(() => {
    if (roomId?.q != null) {
      router.push(`/map?q=${roomId.q}&r=${roomId.r}`);
    }
  }, [roomId, router]);
  return (
    <div>
      <h1>World Map</h1>
      {rooms?.length ? <WorldMap rooms={rooms} /> : <span>Loading...</span>}
    </div>
  );
}

export async function getStaticProps(_context) {
  const { NEXT_CAO_API_URL: apiUrl } = process.env;

  return {
    props: {
      apiUrl,
    },
  };
}
