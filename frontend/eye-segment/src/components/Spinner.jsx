import { useEffect } from "react";

export default function Spinner({ size = 40, color = "#007bff", borderWidth = 4 }) {
  useEffect(() => {
    if (!document.querySelector('style[data-spinner]')) {
      const style = document.createElement("style");
      style.setAttribute('data-spinner', 'true');
      style.textContent = `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  const borderColor = color === "#ffffff" || color === "white" ? "rgba(255,255,255,0.3)" : "#f3f3f3";

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        border: `${borderWidth}px solid ${borderColor}`,
        borderTop: `${borderWidth}px solid ${color}`,
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
        flexShrink: 0,
      }}
    />
  );
}

