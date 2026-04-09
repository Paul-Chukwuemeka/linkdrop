export function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function getDomain(input: string) {
  try {
    const href = input.startsWith("http") ? input : "https://" + input;
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return input.trim(); // fall back to raw input if invalid URL
  }
}
