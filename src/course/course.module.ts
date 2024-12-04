import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserCourseAccess } from 'src/course-access/user-course-access.entity';
import { User } from 'src/user/user.entity';
import { Course } from './course.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Course, UserCourseAccess])],
})
export class CourseModule {}
