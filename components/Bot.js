const SQRT_3 = Math.sqrt(3);

export default function Bot({ pos: pos, pixelPos, data, scale }) {
  const width = scale * SQRT_3;
  const height = scale * 2;
  const hexRadius = scale * SQRT_3 + 0.55;
  return (
    <circle
      cx={pixelPos.x + width / 2}
      cy={pixelPos.y - height / 4}
      r={hexRadius / 3}
      fill="red"
      pos={pos}
    />
  );
}
