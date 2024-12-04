import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Course } from '../course/course.entity';

@Entity()
export class UserCourseAccess {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.courses)
  user: User;

  @ManyToOne(() => Course, (course) => course.accesses)
  course: Course;

  @CreateDateColumn()
  grantedAt: Date;
}
