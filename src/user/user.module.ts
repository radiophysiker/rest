import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserCourseAccess } from 'src/course-access/user-course-access.entity';
import { Course } from 'src/course/course.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Course, UserCourseAccess])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
