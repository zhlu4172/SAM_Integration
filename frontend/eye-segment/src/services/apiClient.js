export const getBackendBaseUrl = () => {
  return import.meta.env.VITE_BACKEND_URL;
};
console.log('Backend URL =', import.meta.env.VITE_BACKEND_URL)

export async function segmentImage(file) {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`${getBackendBaseUrl()}/segment`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Segmentation failed: ${res.status} ${text}`);
  }
  const data = await res.json();
  // normalize base64 mask
  const maskBase64 = data?.[0]?.mask || data?.[0]?.masks?.[0]?.mask;
  if (!maskBase64) throw new Error("No mask returned from backend");
  return `data:image/png;base64,${maskBase64}`;
}


