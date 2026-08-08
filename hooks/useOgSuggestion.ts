"use client";

import { useEffect, useRef, useState } from "react";
import { apiFetch } from "@/lib/api";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { isValidUrl } from "@/utils/validate";

export type OgSuggestion = {
  title: string | null;
  domain: string;
};

/**
 * Debounced OpenGraph title lookup for a URL input. Quietly swallows errors so
 * a missing/blocked title never disrupts the form. A `refreshKey` bump forces
 * a re-fetch (e.g. when the user clicks the suggestion chip for the same URL).
 */
export function useOgSuggestion(
  url: string,
  refreshKey: number
): {
  suggestion: OgSuggestion | null;
  isDetecting: boolean;
} {
  const debouncedUrl = useDebouncedValue(url.trim(), 600);
  const [suggestion, setSuggestion] = useState<OgSuggestion | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const requestToken = useRef(0);

  useEffect(() => {
    const token = ++requestToken.current;
    const controller = new AbortController();
    const valid = isValidUrl(debouncedUrl);

    async function run() {
      if (!valid) {
        setSuggestion(null);
        setIsDetecting(false);
        return;
      }

      setIsDetecting(true);
      try {
        const data = await apiFetch<OgSuggestion>("/api/og/fetch", {
          method: "POST",
          json: { url: debouncedUrl },
          signal: controller.signal,
        });
        if (token !== requestToken.current) return;
        setSuggestion(data);
      } catch {
        if (token !== requestToken.current) return;
        setSuggestion(null);
      } finally {
        if (token === requestToken.current) setIsDetecting(false);
      }
    }

    void run();
    return () => controller.abort();
  }, [debouncedUrl, refreshKey]);

  return { suggestion, isDetecting };
}