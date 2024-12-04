import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Check,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Course } from '../course/course.entity';
import { Lesson } from '../lesson/lesson.entity';

@Entity()
@Check('"value" >= 1 AND "value" <= 5')
export class Rating {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  value: number;

  @ManyToOne(() => User, (user) => user.ratings)
  user: User;

  @ManyToOne(() => Course, (course) => course.ratings, { nullable: true })
  course: Course;

  @ManyToOne(() => Lesson, (lesson) => lesson.ratings, { nullable: true })
  lesson: Lesson;

  @CreateDateColumn()
  createdAt: Date;
}
