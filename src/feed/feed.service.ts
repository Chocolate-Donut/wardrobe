import { Injectable, Logger  } from '@nestjs/common';
import { Outfit } from '../outfits/outfit.entity/outfit.entity';
import { OutfitsService } from '../outfits/outfits.service';
import { WeatherService } from '../weather/weather.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { addDays } from 'date-fns';
import { User } from '../users/user.entity';
import { Favorite } from 'src/outfits/favorite.entity';
import { Not, MoreThan } from 'typeorm';



@Injectable()
export class FeedService {
    private readonly logger = new Logger(FeedService.name);
    constructor(
        private readonly outfitsService: OutfitsService,
        private readonly weatherService: WeatherService,
        @InjectRepository(Outfit)
        private readonly outfitRepository: Repository<Outfit>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Favorite)
        private readonly favoriteRepository: Repository<Favorite>,
    ) {}

    // Получить первые 20 образов
    // feed.service.ts
    async getPopularOutfits(): Promise<Outfit[]> {
        return this.outfitRepository
          .createQueryBuilder('outfit')
          .where('outfit.isPrivate = :isPrivate', { isPrivate: false })
          .orderBy('outfit.rating', 'DESC')
          .limit(20)
          .getMany();
      }
      
  
    /* async getPublicOutfits(): Promise<Outfit[]> {
    return this.outfitsService.getFilteredOutfits()
    } */

    async getFilteredOutfits(season?: string, tags?: string, trend?: string) {
    return this.outfitsService.getFilteredOutfits(season, tags, trend);
    }

    async searchOutfits(query: string) {
    return this.outfitsService.searchOutfits(query);
    }

    async searchByColor(palette: any) {
    return this.outfitsService.searchOutfitsByColor(palette);
    }


    // 🔥 Рекомендации по погоде
    async getRecommendedOutfits(city?: string) {
        this.logger.log(`📌 Получаем рекомендации по погоде. Город: ${city || 'не указан'}`);

        let season = 'all';
        let weatherAdvice = ''; // Советы по погоде
        let tags = []; // Теги для поиска

        if (city) {
            try {
                const weather = await this.weatherService.getWeather(city);
                const temp = weather.main.temp;
                const weatherCondition = weather.weather[0].main.toLowerCase(); // Тип погоды (Rain, Clear, etc.)

                // Определяем сезон по температуре
                if (temp < 0) season = 'winter';
                else if (temp >= 0 && temp < 15) season = 'autumn';
                else if (temp >= 15 && temp < 25) season = 'spring';
                else season = 'summer';

                let tags: string[] = []; // ✅ Указываем, что это массив строк
                // 🔥 Дополнительные советы
                if (weatherCondition.includes('rain')) {
                    weatherAdvice = "🌧️ Don’t forget ur umbrella";
                }
                if (weatherCondition.includes('clear')) {
                    weatherAdvice = '☀️ Protect Your Vision from Harmful UV Rays by wearing sunglasses';
                    tags.push('sunglasses'); // Добавляем тег для поиска образов
                }

                if (weatherCondition.includes('clear') && temp > 25) {
                    weatherAdvice = '☀️ Don’t forget to wear a hat so you don’t get sunstroke!';
                }

                if (weatherCondition.includes('rain') && temp > 13) {
                    weatherAdvice += ' 🌦️ Nice day for a Trench Coat!';
                    tags.push('trench coat', 'trench');
                }

                this.logger.log(`📌 Температура: ${temp}°C, сезон: ${season}, погода: ${weatherCondition}`);
            } catch (error) {
                this.logger.warn(`⚠️ Ошибка при получении погоды: ${error.message}`);
            }
        }

        // Запрашиваем образы по сезону и тегам
        const recommendedOutfits = await this.outfitsService.getFilteredOutfits(season, tags.length ? tags.join(',') : undefined);

        return {
            outfits: recommendedOutfits,
            advice: weatherAdvice || '🔥 Удачного дня!', // Если нет совета, просто пожелание
        };
    }



    //персонализированная лента
    async getSmartPersonalizedFeed(user: User): Promise<Outfit[]> {
  const favorites = await this.outfitRepository
    .createQueryBuilder('outfit')
    .innerJoin('outfit.favorites', 'fav', 'fav.user_id = :userId', { userId: user.id })
    .getMany();

  const tags = new Set<string>();
  const seasons = new Set<string>();
  const types = new Set<string>();

  for (const outfit of favorites) {
    (outfit.tags || []).forEach(tag => tags.add(tag));
    if (outfit.season) seasons.add(outfit.season);
    if (outfit.type) types.add(outfit.type);
  }

  // Похожие
  const query = this.outfitRepository.createQueryBuilder('outfit');
  query.where('outfit.isPrivate = false')
       .andWhere('outfit.userId != :userId', { userId: user.id });

  if (tags.size > 0) {
    const tagConditions = Array.from(tags).map((_, i) => `outfit.tags LIKE :tag${i}`);
    const tagParams = Object.fromEntries(Array.from(tags).map((t, i) => [`tag${i}`, `%${t}%`]));
    query.andWhere(`(${tagConditions.join(' OR ')})`, tagParams);
  }

  if (seasons.size > 0) {
    query.andWhere('outfit.season IN (:...seasons)', { seasons: Array.from(seasons) });
  }

  if (types.size > 0) {
    query.andWhere('outfit.type IN (:...types)', { types: Array.from(types) });
  }

  query.orderBy('outfit.createdAt', 'DESC').take(10);
  const similar = await query.getMany();

  // Популярные
  const popular = await this.outfitRepository.find({
    where: {
      isPrivate: false,
      user: { id: Not(user.id) },
    },
    order: { rating: 'DESC' },
    take: 10,
  });

  // Недавние
  const recent = await this.outfitRepository.find({
    where: {
      isPrivate: false,
      user: { id: Not(user.id) },
      createdAt: MoreThan(addDays(new Date(), -7)),
    },
    order: { createdAt: 'DESC' },
    take: 10,
  });

  // По сезону
  const month = new Date().getMonth() + 1;
  let currentSeason = 'spring';
  if ([12, 1, 2].includes(month)) currentSeason = 'winter';
  else if ([3, 4, 5].includes(month)) currentSeason = 'spring';
  else if ([6, 7, 8].includes(month)) currentSeason = 'summer';
  else if ([9, 10, 11].includes(month)) currentSeason = 'autumn';

  const seasonal = await this.outfitRepository.find({
    where: {
      isPrivate: false,
      user: { id: Not(user.id) },
      season: currentSeason,
    },
    order: { createdAt: 'DESC' },
    take: 10,
  });

  // Объединяем всё в одну ленту и удаляем дубликаты
const all = [...similar, ...popular, ...recent, ...seasonal];
const unique = new Map<number, Outfit>();
all.forEach(item => unique.set(item.id, item));

// Верни просто массив
return Array.from(unique.values()).slice(0, 30); // или больше

}




/*     // Рекомендации по погоде
    async getRecommendedOutfits(city?: string) {
    this.logger.log(`📌 Получаем рекомендации по погоде. Город: ${city || 'не указан'}`);

    let season = 'all';

    if (city) {
        try {
            const weather = await this.weatherService.getWeather(city);
            const temp = weather.main.temp;

            if (temp < 0) season = 'winter';
            else if (temp >= 0 && temp < 15) season = 'autumn';
            else if (temp >= 15 && temp < 25) season = 'spring';
            else season = 'summer';

            this.logger.log(`📌 Температура: ${temp}°C, выбран сезон: ${season}`);
        } catch (error) {
            this.logger.warn(`⚠️ Ошибка при получении погоды: ${error.message}`);
        }
    }

    return this.outfitsService.getFilteredOutfits(season);
} */
}


