import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Outfit } from 'src/outfits/outfit.entity/outfit.entity';
import { Favorite } from '../outfits/favorite.entity';
import { Calendar } from '../calendar/calendar.entity'; // Импортируем Calendar
import { Wardrobe } from '../wardrobe/wardrobe.entity';

@Entity()

export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column({unique: true})
    email: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    avatar: string; // Будем хранить путь к файлу

    @Column({ nullable: true })
    city: string;

    @OneToMany(() => Outfit, (outfit) => outfit.user) // Добавляем связь
    outfits: Outfit[];

    @OneToMany(() => Favorite, (favorite) => favorite.user, { cascade: true })
    favorites: Favorite[];

    @Column({ default: false })
    isPrivate: boolean;
    
    @OneToMany(() => Calendar, (calendar) => calendar.user) // Связь с календарем
    calendar: Calendar[];

    @OneToMany(() => Wardrobe, (wardrobe) => wardrobe.user)
    wardrobe: Wardrobe[];

    @Column({ type: 'text', nullable: true })
    verificationCode: string | null;



    @Column({ default: false })
    isVerified: boolean;

}


