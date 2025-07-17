import axios from 'axios';
import * as fs from 'fs';

export const detectClothingType = async (imagePath: string) => {
  try {
    // Читаем файл как бинарные данные
    const imageBuffer = fs.readFileSync(imagePath);
    
    // Создаем FormData и отправляем файл
    const formData = new FormData();
    const blob = new Blob([imageBuffer]);
    formData.append('file', blob);

    const response = await axios.post('http://localhost:8000/detect', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return {
      type: response.data.type || "Unknown",
      confidence: response.data.confidence
    };
  } catch (error) {
    console.error("Error detecting clothing type:", error);
    return { type: "Unknown", confidence: 0 };
  }
};

/* import axios from 'axios';
import * as fs from 'fs';

export const detectClothingType = async (imagePath: string) => {
  try {
    const response = await axios.post('http://localhost:8000/detect', {
      // Отправка изображения на сервер для детекции
      image: imagePath
    });

    if (response.data) {
      return {
        type: response.data.type || "Unknown",  // Обработка типа
        confidence: response.data.confidence
      };
    } else {
      return { type: "Unknown", confidence: 0 };
    }
  } catch (error) {
    console.error("Error detecting clothing type:", error);
    return { type: "Unknown", confidence: 0 };
  }
};
 */