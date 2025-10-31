import { useState } from "react";
import ImagePicker from "./components/ImagePicker.jsx";
import SegmentationControls from "./components/SegmentationControls.jsx";
import PreviewPanel from "./components/PreviewPanel.jsx";
import OriginalView from "./components/OriginalView.jsx";
import MaskView from "./components/MaskView.jsx";
import OverlayView from "./components/OverlayView.jsx";
import { useSegmentation } from "./hooks/useSegmentation.js";
import { useOverlay } from "./hooks/useOverlay.js";
import { segmentImage } from "./services/apiClient.js";
import { generateOverlay } from "./utils/canvas.js";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null); 
  const [resultUrl, setResultUrl] = useState(null);   
  const [overlayVisible, setOverlayVisible] = useState(true); 
  const [displayHeight, setDisplayHeight] = useState(300); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const overlayUrl = useOverlay({
    originalUrl: previewUrl,
    maskUrl: resultUrl,
    tint: "rgba(0,123,255,0.4)"
  });

  // when user selects a file
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file)); // local preview
      // compute displayed height for width=300 to match placeholders
      const img = new Image();
      img.onload = () => {
        if (img.naturalWidth && img.naturalHeight) {
          const h = Math.round((img.naturalHeight / img.naturalWidth) * 300);
          setDisplayHeight(Number.isFinite(h) && h > 0 ? h : 300);
        }
      };
      img.src = URL.createObjectURL(file);
    }
  };

  // Build overlay: tint ONLY the masked (white) region; keep background untouched
  const generateOverlay = async (originalSrc, maskSrc, tint = "rgba(0,123,255,0.4)") => {
    const loadImage = (src) =>
      new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });

    const [originalImg, maskImg] = await Promise.all([
      loadImage(originalSrc),
      loadImage(maskSrc),
    ]);

    const width = originalImg.naturalWidth || originalImg.width;
    const height = originalImg.naturalHeight || originalImg.height;

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    // base: draw original image
    ctx.drawImage(originalImg, 0, 0, width, height);

    // read mask pixels
    const maskCanvas = document.createElement("canvas");
    maskCanvas.width = width;
    maskCanvas.height = height;
    const maskCtx = maskCanvas.getContext("2d");
    maskCtx.drawImage(maskImg, 0, 0, width, height);
    const maskData = maskCtx.getImageData(0, 0, width, height);

    // parse tint rgba( r, g, b, a )
    const m = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([0-9]*\.?[0-9]+))?\s*\)/.exec(tint);
    const tintR = m ? parseInt(m[1], 10) : 0;
    const tintG = m ? parseInt(m[2], 10) : 123;
    const tintB = m ? parseInt(m[3], 10) : 255;
    const tintA = m && m[4] !== undefined ? Math.max(0, Math.min(1, parseFloat(m[4]))) : 0.4;

    // create overlay image data using mask brightness as alpha
    const overlayData = ctx.createImageData(width, height);
    const src = maskData.data;
    const dst = overlayData.data;
    for (let i = 0; i < src.length; i += 4) {
      const r = src[i];
      const g = src[i + 1];
      const b = src[i + 2];
      // grayscale: white(255) means inside mask; black(0) outside
      const gray = (r + g + b) / 3;
      const a = Math.round((gray / 255) * (tintA * 255));
      if (a === 0) {
        // leave transparent
        dst[i + 3] = 0;
      } else {
        dst[i] = tintR;
        dst[i + 1] = tintG;
        dst[i + 2] = tintB;
        dst[i + 3] = a;
      }
    }

    // paint overlay on top using alpha compositing (don't overwrite the base)
    const overlayCanvas = document.createElement("canvas");
    overlayCanvas.width = width;
    overlayCanvas.height = height;
    const overlayCtx = overlayCanvas.getContext("2d");
    overlayCtx.putImageData(overlayData, 0, 0);
    ctx.drawImage(overlayCanvas, 0, 0);

    return canvas.toDataURL("image/png");
  };

  // upload image to backend
  const handleUpload = async () => {
    if (!selectedFile) return alert("Please select an image");
    setLoading(true);
    setError(null);
    // clear previous results and reset overlay visiblity
    setResultUrl(null);
    setOverlayVisible(true);
    try {
      const maskUrl = await segmentImage(selectedFile);
      setResultUrl(maskUrl);
    } catch (err) {
      console.error(err);
      setError("Segmentation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",     
        alignItems: "center",         
        height: "100vh",              
        flexDirection: "column",
        backgroundColor: "#f8f9fa",   
        fontFamily: "Arial, sans-serif",
        width: "100%",
        maxWidth: "800px",
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      <h2 style={{ marginBottom: "1rem" }}>Image Segmentation Portal</h2>
  
      <div style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <ImagePicker onChange={handleFileChange} />
        <SegmentationControls onSegment={handleUpload} loading={loading} />
        <span style={{ minWidth: 120, textAlign: "left", color: loading ? "#0d6efd" : error ? "#dc3545" : "#6c757d" }}>
          {loading ? "Segmenting..." : error ? error : ""}
        </span>
      </div>
  
      {(previewUrl || resultUrl || overlayUrl) && (
        <PreviewPanel>
          <OriginalView src={previewUrl} />
          <MaskView loading={loading} src={resultUrl} height={displayHeight} />
          <OverlayView loading={loading} overlayVisible={overlayVisible} setOverlayVisible={setOverlayVisible} overlayUrl={overlayUrl} fallbackOriginalUrl={previewUrl} height={displayHeight} />
        </PreviewPanel>
      )}
    </div>
  );
  
  
}

export default App;
