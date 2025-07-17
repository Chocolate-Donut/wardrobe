export function hexToRgb(hex: string): [number, number, number] {
  const cleaned = hex.replace('#', '');
  const bigint = parseInt(cleaned, 16);
  return [
    (bigint >> 16) & 255,
    (bigint >> 8) & 255,
    bigint & 255
  ];
}

export function colorDistance(rgb1: [number, number, number], rgb2: [number, number, number]): number {
  const [r1, g1, b1] = rgb1;
  const [r2, g2, b2] = rgb2;
  return Math.sqrt(
    Math.pow(r1 - r2, 2) +
    Math.pow(g1 - g2, 2) +
    Math.pow(b1 - b2, 2)
  );
}
