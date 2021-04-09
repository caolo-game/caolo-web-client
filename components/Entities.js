const SQRT_3 = Math.sqrt(3);

export function Bot({ pos: pos, pixelPos, data, scale }) {
  const width = scale * SQRT_3;
  const height = scale * 2;
  const hexRadius = scale * SQRT_3 + 0.55;
  const { x, y } = pixelPos;

  if (!x || !y) return null;

  return (
    <circle
      cx={x + width / 2}
      cy={y - height / 4}
      r={hexRadius / 3}
      fill="red"
      pos={pos}
    />
  );
}

export function Resource({ pos: pos, pixelPos, data, scale }) {
  const width = scale * SQRT_3;
  const height = scale * 2;
  const hexRadius = scale * SQRT_3 + 0.55;
  const { x, y } = pixelPos;

  if (!x || !y) return null;
  return (
    <circle
      cx={x + width / 2}
      cy={y - height / 4}
      r={hexRadius / 3 - 2}
      fill="yellow"
      pos={pos}
    />
  );
}

export function Structure({ pos: pos, pixelPos, data, scale }) {
  const width = scale * SQRT_3;
  const height = scale * 2;
  const hexRadius = scale * SQRT_3 + 0.55;
  const { x, y } = pixelPos;

  if (!x || !y) return null;
  return (
    <circle
      cx={x + width / 2}
      cy={y - height / 4}
      r={hexRadius / 3 + 2}
      fill="lightblue"
      pos={pos}
    />
  );
}
