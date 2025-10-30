export default function SegmentationControls({ onSegment, loading }) {
  return (
    <button
      onClick={onSegment}
      disabled={loading}
      style={{
        padding: "0.5rem 1rem",
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
      }}
    >
      {loading ? "Segmenting..." : "Segment Image"}
    </button>
  );
}


