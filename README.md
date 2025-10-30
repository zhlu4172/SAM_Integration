# Eye Segment - Frontend

A modular React (Vite) UI for image segmentation: upload an image, call a backend `/segment`, and show Original/Mask/Overlay.

## Preview

![Showcase](images/showcase.png)

## Quick start

1) Install
```bash
cd frontend/eye-segment
npm install
```
2) Configure backend URL in `.env.local`
```
VITE_BACKEND_URL=http://127.0.0.1:5000
# or your ngrok URL
# VITE_BACKEND_URL=https://<your-ngrok>.ngrok-free.dev
```
3) Run
```bash
npm run dev
```

## Structure
```
src/
  App.jsx
  index.css
  components/
    ImagePicker.jsx
    SegmentationControls.jsx
    PreviewPanel.jsx
    OriginalView.jsx
    MaskView.jsx
    OverlayView.jsx
  hooks/
    useSegmentation.js
    useOverlay.js
  services/
    apiClient.js
  utils/
    canvas.js
```

## Flow
- ImagePicker -> emits File
- apiClient.segmentImage(File) -> POST ${VITE_BACKEND_URL}/segment -> [{mask: base64}]
- MaskView shows mask, can download
- Overlay via utils/canvas.generateOverlay(original, mask) and toggled in OverlayView

## Troubleshooting
- env not picked up: ensure file at `frontend/eye-segment/.env.local` and restart `npm run dev`
- connection refused: check `${VITE_BACKEND_URL}/health`

## Scripts
- `npm run dev`, `npm run build`, `npm run preview`
