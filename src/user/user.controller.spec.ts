import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';
import { RoleEnum } from 'src/common/enums/roles.enum';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockUser: User = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    password: 'hashedpassword',
    role: RoleEnum.USER,
    createdAt: new Date(),
    updatedAt: new Date(),
    courses: [],
    comments: [],
    ratings: [],
  };

  const mockUserService = {
    create: jest.fn(),
    findMany: jest.fn(),
    findById: jest.fn(),
    updateById: jest.fn(),
    removeById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a user successfully', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };

      jest.spyOn(service, 'create').mockResolvedValue(mockUser);

      const result = await controller.create(createUserDto);

      expect(result.password).toBeUndefined();
      expect(service.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findAll', () => {
    it('should return a list of users', async () => {
      jest.spyOn(service, 'findMany').mockResolvedValue([mockUser]);

      await controller.findAll();

      expect(service.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      jest.spyOn(service, 'findById').mockResolvedValue(mockUser);

      await controller.findOne(1);

      expect(service.findById).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest
        .spyOn(service, 'findById')
        .mockRejectedValue(new NotFoundException());

      await expect(controller.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a user successfully', async () => {
      const updateUserDto: UpdateUserDto = { username: 'updateduser' };
      const updatedUser = { ...mockUser, ...updateUserDto };

      jest.spyOn(service, 'updateById').mockResolvedValue(updatedUser);

      const result = await controller.update(1, updateUserDto);

      expect(result.username).toEqual(updatedUser.username);
      expect(service.updateById).toHaveBeenCalledWith(1, updateUserDto);
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest
        .spyOn(service, 'updateById')
        .mockRejectedValue(new NotFoundException());

      await expect(
        controller.update(1, { username: 'updateduser' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a user successfully', async () => {
      jest.spyOn(service, 'removeById').mockResolvedValue(mockUser);

      await controller.remove(1);

      expect(service.removeById).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest
        .spyOn(service, 'removeById')
        .mockRejectedValue(new NotFoundException());

      await expect(controller.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});
