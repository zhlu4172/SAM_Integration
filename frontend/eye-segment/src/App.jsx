import { useState } from "react";
import ImagePicker from "./components/ImagePicker.jsx";
import SegmentationControls from "./components/SegmentationControls.jsx";
import PreviewPanel from "./components/PreviewPanel.jsx";
import OriginalView from "./components/OriginalView.jsx";
import MaskView from "./components/MaskView.jsx";
import OverlayView from "./components/OverlayView.jsx";
import { useSegmentation } from "./hooks/useSegmentation.js";
import { useOverlay } from "./hooks/useOverlay.js";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [displayHeight, setDisplayHeight] = useState(300);
  const {
    runSegmentation,
    maskUrl: resultUrl,
    loading,
    error,
  } = useSegmentation();

  const overlayUrl = useOverlay({
    originalUrl: previewUrl,
    maskUrl: resultUrl,
    tint: "rgba(0,123,255,0.4)",
  });

  // when user selects a file
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
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

  const handleUpload = () => {
    if (!selectedFile) return alert("Please select an image first!");
    setOverlayVisible(true);
    runSegmentation(selectedFile);
  };

  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "24px",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
        padding: "3rem 2.5rem",
        maxWidth: "900px",
        width: "90%",
        margin: "3rem auto",
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2
        style={{
          marginBottom: "1.5rem",
          fontSize: "2rem",
          fontWeight: "700",
          background: "linear-gradient(90deg, #007bff, #00c6ff)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Image Segmentation Portal
      </h2>

      <div
        style={{
          marginBottom: "1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.75rem",
        }}
      >
        <ImagePicker onChange={handleFileChange} />
        <SegmentationControls onSegment={handleUpload} loading={loading} />
        <span
          style={{
            minWidth: 120,
            textAlign: "left",
            color: loading ? "#0d6efd" : error ? "#dc3545" : "#6c757d",
          }}
        >
          {loading ? "Segmenting..." : error ? error : ""}
        </span>
      </div>

      {(previewUrl || resultUrl || overlayUrl) && (
        <PreviewPanel>
          <OriginalView src={previewUrl} />
          <MaskView loading={loading} src={resultUrl} height={displayHeight} />
          <OverlayView
            loading={loading}
            overlayVisible={overlayVisible}
            setOverlayVisible={setOverlayVisible}
            overlayUrl={overlayUrl}
            fallbackOriginalUrl={previewUrl}
            height={displayHeight}
          />
        </PreviewPanel>
      )}
    </div>
  );
}

export default App;
