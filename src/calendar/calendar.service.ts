import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Calendar } from './calendar.entity';
import { User } from '../users/user.entity';
import { WeatherService } from '../weather/weather.service'; // Подключаем сервис погоды
import { Outfit } from 'src/outfits/outfit.entity/outfit.entity';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
// 🔥 Подключаем плагин перед его использованием
dayjs.extend(isSameOrAfter);

@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(Calendar)
    private readonly calendarRepository: Repository<Calendar>, 
    private readonly weatherService: WeatherService, 
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,  
    @InjectRepository(Outfit)
    private readonly outfitRepository: Repository<Outfit> // Репозиторий для Outfit

  ) {}

  // Получить все события на месяц или другой период
  async getAllCalendarEntries(userId: number): Promise<Calendar[]> {
    const calendarEntries = await this.calendarRepository.find({
      where: { user: { id: userId } },
      relations: ['outfits'], // Получаем образы
    });
    return calendarEntries;
  }

  // Получить события и прогноз для конкретной даты
  async getCalendarByDate(userId: number, date: string): Promise<any> {
  let calendarEntry = await this.calendarRepository.findOne({
    where: { user: { id: userId }, date },
    relations: ['outfits'],
  });

  // Получаем пользователя
  const user = await this.userRepository.findOne({ where: { id: userId } });
  const userCity = user?.city || "Astana";

  // Получаем прогноз погоды, даже если записей нет
  let temperature: number | null = null;
  let weatherType: string | null = null;

  try {
    const weatherData = await this.weatherService.getWeatherForDate(userCity, date);
    temperature = weatherData.temperature;
    weatherType = weatherData.weatherType;
  } catch (err) {
    console.warn('⚠️ Ошибка получения погоды:', err.message);
  }

  // Если нет записей — возвращаем пустую структуру
  if (!calendarEntry) {
    return {
      date,
      events: [],
      note: '',
      outfits: [],
      temperature,
      weatherType,
    };
  }

  // Возврат с записями
  return {
    date: calendarEntry.date,
    events: calendarEntry.events,
    note: calendarEntry.note,
    outfits: calendarEntry.outfits,
    temperature,
    weatherType,
  };
}




  /* async getCalendarByDate(userId: number, date: string): Promise<any> {
    const calendarEntry = await this.calendarRepository.findOne({
      where: { user: { id: userId }, date },
      relations: ['outfits'],
    });

    if (!calendarEntry) {
      throw new Error('Нет записей на эту дату.');
    }

    const today = dayjs().format('YYYY-MM-DD');
    const isFutureOrToday = dayjs(date).isSameOrAfter(today);

    let temperature: number | null = null; // ✅ Теперь TypeScript не ругается
    let weatherType: string | null = null;

    if (isFutureOrToday) {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      const userCity = user?.city || "Astana";

      try {
        const weatherData = await this.weatherService.getWeatherForDate(userCity, date);
        temperature = weatherData.temperature;
        weatherType = weatherData.weatherType;
      } catch (err) {
        console.warn('⚠️ Ошибка получения погоды:', err.message);
      }
    }

    return {
      date: calendarEntry.date,
      events: calendarEntry.events,
      note: calendarEntry.note,
      outfits: calendarEntry.outfits,
      temperature,
      weatherType,
    };
  } */

