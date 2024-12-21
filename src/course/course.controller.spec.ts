import { Test, TestingModule } from '@nestjs/testing';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { RoleEnum } from 'src/common/enums/roles.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { LevelEnum } from './enums/level.enum';
import { Course } from './course.entity';

const commonCourse = {
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
  createdAt: new Date(),
  lessons: [],
  comments: [],
  ratings: [],
  accesses: [],
  courseTags: [],
};

describe('CourseController', () => {
  let controller: CourseController;
  let service: CourseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CourseController],
      providers: [
        {
          provide: CourseService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOneById: jest.fn(),
            updateById: jest.fn(),
            removeById: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<CourseController>(CourseController);
    service = module.get<CourseService>(CourseService);
  });

  describe('create', () => {
    it('should create a new course', async () => {
      const createCourseDto: CreateCourseDto = {
        title: 'Test Course',
        description: 'Test Description',
        level: LevelEnum.BEGINNER,
      };

      const result = {
        id: 1,
        ...createCourseDto,
        ...commonCourse,
      };

      jest.spyOn(service, 'create').mockResolvedValue(result);

      expect(await controller.create(createCourseDto)).toEqual(result);
      expect(service.create).toHaveBeenCalledWith(createCourseDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of courses', async () => {
      const result = [
        {
          id: 1,
          title: 'Test Course',
          description: 'Test Description',
          level: LevelEnum.BEGINNER,
          ...commonCourse,
        },
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll()).toEqual(result);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single course', async () => {
      const result = {
        id: 1,
        title: 'Test Course',
        description: 'Test Description',
        level: LevelEnum.BEGINNER,
        ...commonCourse,
      };

      jest.spyOn(service, 'findOneById').mockResolvedValue(result);

      expect(await controller.findOne(1)).toEqual(result);
      expect(service.findOneById).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a course', async () => {
      const updateCourseDto = {
        title: 'Updated Course',
        description: 'Updated Description',
        level: LevelEnum.INTERMEDIATE,
      };

      const result: Course = {
        id: 1,
        ...commonCourse,
        ...updateCourseDto,
      };

      jest.spyOn(service, 'updateById').mockResolvedValue(result);

      expect(await controller.update(1, updateCourseDto)).toEqual(result);
      expect(service.updateById).toHaveBeenCalledWith(1, updateCourseDto);
    });
  });

  describe('remove', () => {
    it('should remove a course', async () => {
      jest.spyOn(service, 'removeById').mockResolvedValue(undefined);

      await controller.remove(1);
      expect(service.removeById).toHaveBeenCalledWith(1);
    });
  });
});
