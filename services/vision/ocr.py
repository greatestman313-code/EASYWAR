from PIL import Image
import pytesseract

def run_ocr(img: Image.Image) -> str:
    try:
        return pytesseract.image_to_string(img, lang='ara+eng')
    except Exception as e:
        return ''
