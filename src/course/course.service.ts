import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Course } from './course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    const existingCourse = await this.courseRepository.findOne({
      where: { title: createCourseDto.title },
    });
    if (existingCourse) {
      throw new NotFoundException('Course with this title already exists');
    }
    const course = this.courseRepository.create(createCourseDto);
    return this.courseRepository.save(course);
  }

  async findOne(
    query: FindOptionsWhere<Course> | FindOptionsWhere<Course>[],
  ): Promise<Course> {
    const course = await this.courseRepository.findOne({
      where: query,
    });
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    return course;
  }

  async findMany(
    query?: FindOptionsWhere<Course> | FindOptionsWhere<Course>[],
  ): Promise<Course[]> {
    return this.courseRepository.find({
      where: query,
    });
  }

  async findAll(): Promise<Course[]> {
    return this.findMany();
  }

  async findOneById(id: number): Promise<Course> {
    return this.findOne({ id });
  }

  async updateById(
    id: number,
    updateCourseDto: UpdateCourseDto,
  ): Promise<Course> {
    const course = await this.courseRepository.preload({
      id,
      ...updateCourseDto,
    });
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    return this.courseRepository.save(course);
  }

  async removeById(id: number): Promise<void> {
    const course = await this.findOne({ id });
    await this.courseRepository.remove(course);
  }
}
