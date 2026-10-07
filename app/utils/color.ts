export function mixHex(a: string, b: string, weight: number) {
  const channel = (hex: string, i: number) =>
    parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16);
  return `#${[0, 1, 2]
    .map((i) =>
      Math.round(channel(a, i) * weight + channel(b, i) * (1 - weight))
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;
}
