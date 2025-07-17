import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { OutfitsModule } from './outfits/outfits.module';
import { WeatherModule } from './weather/weather.module';
import { ProfileModule } from './profile/profile.module';
import { FeedModule } from './feed/feed.module';
import { FavoritesModule } from './favorites/favorites.module';
import { CalendarModule } from './calendar/calendar.module';
import { WardrobeModule } from './wardrobe/wardrobe.module';
import { ScreenshotService } from './screenshot/screenshot.service';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'wardrobe.db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: true, // Консольде SQL-сұраныстарын көрсетеді
    }),
    UsersModule,
    AuthModule,
    OutfitsModule,
    WeatherModule,
    ProfileModule,
    FeedModule,
    FavoritesModule,
    CalendarModule,
    WardrobeModule,  

    
  ],
  providers: [ScreenshotService],
  exports: [ScreenshotService],
})
export class AppModule {}




