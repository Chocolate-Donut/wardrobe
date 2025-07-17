import axios from 'axios';

// Функция для распознавания типа одежды с помощью Clarifai API
export async function recognizeClothingType(imagePath: string): Promise<string> {
  const apiKey = 'your-clarifai-api-key'; // Замените на свой API ключ
  const modelId = 'general-image-recognition'; // Вы можете использовать свою модель или другую, которая распознает одежду

  try {
    const formData = new FormData();
    formData.append('image', imagePath); // Вставьте путь к изображению или base64 строку

    const response = await axios.post(
      `https://api.clarifai.com/v2/models/${modelId}/outputs`, 
      formData,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    // Получаем название распознанного типа
    const recognizedType = response.data.outputs[0].data.concepts[0].name;
    return recognizedType;
  } catch (error) {
    console.error('Ошибка при распознавании типа одежды:', error);
    return 'Неизвестный тип';
  }
}
