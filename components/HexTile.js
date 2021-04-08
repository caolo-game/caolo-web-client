const SQRT_3 = Math.sqrt(3);

export default function HexTile({ pos, pixelPos, data, scale }) {
  const color = TileToColor[data];

  const width = scale * SQRT_3;
  const height = scale * 2;

  const points = [
    [0, 0],
    [width / 2, height / 4],
    [width, 0],
    [width, -height / 2],
    [width / 2, (-height * 3) / 4],
    [0, -height / 2],
  ].map(([x, y]) => [x + pixelPos.x, y + pixelPos.y]);

  let path = `M ${points[0][0]} ${points[0][1]}`;
  for (let pos of points.slice(1)) {
    path = ` ${path} L ${pos[0]} ${pos[1]}`;
  }

  return <path d={path} fill={color} pos={pos} />;
}

const TileToColor = Object.freeze({
  EMPTY: "rgba(0,0,0,0)",
  WALL: "#ffddaa",
  PLAIN: "#d4ab6a",
  BRIDGE: "#d4db6a",
});
