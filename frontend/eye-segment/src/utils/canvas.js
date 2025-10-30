export async function generateOverlay(originalSrc, maskSrc, tint = "rgba(0,123,255,0.4)") {
  const loadImage = (src) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });

  const [originalImg, maskImg] = await Promise.all([
    loadImage(originalSrc),
    loadImage(maskSrc),
  ]);

  const width = originalImg.naturalWidth || originalImg.width;
  const height = originalImg.naturalHeight || originalImg.height;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  // draw base
  ctx.drawImage(originalImg, 0, 0, width, height);

  // read mask
  const maskCanvas = document.createElement("canvas");
  maskCanvas.width = width;
  maskCanvas.height = height;
  const maskCtx = maskCanvas.getContext("2d");
  maskCtx.drawImage(maskImg, 0, 0, width, height);
  const maskData = maskCtx.getImageData(0, 0, width, height);

  const m = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([0-9]*\.?[0-9]+))?\s*\)/.exec(tint);
  const tintR = m ? parseInt(m[1], 10) : 0;
  const tintG = m ? parseInt(m[2], 10) : 123;
  const tintB = m ? parseInt(m[3], 10) : 255;
  const tintA = m && m[4] !== undefined ? Math.max(0, Math.min(1, parseFloat(m[4]))) : 0.4;

  const overlayData = ctx.createImageData(width, height);
  const src = maskData.data;
  const dst = overlayData.data;
  for (let i = 0; i < src.length; i += 4) {
    const r = src[i];
    const g = src[i + 1];
    const b = src[i + 2];
    const gray = (r + g + b) / 3;
    const a = Math.round((gray / 255) * (tintA * 255));
    if (a === 0) {
      dst[i + 3] = 0;
    } else {
      dst[i] = tintR;
      dst[i + 1] = tintG;
      dst[i + 2] = tintB;
      dst[i + 3] = a;
    }
  }

  const overlayCanvas = document.createElement("canvas");
  overlayCanvas.width = width;
  overlayCanvas.height = height;
  const overlayCtx = overlayCanvas.getContext("2d");
  overlayCtx.putImageData(overlayData, 0, 0);
  ctx.drawImage(overlayCanvas, 0, 0);

  return canvas.toDataURL("image/png");
}


