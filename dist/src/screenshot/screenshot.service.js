"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScreenshotService = void 0;
const common_1 = require("@nestjs/common");
const puppeteer = __importStar(require("puppeteer"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
let ScreenshotService = class ScreenshotService {
    async generateOutfitImage(html, filename, canvasWidth, canvasHeight) {
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
        if (!fs.existsSync(folderPath))
            fs.mkdirSync(folderPath, { recursive: true });
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
    generateHTML(items, width, height) {
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
};
exports.ScreenshotService = ScreenshotService;
exports.ScreenshotService = ScreenshotService = __decorate([
    (0, common_1.Injectable)()
], ScreenshotService);
//# sourceMappingURL=screenshot.service.js.map