// src/screenshot/screenshot.service.ts
/* import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ScreenshotService { */



  /* async generateOutfitImage(html: string, filename: string): Promise<string> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox'],
  });
  const page = await browser.newPage();

  await page.setViewport({ width: 1600, height: 1200 }); // Просто большой размер
  await page.setContent(html, { waitUntil: 'networkidle0' });

  // Скроллим в (0, 0), чтобы canvas был полностью в зоне видимости
  await page.evaluate(() => window.scrollTo(0, 0));

  const canvasElement = await page.$('.canvas');
  if (!canvasElement) {
    await browser.close();
    throw new Error('❌ .canvas не найден');
  }

  const boundingBox = await canvasElement.boundingBox();
  if (!boundingBox) {
    await browser.close();
    throw new Error('❌ Не удалось получить boundingBox');
  }

  const folderPath = path.join(process.cwd(), 'uploads', 'outfits');
  if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });

  const outputPath = path.join(folderPath, filename);

  // Скриншот по boundingBox (теперь — корректный)
  await page.screenshot({
    path: outputPath,
    clip: {
      x: boundingBox.x,
      y: boundingBox.y,
      width: boundingBox.width,
      height: boundingBox.height,
    },
  });

  await browser.close();
  return `uploads/outfits/${filename}`;
} */



/* async generateOutfitImage(html: string, filename: string, canvasWidth: number, canvasHeight: number): Promise<string> {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setViewport({ width: Math.round(canvasWidth), height: Math.round(canvasHeight), deviceScaleFactor: 1  });
  await page.setContent(html, { waitUntil: 'networkidle0' });

  const folderPath = path.join(process.cwd(), 'uploads', 'outfits');
  if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });

  const outputPath = path.join(folderPath, filename);
  await page.screenshot({
    path: outputPath,
    clip: {
      x: 0,
      y: 0,
      width: canvasWidth,
      height: canvasHeight
    }
  });

  await browser.close();
  return `uploads/outfits/${filename}`;
};





  private generateHtml(items: any[]) {
  const canvasStyle = `
    width: 1020px;
    height: 760px;
    position: relative;
    background: white;
    overflow: hidden;
  `;

  return `
    <html>
      <head><style>body { margin:0; }</style></head>
      <body>
        <div class="canvas" style="${canvasStyle}">
          ${items.map(item => `
            <img src="http://localhost:3000/${item.imageUrl.replace(/\\/g, '/')}"
                 style="position:absolute;
                        left:${item.x}px;
                        top:${item.y}px;
                        transform:scale(${item.scale || 1});
                        transform-origin: top left;">
          `).join('')}
        </div>
      </body>
    </html>
  `;
}



} */

import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ScreenshotService {
  async generateOutfitImage(
    html: string,
    filename: string,
    canvasWidth: number,
    canvasHeight: number
  ): Promise<string> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox'],
    });

    const page = await browser.newPage();

    await page.setViewport({
  width: 280,
  height: 400,
  deviceScaleFactor: 1
});


    await page.setContent(html, { waitUntil: 'networkidle0' });

    const folderPath = path.join(process.cwd(), 'uploads', 'outfits');
    if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });

    const outputPath = path.join(folderPath, filename);

    await page.screenshot({
      path: outputPath,
      clip: {
        x: 0,
        y: 0,
        width: canvasWidth,
        height: canvasHeight,
      },
    });

    await browser.close();
    return `uploads/outfits/${filename}`;
  }

  generateHTML(items: any[], width: number, height: number): string {
  const imageTags = items.map((item) => {
    const src = `http://localhost:3000/${item.imageUrl.replace(/\\/g, '/')}`;
    const imgWidth = 100 * (item.scale || 1);
    const imgHeight = imgWidth * (item.aspectRatio || 1);

    return `<img 
      src="${src}" 
      style="
        position: absolute;
        top: ${item.y}px;
        left: ${item.x}px;
        width: ${imgWidth}px;
        height: ${imgHeight}px;
        object-fit: contain;
      "
    />`;
  }).join('');

  return `
    <html>
      <head>
        <style>
          body { margin: 0; background: transparent; }
          .canvas {
            width: ${width}px;
            height: ${height}px;
            position: relative;
            background: white;
            overflow: hidden;
          }
        </style>
      </head>
      <body>
        <div class="canvas">
          ${imageTags}
        </div>
      </body>
    </html>
  `;
}



}

