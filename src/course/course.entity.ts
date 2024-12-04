import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  Check,
} from 'typeorm';
import { User } from '../user/user.entity';
import { UserCourseAccess } from '../course-access/user-course-access.entity';
import { Lesson } from '../lesson/lesson.entity';
import { Comment } from '../comment/comment.entity';
import { Rating } from '../rating/rating.entity';
import { CourseTag } from '../course-tag/course-tag.entity';

@Entity()
@Check(`level IN ('beginner', 'intermediate', 'advanced')`)
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  title: string;

  @Column('text')
  description: string;

  @Column({ default: 'beginner' })
  level: 'beginner' | 'intermediate' | 'advanced';

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
