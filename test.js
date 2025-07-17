const getColors = require('get-image-colors');
const fs = require('fs');

const imagePath = "C:\\Users\\User\\wardrobe-app\\test-image.jpg"; // Замените на путь к изображению

getColors(imagePath).then(colors => {
  console.log(colors.map(color => color.hex())); // Вывод HEX-кодов цветов
}).catch(error => {
  console.error('Ошибка обработки изображения:', error);
});
