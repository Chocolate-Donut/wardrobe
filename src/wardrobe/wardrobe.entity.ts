import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn,  Column } from 'typeorm';
import { CreateDateColumn } from 'typeorm';
import { User } from 'src/users/user.entity';
import { Outfit } from 'src/outfits/outfit.entity/outfit.entity';

@Entity()
export class Wardrobe {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  imageUrl: string; // путь к картинке без фона

  @Column("simple-array")
  colors: string[]; // ['#aabbcc', '#ddeeff']

  @Column()
  type: string; // футболка, штаны и т.д.

  @Column("simple-array", { default: ""  })
  tags: string[];

  @Column({ nullable: true })
  season: string; 

   @Column({ nullable: true })
  brand: string; 



  @ManyToOne(() => User, (user) => user.wardrobe)
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
