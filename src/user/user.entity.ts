import { Exclude } from 'class-transformer';
import { UserCourseAccess } from '../course-access/user-course-access.entity';
import { Comment } from '../comment/comment.entity';
import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Rating } from '../rating/rating.entity';
import { RoleEnum } from '../common/enums/roles.enum';

@Entity()
@Check(`role IN ('user', 'author', 'admin')`)
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ unique: true, length: 30 })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({
    type: 'enum',
    enum: RoleEnum,
    default: RoleEnum.USER,
  })
  role: RoleEnum;

  @Column({ length: 200, nullable: true })
  about?: string;

  @Column({ default: 'https://i.pravatar.cc/300' })
  avatar?: string;

  @OneToMany(() => UserCourseAccess, (access) => access.user)
  courses: UserCourseAccess[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Rating, (rating) => rating.user)
  ratings: Rating[];
}
