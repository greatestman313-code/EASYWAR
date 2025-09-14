import os
import onnxruntime as ort
import numpy as np
from PIL import Image

MODEL_PATH = os.environ.get('YOLO_ONNX_PATH', 'models/yolov8n.onnx')

_session = None
def _get_session():
    global _session
    if _session is None:
        _session = ort.InferenceSession(MODEL_PATH, providers=['CPUExecutionProvider'])
    return _session

def preprocess(img: Image.Image, size=640):
    img = img.convert('RGB').resize((size,size))
    arr = np.array(img).astype(np.float32)
    arr = arr.transpose(2,0,1) / 255.0
    arr = np.expand_dims(arr, 0)
    return arr

def postprocess(outputs, img_size=640, conf_thres=0.25):
    # minimal placeholder; real mapping of YOLO output omitted
    # Return empty list but with structure
    return []

def detect_objects(img: Image.Image):
    try:
        sess = _get_session()
    except Exception as e:
        # weights missing or session error
        return []
    x = preprocess(img)
    outs = sess.run(None, {sess.get_inputs()[0].name: x})
    dets = postprocess(outs)
    return dets
