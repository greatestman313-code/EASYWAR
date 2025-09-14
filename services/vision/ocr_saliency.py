
import numpy as np
import cv2
import pytesseract

def ocr_text(img: np.ndarray) -> str:
    rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    text = pytesseract.image_to_string(rgb, lang='ara+eng')
    return text.strip()

def simple_saliency(img: np.ndarray) -> np.ndarray:
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    sal = cv2.Laplacian(gray, cv2.CV_64F)
    sal = cv2.convertScaleAbs(np.abs(sal))
    sal = cv2.GaussianBlur(sal, (9,9), 0)
    sal = cv2.normalize(sal, None, 0, 255, cv2.NORM_MINMAX)
    return sal