/*   async getCalendarByDate(userId: number, date: string): Promise<any> {
    const calendarEntry = await this.calendarRepository.findOne({
      where: { user: { id: userId }, date },
      relations: ['outfits'], // Получаем образы для этой даты
    });

    if (!calendarEntry) {
      throw new Error('Нет записей на эту дату.');
    }

    // Получаем город пользователя
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const userCity = user?.city || "Astana"; 

    // Получаем прогноз погоды для конкретной даты
    const weatherData = await this.weatherService.getWeatherForDate(userCity, date);

    // Возвращаем данные
    return {
      date: calendarEntry.date,
      events: calendarEntry.events,
      note: calendarEntry.note,
      outfits: calendarEntry.outfits,
      temperature: weatherData.temperature,
      weatherType: weatherData.weatherType,
    };
  } */

  // Добавить событие
  async addEvent(userId: number, date: string, event: string): Promise<Calendar> {
    let calendarEntry = await this.calendarRepository.findOne({
      where: { date, user: { id: userId } }
    });
  
    if (!calendarEntry) {
      calendarEntry = this.calendarRepository.create({
        date,
        user: { id: userId },
        events: [event],
        isImportant: true // 👈 новый день = сразу важный
      });
    } else {
      if (!calendarEntry.events) {
        calendarEntry.events = [];
      }
  
      // Проверка, чтобы не дублировать
      if (!calendarEntry.events.includes(event)) {
        calendarEntry.events.push(event);
      }
  
      calendarEntry.isImportant = true; // 👈 помечаем важным
    }
  
    return this.calendarRepository.save(calendarEntry);
  }  
  /* async addEvent(userId: number, date: string, event: string): Promise<Calendar> {
    let calendarEntry = await this.calendarRepository.findOne({ where: { date, user: { id: userId } } });

    if (!calendarEntry) {
      calendarEntry = this.calendarRepository.create({ date, user: { id: userId }, events: [event] });
    } else {
      calendarEntry.events.push(event);
    }

    return this.calendarRepository.save(calendarEntry);
  } */

  // Удалить событие
  async removeEvent(userId: number, date: string, event: string): Promise<Calendar | null> {
    const calendarEntry = await this.calendarRepository.findOne({
      where: { date, user: { id: userId } }
    });
  
    if (!calendarEntry || !calendarEntry.events) return null;
  
    calendarEntry.events = calendarEntry.events.filter(e => e !== event);
  
    // 👇 если событий больше нет — день не важный
    calendarEntry.isImportant = calendarEntry.events.length > 0;
  
    return this.calendarRepository.save(calendarEntry);
  }
  
