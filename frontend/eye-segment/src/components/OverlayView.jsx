export default function OverlayView({ loading, overlayVisible, setOverlayVisible, overlayUrl, fallbackOriginalUrl, height }) {
  return (
    <div style={{ textAlign: "center" }}>
      <h3>Overlay</h3>
      <div
        onClick={() => { if (!loading && overlayUrl) setOverlayVisible((v) => !v); }}
        role="button"
        aria-label="Toggle overlay visibility"
        title="Click to toggle overlay"
        style={{ cursor: !loading && overlayUrl ? "pointer" : "default" }}
      >
        {loading && (
          <div style={{ width: "100%", maxWidth: 300, height, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "8px", boxShadow: "0 0 8px rgba(0,0,0,0.1)", background: "#f1f3f5", color: "#495057", fontWeight: 600 }}>
            Loading...
          </div>
        )}
        {!loading && overlayUrl && overlayVisible && (
          <img src={overlayUrl} alt="overlay" style={{ width: "100%", maxWidth: 300, borderRadius: "8px", boxShadow: "0 0 8px rgba(0,0,0,0.2)" }} />
        )}
        {!loading && !overlayVisible && fallbackOriginalUrl && (
          <img src={fallbackOriginalUrl} alt="original" style={{ width: "100%", maxWidth: 300, borderRadius: "8px", boxShadow: "0 0 8px rgba(0,0,0,0.2)" }} />
        )}
        {!loading && overlayVisible && !overlayUrl && (
          <div style={{ width: "100%", maxWidth: 300, height, margin: "0 auto", borderRadius: "8px", boxShadow: "0 0 8px rgba(0,0,0,0.05)", background: "#f8f9fa" }} />
        )}
      </div>
    </div>
  );
}


