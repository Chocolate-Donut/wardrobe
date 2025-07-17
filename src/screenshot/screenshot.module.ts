// src/screenshot/screenshot.module.ts
import { Module } from '@nestjs/common';
import { ScreenshotService } from './screenshot.service';

@Module({
  providers: [ScreenshotService],
  exports: [ScreenshotService], // 👈 обязательно экспортировать
})
export class ScreenshotModule {}
