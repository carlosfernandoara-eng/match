/** Inteiro aleatório uniforme em [0, maxExclusive) usando crypto (sorteio justo). */
export function secureRandomInt(maxExclusive: number): number {
  if (maxExclusive <= 0) throw new Error("maxExclusive deve ser > 0");
  const range = 0x100000000; // 2^32
  const limit = Math.floor(range / maxExclusive) * maxExclusive;
  const arr = new Uint32Array(1);
  let x: number;
  do {
    crypto.getRandomValues(arr);
    x = arr[0];
  } while (x >= limit);
  return x % maxExclusive;
}

/** Relative luminance simplificada para decidir cor de texto sobre um hex. */
export function contrastTextColor(hex: string): "#0A0A0A" | "#FFFFFF" {
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16) / 255;
  const g = parseInt(c.substring(2, 4), 16) / 255;
  const b = parseInt(c.substring(4, 6), 16) / 255;
  const lin = (v: number) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  const luminance = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  return luminance > 0.42 ? "#0A0A0A" : "#FFFFFF";
}
