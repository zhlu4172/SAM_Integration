import Spinner from "./Spinner.jsx";

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
        cursor: loading ? "not-allowed" : "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
        opacity: loading ? 0.7 : 1,
      }}
    >
      {loading ? (
        <>
          <Spinner size={16} color="white" borderWidth={2} />
          <span>Segmenting...</span>
        </>
      ) : (
        "Segment Image"
      )}
    </button>
  );
}


