import { useEffect, useState } from "react";
import WorldMap from "../components/WorldMap";

export default function WorldMapPage({ apiUrl, rooms }) {
  return (
    <div>
      <h1>World Map</h1>
      {rooms?.length ? <WorldMap rooms={rooms} /> : <span>Loading...</span>}
    </div>
  );
}

export async function getServerSideProps(_context) {
  const apiUrl = process.env.NEXT_CAO_API_URL;
  const rooms = await fetch(`${apiUrl}/world/rooms`).then((x) => x.json());

  return {
    props: {
      apiUrl,
      rooms,
    },
  };
}
