export default function PreviewPanel({ children }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "1rem",
        width: "100%",
        marginTop: "1rem",
      }}
    >
      {children}
    </div>
  );
}


