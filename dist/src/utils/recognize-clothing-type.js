"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.recognizeClothingType = recognizeClothingType;
const axios_1 = __importDefault(require("axios"));
async function recognizeClothingType(imagePath) {
    const apiKey = 'ec27fafb32784999b92c0e065d4ecd3e';
    const modelId = 'general-image-recognition';
    try {
        const formData = new FormData();
        formData.append('image', imagePath);
        const response = await axios_1.default.post(`https://api.clarifai.com/v2/models/${modelId}/outputs`, formData, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'multipart/form-data',
            },
        });
        const recognizedType = response.data.outputs[0].data.concepts[0].name;
        return recognizedType;
    }
    catch (error) {
        console.error('Ошибка при распознавании типа одежды:', error);
        return 'Неизвестный тип';
    }
}
//# sourceMappingURL=recognize-clothing-type.js.map