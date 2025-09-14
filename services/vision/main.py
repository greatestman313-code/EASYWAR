from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from PIL import Image
import io
import numpy as np

from ocr import run_ocr
from saliency import dummy_saliency
from yolo import detect_objects

app = FastAPI(title="VISION SERVICE")

@app.post("/ocr")
async def ocr_endpoint(file: UploadFile = File(...)):
    img = Image.open(io.BytesIO(await file.read())).convert('RGB')
    text = run_ocr(img)
    return {"text": text}

@app.post("/saliency")
async def saliency_endpoint(file: UploadFile = File(...)):
    img = Image.open(io.BytesIO(await file.read())).convert('RGB')
    heat = dummy_saliency(img)
    # return simplified heatmap as list
    return {"heatmap": heat.tolist()}

@app.post("/analyze")
async def analyze_endpoint(file: UploadFile = File(...)):
    img = Image.open(io.BytesIO(await file.read())).convert('RGB')
    dets = detect_objects(img)
    text = run_ocr(img)
    return {"detections": dets, "ocr": text}
