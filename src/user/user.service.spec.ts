import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<User>;

  const mockUserRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    create: jest.fn(),
    merge: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new user successfully', async () => {
      const createUserDto = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
      };

      const hashedPassword = 'hashedPassword';
      jest.spyOn(bcrypt as any, 'genSalt').mockResolvedValue('salt');
      jest.spyOn(bcrypt as any, 'hash').mockResolvedValueOnce('hashedPassword');
      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue({
        ...createUserDto,
        password: hashedPassword,
      });
      mockUserRepository.save.mockResolvedValue({
        id: 1,
        ...createUserDto,
        password: hashedPassword,
      });

      const result = await userService.create(createUserDto);

      expect(result).toEqual({
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
        password: hashedPassword,
      });
      expect(mockUserRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockUserRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should throw ConflictException if user exists', async () => {
      const createUserDto = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
      };
      mockUserRepository.findOne.mockResolvedValue({ id: 1 } as User);

      await expect(userService.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('removeOne', () => {
    it('should remove a user successfully', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        username: 'test',
      } as User;
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(userRepository, 'remove').mockResolvedValue(user);

      const result = await userService.removeOne({ id: 1 });

      expect(result).toEqual(user);
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(userRepository.remove).toHaveBeenCalledWith(user);
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(userService.removeOne({ id: 1 })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateOne', () => {
    it('should update a user successfully', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        username: 'test',
      } as User;
      const updateUserDto = { username: 'updatedTest' };
      const updatedUser = { ...user, ...updateUserDto };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(userRepository, 'merge').mockReturnValue(updatedUser);
      jest.spyOn(userRepository, 'save').mockResolvedValue(updatedUser);

      const result = await userService.updateOne({ id: 1 }, updateUserDto);

      expect(result).toEqual(updatedUser);
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(userRepository.merge).toHaveBeenCalledWith(user, updateUserDto);
      expect(userRepository.save).toHaveBeenCalledWith(updatedUser);
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(
        userService.updateOne({ id: 1 }, { username: 'updatedTest' }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
