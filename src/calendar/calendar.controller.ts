import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../users/user.entity';

@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  // Получить все события и даты для календаря (например, за месяц)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getUserCalendar(@GetUser() user: User) {
    return this.calendarService.getAllCalendarEntries(user.id); // Получить все записи за месяц или другой период
  }

  // Получить подробности по конкретной дате
  @UseGuards(JwtAuthGuard)
  @Get(':date')
  async getCalendarByDate(
    @GetUser() user: User,
    @Param('date') date: string, // Получаем дату в формате YYYY-MM-DD
  ) {
    return this.calendarService.getCalendarByDate(user.id, date); // Получаем данные по конкретной дате
  }


/*   @UseGuards(JwtAuthGuard)
  @Post(':date/event')
  async addEvent(
    @GetUser() user: User,
    @Param('date') date: string,
    @Body() { event }: { event: string }
  ) {
    return this.calendarService.addEvent(user.id, date, event);
  } */

    @UseGuards(JwtAuthGuard)
@Put(':date/events')
async updateEvents(
  @GetUser() user: User,
  @Param('date') date: string,
  @Body() body: { events: string[] }
) {
  return this.calendarService.updateEvents(user.id, date, body.events);
}



   // Удалить событие с выбранной даты
   @UseGuards(JwtAuthGuard)
   @Delete(':date/event')
   async removeEvent(
     @GetUser() user: User,
     @Param('date') date: string,
     @Body() { event }: { event: string }
   ) {
     return this.calendarService.removeEvent(user.id, date, event);
   }
 


/* 
  // Добавить событие в календарь
  @UseGuards(JwtAuthGuard)
  @Post('event')
  async addEvent(
    @GetUser() user: User,
    @Body() { date, event }: { date: string; event: string }
  ) {
    return this.calendarService.addEvent(user.id, date, event);
  }

  // Удалить событие
  @UseGuards(JwtAuthGuard)
  @Delete('event')
  async removeEvent(
    @GetUser() user: User,
    @Body() { date, event }: { date: string; event: string }
  ) {
    return this.calendarService.removeEvent(user.id, date, event);
  }
 */
  // Обновить заметку
  // Обновить заметку для выбранной даты
  @UseGuards(JwtAuthGuard)
  @Put(':date/note')
  async updateNote(
    @GetUser() user: User,
    @Param('date') date: string,
    @Body() { note }: { note: string }
  ) {
    return this.calendarService.updateNote(user.id, date, note);
  }


  // Добавить образ на день
  @UseGuards(JwtAuthGuard)
  @Post(':date/outfits')
  async addOutfitToDate(
    @GetUser() user: User,
    @Param('date') date: string,
    @Body() body: { outfitId: number } // 💡 Извлекаем outfitId из объекта
  ) {
    return this.calendarService.addOutfitToDate(user.id, date, body.outfitId);
  }

/*   @Post(':date/outfits')
  async addOutfitToDate(
    @GetUser() user: User,
    @Param('date') date: string, // Дата для назначения образа
    @Body() outfitId: number // ID образа для добавления
  ) {
    return this.calendarService.addOutfitToDate(user.id, date, outfitId);
  } */

  // Удалить образ с дня
  @UseGuards(JwtAuthGuard)
  @Delete(':date/outfits')
  async removeOutfitFromDate(
    @GetUser() user: User,
    @Param('date') date: string, // Дата для удаления образа
    @Body() body: { outfitId: number } // 💡 Извлекаем outfitId из объекта
  ) {
    return this.calendarService.removeOutfitFromDate(user.id, date, body.outfitId);
  }
}

/* import { Controller, Get, Post, Delete, Param, Body, UseGuards, Query } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../users/user.entity';
import { Outfit } from '../outfits/outfit.entity/outfit.entity';

@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  // Получить все запланированные образы на сегодня
  @UseGuards(JwtAuthGuard)
  @Get()
  async getUserCalendar(@GetUser() user: User) {
    return this.calendarService.getUserCalendar(user.id);
  }

  // Добавить образ в календарь
  @UseGuards(JwtAuthGuard)
  @Post('add')
  async addToCalendar(
    @GetUser() user: User,
    @Body() { outfitId, date, note }: { outfitId: number, date: string, note: string },
  ) {
    const outfit = new Outfit(); // Здесь нужно получить образ по outfitId
    outfit.id = outfitId;

    return this.calendarService.addToCalendar(user.id, outfit, date, note);
  }

  // Удалить образ из календаря
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async removeFromCalendar(@GetUser() user: User, @Param('id') calendarId: number) {
    return this.calendarService.removeFromCalendar(user.id, calendarId);
  }

  // Пометить день как знаменательный
  @UseGuards(JwtAuthGuard)
  @Post('mark-important/:date')
  async markAsImportant(@GetUser() user: User, @Param('date') date: string) {
    return this.calendarService.markAsImportant(user.id, date);
  }

  // Добавить заметку в день
  @UseGuards(JwtAuthGuard)
  @Post('add-note')
  async addNote(
    @GetUser() user: User,
    @Body() { date, note }: { date: string, note: string },
  ) {
    return this.calendarService.addNoteToDay(user.id, date, note);
  }
}
 */