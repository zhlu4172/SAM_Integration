from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline
from PIL import Image
import io
import numpy as np
import base64
import torch
import os


torch.set_default_dtype(torch.float32)
device = "mps" if torch.backends.mps.is_available() else "cpu"
print(f"Using device: {device}")

app = Flask(__name__)
CORS(app)

generator = pipeline("mask-generation", model="facebook/sam-vit-base", device=0)
generator.model = generator.model.to(torch.float32).to("mps")  

@app.route("/segment", methods=["POST"])
def segment_image():
    file = request.files["image"]
    image_bytes = file.read()
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

    # SAM segmentation
    outputs = generator(image, points_per_batch=256)
    masks = outputs[0]["masks"] if "masks" in outputs[0] else outputs["masks"]

    # convert each mask to base64 PNG (frontend can display directly)
    results = []
    for mask in masks:
        # mask is numpy array, 0/1 values
        mask_img = (np.array(mask) * 255).astype(np.uint8)
        pil_mask = Image.fromarray(mask_img)
        buf = io.BytesIO()
        pil_mask.save(buf, format="PNG")
        mask_b64 = base64.b64encode(buf.getvalue()).decode("utf-8")
        results.append({"mask": mask_b64})

    return jsonify(results)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
