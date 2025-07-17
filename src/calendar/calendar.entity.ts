import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';
import { Outfit } from '../outfits/outfit.entity/outfit.entity';

@Entity()
export class Calendar {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: string; // Дата в формате YYYY-MM-DD

  @Column({ nullable: true })
  note: string; // Заметка

  @ManyToOne(() => User, (user) => user.calendar)
  user: User; // Пользователь

  @OneToMany(() => Outfit, (outfit) => outfit.calendar)
  outfits: Outfit[]; // Образы, добавленные в этот день  

  @Column({ default: false }) 
  isImportant: boolean; // Флаг важности дня

  @Column("simple-array", { nullable: true })
  events: string[] | null; // Список событий на день

  @Column({ type: 'float', nullable: true })
  temperature: number; // Температура в этот день

  @Column({ nullable: true })
  weatherType: string; // Тип погоды (солнечно, дождь и т. д.)

}

/* import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';
import { Outfit } from '../outfits/outfit.entity/outfit.entity';

@Entity()
export class Calendar {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: string; // Дата в формате YYYY-MM-DD

  @Column({ nullable: true })
  note: string; // Заметка

  @ManyToOne(() => User, (user) => user.calendar)
  user: User; // Пользователь

  @OneToMany(() => Outfit, (outfit) => outfit.calendar)
  outfits: Outfit[]; // Образы, добавленные в этот день

  @Column({ default: false }) // Добавляем поле для значимости дня
  isImportant: boolean;
}
 */