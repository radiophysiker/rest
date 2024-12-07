import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Course } from './course.entity';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { LevelEnum } from './enums/level.enum';
import { RoleEnum } from 'src/common/enums/roles.enum';

const mockCourse: Course = {
  id: 1,
  title: 'Test Course',
  description: 'A test course description',
  level: LevelEnum.BEGINNER,
  createdAt: new Date(),
  author: {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123',
    role: RoleEnum.AUTHOR,
    createdAt: new Date(),
    updatedAt: new Date(),
    courses: [],
    comments: [],
    ratings: [],
  },
  lessons: [],
  comments: [],
  ratings: [],
  courseTags: [],
  accesses: [],
};

describe('CourseService', () => {
  let service: CourseService;

  const courseRepositoryMock = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    preload: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CourseService,
        {
          provide: getRepositoryToken(Course),
          useValue: courseRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<CourseService>(CourseService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new course', async () => {
      const createDto: CreateCourseDto = {
        title: 'Unique Course',
        description: 'Unique description',
        level: LevelEnum.BEGINNER,
      };
      courseRepositoryMock.findOne.mockResolvedValue(undefined);
      courseRepositoryMock.create.mockReturnValue(createDto);
      courseRepositoryMock.save.mockResolvedValue({ id: 2, ...createDto });

      const result = await service.create(createDto);
      expect(courseRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { title: createDto.title },
      });
      expect(courseRepositoryMock.create).toHaveBeenCalledWith(createDto);
      expect(courseRepositoryMock.save).toHaveBeenCalledWith(createDto);
      expect(result.title).toBe('Unique Course');
    });

    it('should create return NotFoundException if repeat title', async () => {
      const createDto: CreateCourseDto = {
        title: 'Test Course',
        description: 'Desc',
        level: LevelEnum.BEGINNER,
      };
      courseRepositoryMock.findOne.mockResolvedValue(mockCourse);

      await expect(service.create(createDto)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('findOne', () => {
    it('должен вернуть курс, если он существует', async () => {
      courseRepositoryMock.findOne.mockResolvedValue(mockCourse);
      const result = await service.findOne({ title: 'Test Course' });
      expect(result).toEqual(mockCourse);
    });

    it('должен бросить исключение, если курс не найден', async () => {
      courseRepositoryMock.findOne.mockResolvedValue(null);
      await expect(
        service.findOne({ title: 'Non-existent' }),
      ).rejects.toThrowError(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('должен вернуть список курсов', async () => {
      courseRepositoryMock.find.mockResolvedValue([mockCourse]);
      const result = await service.findAll();
      expect(result).toEqual([mockCourse]);
      expect(courseRepositoryMock.find).toHaveBeenCalled();
    });
  });

  describe('findOneById', () => {
    it('должен вернуть курс по ID', async () => {
      courseRepositoryMock.findOne.mockResolvedValue(mockCourse);
      const result = await service.findOneById(1);
      expect(result).toEqual(mockCourse);
      expect(courseRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe('updateById', () => {
    it('должен обновить существующий курс', async () => {
      const updateDto: UpdateCourseDto = { description: 'Updated desc' };
      const updatedCourse = { ...mockCourse, ...updateDto };
      courseRepositoryMock.preload.mockResolvedValue(updatedCourse);
      courseRepositoryMock.save.mockResolvedValue(updatedCourse);

      const result = await service.updateById(mockCourse.id, updateDto);
      expect(courseRepositoryMock.preload).toHaveBeenCalledWith({
        id: mockCourse.id,
        ...updateDto,
      });
      expect(courseRepositoryMock.save).toHaveBeenCalledWith(updatedCourse);
      expect(result.description).toBe('Updated desc');
    });

    it('должен бросить исключение, если курс не найден при обновлении', async () => {
      courseRepositoryMock.preload.mockResolvedValue(null);
      await expect(
        service.updateById(999, { title: 'Not found' }),
      ).rejects.toThrowError(NotFoundException);
    });
  });

  describe('removeById', () => {
    it('должен удалить курс, если он существует', async () => {
      courseRepositoryMock.findOne.mockResolvedValue(mockCourse);
      courseRepositoryMock.remove.mockResolvedValue(undefined);

      await service.removeById(mockCourse.id);
      expect(courseRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { id: mockCourse.id },
      });
      expect(courseRepositoryMock.remove).toHaveBeenCalledWith(mockCourse);
    });

    it('должен бросить исключение, если курс не найден при удалении', async () => {
      courseRepositoryMock.findOne.mockResolvedValue(null);
      await expect(service.removeById(999)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });
});
