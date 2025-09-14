
import onnxruntime as ort
import numpy as np
import cv2, os

CLASS_NAMES = ["person","bicycle","car","motorbike","aeroplane","bus","train","truck","boat","traffic light"]  # truncated

class YOLOv8ONNX:
    def __init__(self, path: str):
        if not os.path.exists(path):
            raise FileNotFoundError(f"ONNX model not found: {path}")
        providers = ['CPUExecutionProvider']
        self.session = ort.InferenceSession(path, providers=providers)
        self.inp_name = self.session.get_inputs()[0].name
        self.out_name = self.session.get_outputs()[0].name
        self.img_size = 640

    def preprocess(self, img):
        h, w = img.shape[:2]
        scale = self.img_size / max(h, w)
        nh, nw = int(h*scale), int(w*scale)
        resized = cv2.resize(img, (nw, nh))
        pad = np.full((self.img_size, self.img_size, 3), 114, dtype=np.uint8)
        pad[:nh, :nw] = resized
        blob = pad.transpose(2,0,1)[None].astype(np.float32)/255.0
        return blob, (scale, (nw, nh))

    def postprocess(self, out, meta):
        # NOTE: actual YOLOv8 ONNX outputs vary by export; this is a placeholder decoder
        # Expecting shape (1, N, 85) [x,y,w,h,conf,cls...]
        preds = out[0]
        preds = np.squeeze(preds, axis=0)
        boxes = []
        for det in preds:
            x,y,w,h,conf,cls = det[:6]
            if conf < 0.25: continue
            boxes.append({
                "bbox":[float(x),float(y),float(w),float(h)],
                "score": float(conf),
                "label": int(cls)
            })
        return boxes

    def infer(self, img):
        blob, meta = self.preprocess(img)
        out = self.session.run([self.out_name], { self.inp_name: blob })
        return self.postprocess(out, meta)

def detect_logo_cta(img: np.ndarray):
    # With a general model, we can't detect logos/CTAs specifically;
    # we treat 'person' and rectangular high-contrast regions as CTA proxies.
    detector = YOLOv8ONNX("services/vision/weights/yolov8n.onnx")
    boxes = detector.infer(img)
    # Simple CTA proxy: find biggest bright rectangle
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    thr = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY+cv2.THRESH_OTSU)[1]
    cnts, _ = cv2.findContours(thr, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    cta = None
    if cnts:
        c = max(cnts, key=cv2.contourArea)
        x,y,w,h = cv2.boundingRect(c)
        if w*h > img.shape[0]*img.shape[1]*0.02:
            cta = {"bbox":[x,y,w,h], "score":0.5, "label":"cta_proxy"}
    logos = [b for b in boxes if CLASS_NAMES[b["label"]] in ("person",)]  # proxy
    return logos, cta
