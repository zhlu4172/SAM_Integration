import { useState, useCallback } from "react";
import { segmentImage } from "../services/apiClient";

export function useSegmentation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const run = useCallback(async (file) => {
    setLoading(true);
    setError(null);
    try {
      const maskUrl = await segmentImage(file);
      return maskUrl;
    } catch (e) {
      setError(e.message || String(e));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, run };
}


