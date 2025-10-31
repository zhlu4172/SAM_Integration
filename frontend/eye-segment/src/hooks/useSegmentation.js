import { useState, useCallback } from "react";
import { segmentImage } from "../services/apiClient";

export function useSegmentation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [maskUrl, setMaskUrl] = useState(null); 

  const runSegmentation = useCallback(async (file) => {
    setLoading(true);
    setError(null);
    setMaskUrl(null); 

    try {
      const result = await segmentImage(file);
      setMaskUrl(result);
    } catch (e) {
      console.error(e);
      setError(e.message || "Segmentation failed.");
    } finally {
      setLoading(false);
    }
  }, []);

  return { runSegmentation, maskUrl, loading, error };
}
