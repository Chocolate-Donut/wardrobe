from fastapi import FastAPI, UploadFile, File, HTTPException
from .clarifai import detect_clothing_type  # Импортируем новый вариант функции

app = FastAPI()

@app.post("/detect")
async def detect(file: UploadFile = File(...)):
    """Основной эндпоинт для определения типа одежды"""
    try:
        # Читаем содержимое файла
        image_bytes = await file.read()

        # Отправляем в Clarifai через REST API
        result = await detect_clothing_type(image_bytes)

        # Если ошибка от Clarifai
        if "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])

        return {
            "filename": file.filename,
            "type": result["type"],
            "confidence": result["confidence"],
            "all_concepts": result["all_concepts"]
        }

    except Exception as e:
        print(f"Detection error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error during image processing")



""" from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .clarifai import detect_clothing_type  # Импорт функции из clarifai.py

app = FastAPI()

# Настройка CORS должна быть ОДНОЙ, до всех роутов
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Для продакшена укажите конкретные домены вместо "*"
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload")
async def upload(file: UploadFile = File(...)):
    "Тестовый эндпоинт для проверки загрузки файлов"
    return {"filename": file.filename}

@app.post("/detect")
async def detect(file: UploadFile = File(...)):
    "Основной эндпоинт для определения типа одежды"
    try:
        # Читаем содержимое файла
        image_bytes = await file.read()
        

        # Отправляем в Clarifai
        result = await detect_clothing_type(image_bytes)
        
        print("DETECTION RESULT:", result)  
        print(f"Uploaded file: {file.filename}, size: {len(image_bytes)} bytes")

        # Обрабатываем возможные ошибки от Clarifai
        if "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])
        
        return {
            "filename": file.filename,
            "type": result["type"],
            "confidence": result["confidence"]
        
        }
        
    except Exception as e:
        # Логируем ошибку для отладки
        import traceback
        print("EXCEPTION in /detect:", traceback.format_exc())
        print(f"Detection error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Internal server error during image processing"
        ) """