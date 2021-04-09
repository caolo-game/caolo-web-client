import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import WorldMap from "../components/WorldMap";
import { initializeStore } from "../store";

export default function WorldMapPage() {
  const rooms = useSelector((state) => state?.game?.rooms);
  const roomId = useSelector((state) => state?.game?.roomId);
  const router = useRouter();
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

export async function getServerSideProps(_context) {
  const { NEXT_CAO_API_URL: apiUrl } = process.env;
  const rooms = await fetch(`${apiUrl}/world/rooms`).then((x) => x.json());

  const reduxStore = initializeStore();
  const { dispatch } = reduxStore;
  dispatch({
    type: "GAME.SET_ROOMS",
    rooms,
  });
  dispatch({
    type: "GAME.SELECT_ROOM",
    roomId: null,
  });

  return {
    props: {
      apiUrl,
      initialReduxState: reduxStore.getState(),
    },
  };
}
