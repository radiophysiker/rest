import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  TableInheritance,
  ManyToOne,
} from 'typeorm';
import { Lesson } from '../lesson/lesson.entity';

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class Resource {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  description: string;

  // Ссылка на ресурс S3
  @Column()
  url: string;

  @ManyToOne(() => Lesson, (lesson) => lesson.resources)
  lesson: Lesson;
}