/*   async removeEvent(userId: number, date: string, event: string): Promise<Calendar | null> {
    const calendarEntry = await this.calendarRepository.findOne({ where: { date, user: { id: userId } } });

    if (calendarEntry) {
      calendarEntry.events = calendarEntry.events.filter(e => e !== event);
      return this.calendarRepository.save(calendarEntry);
    }

    return null;
  } */

  // Обновить заметку
  async updateNote(userId: number, date: string, note: string): Promise<Calendar> {
    let calendarEntry = await this.calendarRepository.findOne({ where: { date, user: { id: userId } } });

    if (!calendarEntry) {
      calendarEntry = this.calendarRepository.create({ date, user: { id: userId }, note });
    } else {
      calendarEntry.note = note;
    }

    return this.calendarRepository.save(calendarEntry);
  }

  // Добавить образ на день
  async addOutfitToDate(userId: number, date: string, outfitId: number): Promise<Calendar> {
  let calendarEntry = await this.calendarRepository.findOne({
    where: { user: { id: userId }, date },
    relations: ['outfits'],
  });

  if (!calendarEntry) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new Error('Пользователь не найден');

    calendarEntry = this.calendarRepository.create({
      date,
      user,
      events: [],
      outfits: [],
      isImportant: true,
    });
  }

  const outfit = await this.outfitRepository.findOne({ where: { id: outfitId } });
  if (!outfit) {
    throw new Error('Образ с таким ID не найден.');
  }

  // Проверка на дублирование
  if (!calendarEntry.outfits.some(o => o.id === outfitId)) {
    calendarEntry.outfits.push(outfit);
  }

  return this.calendarRepository.save(calendarEntry);
}

  /* async addOutfitToDate(userId: number, date: string, outfitId: number): Promise<Calendar> {
    console.log('Looking for outfit with ID:', outfitId);  // Логируем перед запросом
  
    const calendarEntry = await this.calendarRepository.findOne({
      where: { user: { id: userId }, date },
      relations: ['outfits'], // Загружаем образы для этой даты
    });
  
    if (!calendarEntry) {
      throw new Error('Запись для этой даты не найдена.');
    }
    console.log('Outfit ID:', outfitId);
    const outfit = await this.outfitRepository.findOne({ where: { id: outfitId } });
    if (!outfit) {
      throw new Error('Образ с таким ID не найден.');
    }
  
    console.log('Outfit found:', outfit);  // Логируем, если образ найден
    
    // Добавляем образ в массив outfits
    calendarEntry.outfits.push(outfit);
  
    return this.calendarRepository.save(calendarEntry); // Сохраняем изменения
  }
     */

  // Удалить образ с дня
  async removeOutfitFromDate(userId: number, date: string, outfitId: number): Promise<Calendar> {
    const calendarEntry = await this.calendarRepository.findOne({
      where: { user: { id: userId }, date },
      relations: ['outfits'],
    });

    if (!calendarEntry) {
      throw new Error('Запись для этой даты не найдена.');
    }

    const outfitIndex = calendarEntry.outfits.findIndex((outfit) => outfit.id === outfitId);
    if (outfitIndex === -1) {
      throw new Error('Образ не найден на этой дате.');
    }

    // Удаляем образ
    calendarEntry.outfits.splice(outfitIndex, 1);

    return this.calendarRepository.save(calendarEntry); // Сохраняем изменения
  }








  async updateEvents(userId: number, date: string, newEvents: string[]): Promise<Calendar> {
  let calendarEntry = await this.calendarRepository.findOne({
    where: { date, user: { id: userId } }
  });

  const cleanedEvents = newEvents
    .map(e => e.trim())
    .filter(e => e.length > 0);

  if (!calendarEntry) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new Error('Пользователь не найден');

    calendarEntry = this.calendarRepository.create({
      date,
      user,
      events: cleanedEvents.length > 0 ? cleanedEvents : null,
      isImportant: cleanedEvents.length > 0
    });
  } else {
    calendarEntry.events = cleanedEvents.length > 0 ? cleanedEvents : null;
    calendarEntry.isImportant = cleanedEvents.length > 0;
  }

  return this.calendarRepository.save(calendarEntry);
}


}



/* import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Calendar } from './calendar.entity';
import { User } from '../users/user.entity';
import { Outfit } from '../outfits/outfit.entity/outfit.entity';

@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(Calendar)
    private readonly calendarRepository: Repository<Calendar>,
  ) {}

  // Получить запланированные образы на сегодня
  async getUserCalendar(userId: number): Promise<Calendar[]> {
    return this.calendarRepository.find({ where: {user: { id: userId }}, relations: ['outfits'] });
  }

  // Добавить образ в календарь
  async addToCalendar(userId: number, outfit: Outfit, date: string, note: string): Promise<Calendar> {
    const calendarEntry = this.calendarRepository.create({
      date,
      note,
      user: { id: userId },
      outfits: [outfit],
    });

    return this.calendarRepository.save(calendarEntry);
  }

  // Удалить образ из календаря
  async removeFromCalendar(userId: number, calendarId: number): Promise<void> {
    await this.calendarRepository.delete({ id: calendarId, user: { id: userId } });
  }

  // Пометить день как значимый
  async markAsImportant(userId: number, date: string): Promise<void> {
    const calendarEntry = await this.calendarRepository.findOne({ where: { user: { id: userId }, date } });
    if (calendarEntry) {
      calendarEntry.isImportant = true;
      await this.calendarRepository.save(calendarEntry);
    }
  }

  // Добавить заметку
  async addNoteToDay(userId: number, date: string, note: string): Promise<void> {
    const calendarEntry = await this.calendarRepository.findOne({ where: { user: { id: userId }, date } });
    if (calendarEntry) {
      calendarEntry.note = note;
      await this.calendarRepository.save(calendarEntry);
    }
  }
}
 */