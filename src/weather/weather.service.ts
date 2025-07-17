import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom, from } from 'rxjs';


@Injectable()
export class WeatherService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getWeatherByCoords(lat: string, lon: string): Promise<any> {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    try {
      // Используем firstValueFrom для получения данных
      const response = await firstValueFrom(
        this.httpService.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
        )
      );
  
      if (response && response.data) {
        return response.data;
      } else {
        throw new Error('Ошибка получения данных погоды');
      }
    } catch (error) {
      console.error('Ошибка при получении данных погоды:', error);
      throw new Error('Ошибка при получении данных погоды');
    }
  }
  
  

  async getWeather(city: string): Promise<any> {
    const apiKey = process.env.OPENWEATHER_API_KEY;
     const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    const response = await firstValueFrom(this.httpService.get(url));
    return response.data;
  }

  // Получить прогноз погоды на конкретную дату (максимум 5 дней вперед)
  async getWeatherForDate(city: string, date: string): Promise<{ temperature: number; weatherType: string }> {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  
    const response = await firstValueFrom(this.httpService.get(url));
    const forecastList = response.data.list; // Список прогнозов на каждые 3 часа
  
    console.log('Forecast list:', forecastList);  // Логируем все прогнозы
  
    // Найдем прогноз, наиболее близкий к дате
    const forecast = forecastList.find(f => f.dt_txt.startsWith(date));
  
    if (!forecast) {
      console.error(`No weather data found for the date: ${date}`);
      throw new Error("Прогноз погоды на указанную дату не найден.");
    }
  
    return {
      temperature: forecast.main.temp,
      weatherType: forecast.weather[0].description,
    };
  }
  
  
}
