import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from 'src/user/user.entity';
import { Course } from 'src/course/course.entity';

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
