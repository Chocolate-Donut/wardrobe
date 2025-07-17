import * as fs from 'fs';
import axios from 'axios';
import getImageColors from 'get-image-colors';
import * as ColorThief from 'color-thief-node';
import { promisify } from 'util';
import sharp from 'sharp';

const FormData = require('form-data');

import * as path from 'path';

export async function convertToPng(inputPath: string): Promise<string> {
    const outputDir = path.join(path.dirname(inputPath), 'converted'); // <-- Подпапка "converted"
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true }); // <-- Создаём папку, если её нет
    }
  
    const outputPath = path.join(
      outputDir,
      `${path.basename(inputPath, path.extname(inputPath))}.png`
    );
  
    await sharp(inputPath).png().toFile(outputPath);
  
    return outputPath;
  }


// 🔵 Функция удаления фона
export async function removeBackground(filePath: string): Promise<string> {
  const formData = new FormData();
  formData.append('image_file', fs.createReadStream(filePath));

  const response = await axios.post(
    'https://api.remove.bg/v1.0/removebg',
    formData,
    {
      headers: {
        'X-Api-Key': 'AUSTGEsKFKwT6qT2k3srY1Ns', /*N17D1T4oVHksNREYizJL1toj */
        ...formData.getHeaders(),
      },
      responseType: 'stream',
    },
  );

  const outputPath = filePath.replace('.png', '_nobg.png');
  response.data.pipe(fs.createWriteStream(outputPath));

  return new Promise((resolve) => {
    response.data.on('end', () => resolve(outputPath));
  });
}

// 🔵 Функция извлечения цветов
export async function extractColors(imagePath: string): Promise<string[]> {

  const pngImagePath = await convertToPng(imagePath);
  const colors = await getImageColors(pngImagePath);
  return colors.map((color) => color.hex());
}
