import { fetchWithTimeout } from "@/lib/http";

const FETCH_TIMEOUT = 6000; // 6s
const MAX_BODY_BYTES = 512 * 1024; // 512 KB
const MAX_TITLE_LENGTH = 120;

const PRIVATE_IP_RE =
  /^(localhost|127\.\d+\.\d+\.\d+|10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+|169\.254\.\d+\.\d+|0\.0\.0\.0|::1|::ffff:127\.\d+\.\d+\.\d+)/;

function isBlockedHost(hostname: string): boolean {
  return PRIVATE_IP_RE.test(hostname.trim().toLowerCase());
}

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function extractTitle(html: string): string | null {
  const ogTag =
    html.match(
      /<meta[^>]+(?:property|name)=["']og:title["'][^>]*content=["']([^"']*)["'][^>]*>/i
    ) ||
    html.match(
      /<meta[^>]+content=["']([^"']*)["'][^>]*(?:property|name)=["']og:title["'][^>]*>/i
    );

  if (ogTag && typeof ogTag[1] === "string") {
    const ogTitle = decodeHtmlEntities(ogTag[1]).trim();
    if (ogTitle) return ogTitle;
  }

  const titleTag = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (!titleTag) return null;

  const title = decodeHtmlEntities(titleTag[1])
    .replace(/[\r\n\t]+/g, " ")
    .replace(/ {2,}/g, " ")
    .trim();
  return title || null;
}

export type OgMetadata = {
  title: string | null;
  domain: string;
};

/**
 * Fetch the OpenGraph title for a URL. Server-side only.
 *
 * SSRF guard: fetch follows redirects by default, so the final URL returned by
 * fetchWithTimeout is re-validated before the body is read (mirrors
 * lib/rehost.ts). The response body is capped to prevent unbounded downloads.
 */
export async function fetchOgMetadata(url: string): Promise<OgMetadata> {
  let initialHost: string;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      throw new Error("Only http/https URLs are allowed");
    }
    initialHost = parsed.hostname;
  } catch {
    throw new Error("Invalid URL");
  }

  if (isBlockedHost(initialHost)) {
    throw new Error("Host not allowed");
  }

  let response: Response;
  try {
    response = await fetchWithTimeout(
      url,
      { headers: { "User-Agent": "LinkDrop/1.0" } },
      FETCH_TIMEOUT
    );
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Fetch timed out");
    }
    throw error;
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch page (HTTP ${response.status})`);
  }

  const finalHost = new URL(response.url).hostname;
  if (isBlockedHost(finalHost)) {
    throw new Error("Host not allowed");
  }

  const html = await readChunkedText(response);

  const rawTitle = extractTitle(html);
  return {
    title: rawTitle ? rawTitle.slice(0, MAX_TITLE_LENGTH) : null,
    domain: initialHost.replace(/^www\./, ""),
  };
}

async function readChunkedText(response: Response): Promise<string> {
  const reader = response.body?.getReader();
  if (!reader) return "";

  const decoder = new TextDecoder("utf-8", { fatal: false });
  let html = "";
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      html += decoder.decode(value, { stream: true });
      if (html.length > MAX_BODY_BYTES) break;
    }
    html += decoder.decode();
  } finally {
    reader.releaseLock();
  }
  return html;
}