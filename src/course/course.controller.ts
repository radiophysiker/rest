import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CourseService } from './course.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { RoleEnum } from 'src/common/enums/roles.enum';

@Controller('course')
@UseGuards(RolesGuard)
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  @Roles(RoleEnum.AUTHOR)
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.courseService.create(createCourseDto);
  }

  @Get()
  findAll() {
    return this.courseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.courseService.findOneById(id);
  }

  @Patch(':id')
  @Roles(RoleEnum.ADMIN, RoleEnum.AUTHOR)
  update(@Param('id') id: number, @Body() updateCourseDto: UpdateCourseDto) {
    return this.courseService.updateById(id, updateCourseDto);
  }

  @Delete(':id')
  @Roles(RoleEnum.ADMIN, RoleEnum.AUTHOR)
  remove(@Param('id') id: number) {
    return this.courseService.removeById(id);
  }
}
