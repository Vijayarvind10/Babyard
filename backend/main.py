from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from ultralytics import YOLO
import cv2
import numpy as np
import base64
import io

app = FastAPI()

# CORS
# For a public prototype, we can be more permissive or add the specific cloud domain later.
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Model
model = YOLO("yolov8n.pt")

@app.post("/analyze")
async def analyze_blueprint(file: UploadFile = File(...)):
    # Read image
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    if img is None:
        return JSONResponse(content={"error": "Invalid image file"}, status_code=400)

    # Inference
    results = model(img)
    
    # Process results
    result = results[0]
    
    # Generate summary counts
    summary = {}
    classes = result.names
    for box in result.boxes:
        cls_id = int(box.cls[0])
        cls_name = classes[cls_id]
        summary[cls_name] = summary.get(cls_name, 0) + 1

    # Get annotated image
    annotated_img = result.plot()
    
    # Convert to base64
    _, buffer = cv2.imencode('.jpg', annotated_img)
    img_str = base64.b64encode(buffer).decode('utf-8')

    return {
        "summary": summary,
        "annotated_image": img_str
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
