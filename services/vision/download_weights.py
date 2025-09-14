
import requests, os
URL = "https://github.com/ultralytics/assets/releases/download/v0.0.0/yolov8n.onnx"
os.makedirs("services/vision/weights", exist_ok=True)
out = "services/vision/weights/yolov8n.onnx"
print("Downloading YOLOv8n ONNX...")
r = requests.get(URL, stream=True)
r.raise_for_status()
with open(out, "wb") as f:
    for chunk in r.iter_content(1<<20):
        if chunk: f.write(chunk)
print("Saved", out)
