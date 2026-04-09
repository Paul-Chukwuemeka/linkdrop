function getLuminance(hex: string) {
  const r = parseInt(hex.slice(0, 2), 16) / 255 ;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function isLight(hex: string) {
  return getLuminance(hex) > 0.5;
}


export function lighten(hex: string, amount = 0.4) {
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  const newR = Math.round(r + (255 - r) * amount);
  const newG = Math.round(g + (255 - g) * amount);
  const newB = Math.round(b + (255 - b) * amount);

  return [newR, newG, newB]
    .map((v) => v.toString(16).padStart(2, "0"))
    .join("");
}

export function darken(hex: string, amount = 0.4) {
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  const newR = Math.round(r * (1 - amount));
  const newG = Math.round(g * (1 - amount));
  const newB = Math.round(b * (1 - amount));

  return [newR, newG, newB]
    .map((v) => v.toString(16).padStart(2, "0"))
    .join("");
}