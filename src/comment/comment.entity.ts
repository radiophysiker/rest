import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from 'src/user/user.entity';
import { Course } from 'src/course/course.entity';
import { Lesson } from 'src/lesson/lesson.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  content: string;

  @ManyToOne(() => User, (user) => user.comments)
  user: User;

  @ManyToOne(() => Course, (course) => course.comments, { cascade: true })
  course: Course;

  @ManyToOne(() => Lesson, (lesson) => lesson.comments, { cascade: true })
  lesson: Lesson;

  @CreateDateColumn()
  createdAt: Date;
}
