import { useEffect, useState } from "react";
import { generateOverlay } from "../utils/canvas";

export function useOverlay({ originalUrl, maskUrl, tint = "rgba(0,123,255,0.4)" }) {
  const [overlayUrl, setOverlayUrl] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function build() {
      if (!originalUrl || !maskUrl) {
        setOverlayUrl(null);
        return;
      }
      try {
        const url = await generateOverlay(originalUrl, maskUrl, tint);
        if (!cancelled) setOverlayUrl(url);
      } catch (e) {
        if (!cancelled) setOverlayUrl(null);
      }
    }
    build();
    return () => {
      cancelled = true;
    };
  }, [originalUrl, maskUrl, tint]);

  return overlayUrl;
}


