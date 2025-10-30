export default function OriginalView({ src, height }) {
  return (
    <div style={{ textAlign: "center" }}>
      <h3>Original</h3>
      {src && (
        <img
          src={src}
          alt="original"
          style={{ width: "100%", maxWidth: 300, height, objectFit: "cover", borderRadius: "8px", boxShadow: "0 0 8px rgba(0,0,0,0.2)" }}
        />
      )}
    </div>
  );
}


