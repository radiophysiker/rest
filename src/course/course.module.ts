import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserCourseAccess } from 'src/course-access/user-course-access.entity';
import { User } from 'src/user/user.entity';
import { Course } from './course.entity';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Course, UserCourseAccess]),
    AuthModule,
  ],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}
