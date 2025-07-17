import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, OneToMany } from 'typeorm';
import { User } from 'src/users/user.entity';
import { Favorite } from '../favorite.entity';
import { Calendar } from '../../calendar/calendar.entity'; // Импортируем Calendar

@Entity()
export class Outfit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  imageUrl: string;

  @Column('simple-array')
  colors: string[];
  
  @Column({ type: 'simple-json' }) // 👈 Изменили тип на JSON
  tags: string[];

  @Column()
  season: string; // Например: "Зима", "Лето", "Весна", "Осень"

  @Column()
  trend: string; // Например: "Casual", "Streetwear", "Classic"

  @ManyToOne(() => User, (user) => user.outfits, { nullable: true }) // Образ может принадлежать пользователю, но не обязательно
  user: User;

  @Column({ default: false })
  isPrivate: boolean;


  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'int', default: 0 })
  rating: number;


  @OneToMany(() => Favorite, (favorite) => favorite.outfit, { cascade: true })
  favorites: Favorite[];

  @ManyToOne(() => Calendar, (calendar) => calendar.outfits)
  calendar: Calendar; // Связь с конкретным календарем
  
  @Column({ nullable: true })
  type: string;

  @Column({ type: 'json', nullable: true })
  items: any[];

}


