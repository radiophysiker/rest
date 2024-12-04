import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Course } from '../course/course.entity';
import { Comment } from '../comment/comment.entity';
import { Rating } from '../rating/rating.entity';
import { Resource } from '../resource/resource.entity';

@Entity()
export class Lesson {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  title: string;

  @Column('text')
  description: string;

  @ManyToOne(() => Course, (course) => course.lessons)
  course: Course;

  @OneToMany(() => Resource, (resource) => resource.lesson)
  resources: Resource[];

  @OneToMany(() => Comment, (comment) => comment.lesson)
  comments: Comment[];

  @OneToMany(() => Rating, (rating) => rating.lesson)
  ratings: Rating[];
}
