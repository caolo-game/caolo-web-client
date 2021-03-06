import { useDispatch, useSelector } from "react-redux";
import ForEachHex from "./ForEachHex";

const SQRT_3 = Math.sqrt(3);
const SCALE = 10;

export default function WorldMap({ rooms }) {
  // TODO: dynamic bounds
  return (
    <>
      <div
        style={{
          width: "80vw",
          height: "80vh",
        }}
      >
        <svg viewBox={`0 50 1000 800`}>
          <ForEachHex
            orientation="flat"
            pos={rooms.map(({ q, r }) => [q, r])}
            data={rooms}
            scale={SCALE}
          >
            <RoomTile />
          </ForEachHex>
        </svg>
      </div>
    </>
  );
}

function RoomTile({ pos, pixelPos, data: _data }) {
  const scale = SCALE - 2;
  const width = scale * 2;
  const height = scale * SQRT_3;

  const dispatch = useDispatch();

  const vertices = [
    [width / 4, height / 2],
    [(width * 3) / 4, height / 2],
    [width, 0],
    [(width * 3) / 4, -height / 2],
    [width / 4, -height / 2],
  ].map(([x, y]) => [x + pixelPos.x, y + pixelPos.y]);

  let path = `M ${pixelPos.x} ${pixelPos.y}`;
  for (let pos of vertices) {
    path = ` ${path} L ${pos[0]} ${pos[1]}`;
  }

  const isSelected = useSelector((state) => {
    const roomId = state?.game?.roomId;
    return roomId && pos[0] == roomId.q && pos[1] == roomId.r;
  });

  const color = isSelected ? "red" : "lightblue";

  return (
    <path
      d={path}
      fill={color}
      pos={pos}
      style={{
        cursor: "pointer",
      }}
      onClick={() =>
        dispatch({ type: "GAME.SELECT_ROOM", roomId: { q: pos[0], r: pos[1] } })
      }
    />
  );
}
