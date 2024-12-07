import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  Check,
} from 'typeorm';
import { User } from 'src/user/user.entity';
import { UserCourseAccess } from 'src/course-access/user-course-access.entity';
import { Lesson } from 'src/lesson/lesson.entity';
import { Comment } from 'src/comment/comment.entity';
import { Rating } from 'src/rating/rating.entity';
import { CourseTag } from 'src/course-tag/course-tag.entity';
import { LevelEnum } from './enums/level.enum';

@Entity()
@Check(`level IN ('beginner', 'intermediate', 'advanced')`)
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, unique: true })
  title: string;

  @Column('text')
  description: string;

  @Column({ type: 'enum', enum: LevelEnum, default: LevelEnum.BEGINNER })
  level: LevelEnum;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.courses, { eager: true })
  author: User;

  @OneToMany(() => Lesson, (lesson) => lesson.course)
  lessons: Lesson[];

  @OneToMany(() => Comment, (comment) => comment.course)
  comments: Comment[];

  @OneToMany(() => Rating, (rating) => rating.course)
  ratings: Rating[];

  @OneToMany(() => CourseTag, (courseTag) => courseTag.course)
  courseTags: CourseTag[];

  @OneToMany(() => UserCourseAccess, (access) => access.course)
  accesses: UserCourseAccess[];
}
