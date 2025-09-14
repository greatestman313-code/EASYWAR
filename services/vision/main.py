from fastapi import FastAPI, UploadFile
from fastapi.responses import JSONResponse
from PIL import Image
import io

app = FastAPI(title="Vision Service (placeholder)")

@app.post("/ocr")
async def ocr(file: UploadFile):
    # Placeholder: real OCR to be integrated
    content = await file.read()
    Image.open(io.BytesIO(content))  # validate image
    return JSONResponse({"text": "OCR placeholder (integrate Tesseract/Google OCR)"})
