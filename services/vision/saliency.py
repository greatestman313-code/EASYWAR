import numpy as np
from PIL import Image, ImageStat

def dummy_saliency(img: Image.Image) -> np.ndarray:
    # Very naive: use luminance variance as proxy
    gray = img.convert('L')
    arr = np.array(gray, dtype=np.float32) / 255.0
    return (arr - arr.min()) / max(1e-6, (arr.max() - arr.min()))
