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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToPng = convertToPng;
exports.removeBackground = removeBackground;
exports.extractColors = extractColors;
const fs = __importStar(require("fs"));
const axios_1 = __importDefault(require("axios"));
const get_image_colors_1 = __importDefault(require("get-image-colors"));
const sharp_1 = __importDefault(require("sharp"));
const FormData = require('form-data');
const path = __importStar(require("path"));
async function convertToPng(inputPath) {
    const outputDir = path.join(path.dirname(inputPath), 'converted');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    const outputPath = path.join(outputDir, `${path.basename(inputPath, path.extname(inputPath))}.png`);
    await (0, sharp_1.default)(inputPath).png().toFile(outputPath);
    return outputPath;
}
async function removeBackground(filePath) {
    const formData = new FormData();
    formData.append('image_file', fs.createReadStream(filePath));
    const response = await axios_1.default.post('https://api.remove.bg/v1.0/removebg', formData, {
        headers: {
            'X-Api-Key': 'AUSTGEsKFKwT6qT2k3srY1Ns',
            ...formData.getHeaders(),
        },
        responseType: 'stream',
    });
    const outputPath = filePath.replace('.png', '_nobg.png');
    response.data.pipe(fs.createWriteStream(outputPath));
    return new Promise((resolve) => {
        response.data.on('end', () => resolve(outputPath));
    });
}
async function extractColors(imagePath) {
    const pngImagePath = await convertToPng(imagePath);
    const colors = await (0, get_image_colors_1.default)(pngImagePath);
    return colors.map((color) => color.hex());
}
//# sourceMappingURL=image-processing.js.map