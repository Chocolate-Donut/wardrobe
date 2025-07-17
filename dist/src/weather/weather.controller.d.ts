import { WeatherService } from './weather.service';
export declare class WeatherController {
    private readonly weatherService;
    constructor(weatherService: WeatherService);
    getWeather(city: string): Promise<any>;
    getWeatherByCoords(lat: string, lon: string): Promise<any>;
}
