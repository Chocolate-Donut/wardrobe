import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
export declare class WeatherService {
    private readonly httpService;
    private readonly configService;
    constructor(httpService: HttpService, configService: ConfigService);
    getWeatherByCoords(lat: string, lon: string): Promise<any>;
    getWeather(city: string): Promise<any>;
    getWeatherForDate(city: string, date: string): Promise<{
        temperature: number;
        weatherType: string;
    }>;
}
