export default function ImagePicker({ onChange }) {
  return (
    <label
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "0.5rem 1rem",
        backgroundColor: "#f8f9fa",
        border: "2px dashed #dee2e6",
        borderRadius: "8px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        fontFamily: "Arial, sans-serif",
        fontSize: "0.9rem",
        color: "#495057",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "#e9ecef";
        e.currentTarget.style.borderColor = "#007bff";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "#f8f9fa";
        e.currentTarget.style.borderColor = "#dee2e6";
      }}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ marginRight: "0.5rem" }}
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="17 8 12 3 7 8"></polyline>
        <line x1="12" y1="3" x2="12" y2="15"></line>
      </svg>
      Choose Image
      <input
        type="file"
        accept="image/*"
        onChange={onChange}
        style={{ display: "none" }}
      />
    </label>
  );
}


