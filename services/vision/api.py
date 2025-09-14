
from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
import numpy as np, cv2, base64, requests
from .ocr_saliency import ocr_text, simple_saliency
from .yolo_detect import detect_logo_cta

app = FastAPI(title="Vision Service")

class AnalyzeIn(BaseModel):
    url: str
    platform: str = "IG"

@app.post("/analyze")
def analyze(inp: AnalyzeIn):
    r = requests.get(inp.url)
    r.raise_for_status()
    data = np.frombuffer(r.content, np.uint8)
    img = cv2.imdecode(data, cv2.IMREAD_COLOR)
    text = ocr_text(img)
    sal = simple_saliency(img)
    logos, cta = detect_logo_cta(img)
    # Simple rubric scoring
    score = 80
    if len(text) > 250: score -= 10
    if cta is None: score -= 15
    # encode saliency as PNG base64
    _, buf = cv2.imencode('.png', sal)
    b64 = base64.b64encode(buf).decode('utf-8')
    return {
        "score_overall": max(0, score),
        "ocr_text": text,
        "cta": cta,
        "logos": logos,
        "saliency_png_base64": "data:image/png;base64," + b64
    }

class VideoIn(BaseModel):
    url: str
    max_frames: int = 12

@app.post("/video/analyze")
def video_analyze(inp: VideoIn):
    r = requests.get(inp.url, stream=True)
    r.raise_for_status()
    arr = np.asarray(bytearray(r.content), dtype=np.uint8)
    vid = cv2.imdecode(arr, cv2.IMREAD_COLOR) # placeholder; in practice, use cv2.VideoCapture with file path
    # Placeholder: real impl should save to tmp and sample frames
    return {"frames_analyzed": 0, "notes": "Replace with cv2.VideoCapture sampling"}
