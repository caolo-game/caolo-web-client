import ForEachHex from "./ForEachHex";

const SQRT_3 = Math.sqrt(3);

export default function WorldMap({ rooms }) {
  const scale = 7;
  return (
    <>
      <div
        style={{
          width: "80vw",
          height: "80vh",
        }}
      >
        <svg viewBox={`0 0 1000 600`}>
          <ForEachHex
            orientation="flat"
            pos={rooms.map(({ q, r }) => [q, r])}
            data={rooms}
            scale={scale}
          >
            <RoomTile scaleOverride={6} />
          </ForEachHex>
        </svg>
      </div>
    </>
  );
}

function RoomTile({ pos, pixelPos, data: _data, scaleOverride: scale }) {
  const width = scale * 2;
  const height = scale * SQRT_3;

  const points = [
    [0, 0],
    [width / 4, height / 2],
    [(width * 3) / 4, height / 2],
    [width, 0],
    [(width * 3) / 4, -height / 2],
    [width / 4, -height / 2],
  ].map(([x, y]) => [x + pixelPos.x, y + pixelPos.y]);

  let path = `M ${points[0][0]} ${points[0][1]}`;
  for (let pos of points.slice(1)) {
    path = ` ${path} L ${pos[0]} ${pos[1]}`;
  }

  return (
    <path
      d={path}
      fill={"lightblue"}
      pos={pos}
      onClick={() => console.log("coggers", pos)}
    />
  );
}
