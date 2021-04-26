const SQRT_3 = Math.sqrt(3);

export default function HexTile({ pos, pixelPos, data, scale }) {
  const color = TileToColor[data];

  const width = scale * SQRT_3;
  const height = scale * 2;

  const vertices = [
    [width / 2, height / 4],
    [width, 0],
    [width, -height / 2],
    [width / 2, (-height * 3) / 4],
    [0, -height / 2],
  ].map(([x, y]) => [x + pixelPos.x, y + pixelPos.y]);

  let path = `M ${pixelPos.x} ${pixelPos.y}`;
  for (let pos of vertices) {
    path = ` ${path} L ${pos[0]} ${pos[1]}`;
  }

  return <path d={path} fill={color} pos={pos} />;
}

const TileToColor = Object.freeze({
  // empty
  0: "rgba(0,0,0,0)",
  // plain
  1: "#d4ab6a",
  // wall
  2: "#ffddaa",
  // bridge
  3: "#d4db6a",
});
