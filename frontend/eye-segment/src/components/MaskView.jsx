import Spinner from "./Spinner.jsx";

export default function MaskView({ loading, src, height }) {
  return (
    <div style={{ textAlign: "center" }}>
      <h3>Mask</h3>
      {loading && (
        <div style={{ width: "100%", maxWidth: 300, height, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "8px", boxShadow: "0 0 8px rgba(0,0,0,0.1)", background: "#f1f3f5" }}>
          <Spinner />
        </div>
      )}
      {!loading && src && (
        <>
          <img src={src} alt="mask" style={{ width: "100%", maxWidth: 300, borderRadius: "8px", boxShadow: "0 0 8px rgba(0,0,0,0.2)" }} />
          <div style={{ marginTop: "0.5rem" }}>
            <a href={src} download="mask.png" style={{ textDecoration: "none" }}>
              <button style={{ padding: "0.35rem 0.75rem", backgroundColor: "#198754", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>Download Mask</button>
            </a>
          </div>
        </>
      )}
      {!loading && !src && (
        <div style={{ width: "100%", maxWidth: 300, height, margin: "0 auto", borderRadius: "8px", boxShadow: "0 0 8px rgba(0,0,0,0.05)", background: "#f8f9fa" }} />
      )}
    </div>
  );
}


