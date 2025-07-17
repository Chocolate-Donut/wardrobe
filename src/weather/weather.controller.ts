import { Controller, Get, Query } from '@nestjs/common';
import { WeatherService } from './weather.service';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get()
  async getWeather(@Query('city') city: string) {
    return this.weatherService.getWeather(city);
  }
  @Get('coords')
  async getWeatherByCoords(@Query('lat') lat: string, @Query('lon') lon: string) {
  console.log('Received coordinates:', lat, lon); // Логирование координат
  return this.weatherService.getWeatherByCoords(lat, lon);
}

}
